from telethon import TelegramClient, events
from telethon.tl.functions.channels import JoinChannelRequest
from telethon.tl.types import PeerChannel, InputPeerChannel
import os
import asyncio
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
from database import save_market_event, is_event_exists
from ai_processor import process_message

load_dotenv()

API_ID = os.getenv('TELEGRAM_API_ID')
API_HASH = os.getenv('TELEGRAM_API_HASH')
PHONE = os.getenv('TELEGRAM_PHONE')

# Target channels - supports both @username (str) and channel IDs (int)
TARGET_CHANNELS = [
    '@marketfeed',
    '@WatcherGuru',
    -1003943362704,   # KabarChog News (by Peer ID)
]

# Notification Bot config
BOT_TOKEN = os.getenv('NOTIFICATION_BOT_TOKEN')
NOTIFICATION_USER_ID = os.getenv('NOTIFICATION_USER_ID')

# Concurrency config
MAX_CONCURRENT_TASKS = 5
semaphore = asyncio.Semaphore(MAX_CONCURRENT_TASKS)

# Cache for channel names (resolved once)
_channel_name_cache = {}

async def resolve_channel_name(client_instance, channel):
    """Resolve a channel identifier to a human-readable name/handle."""
    if isinstance(channel, str):
        return channel  # Already a @handle

    if channel in _channel_name_cache:
        return _channel_name_cache[channel]

    try:
        entity = await client_instance.get_entity(channel)
        name = getattr(entity, 'username', None)
        if name:
            name = f"@{name}"
        else:
            name = getattr(entity, 'title', str(channel))
        _channel_name_cache[channel] = name
        return name
    except Exception as e:
        print(f"[!] Could not resolve channel {channel}: {e}")
        print(f"    Trying to join channel first...")
        try:
            # Try joining the channel — works if the account has access
            await client_instance(JoinChannelRequest(channel))
            entity = await client_instance.get_entity(channel)
            name = getattr(entity, 'username', None)
            if name:
                name = f"@{name}"
            else:
                name = getattr(entity, 'title', str(channel))
            _channel_name_cache[channel] = name
            print(f"    ✓ Joined and resolved: {name}")
            return name
        except Exception as e2:
            print(f"    ✗ Failed to join: {e2}")
            print(f"    → Skipping this channel. Make sure the scraper account has joined it.")
            return None  # Return None to signal unresolvable

def send_telegram_notification(data):
    if not BOT_TOKEN or not NOTIFICATION_USER_ID:
        return

    sentiment_emoji = {
        'bullish': '🚀',
        'bearish': '🔻',
        'neutral': '⚖️'
    }.get(data['sentiment'].lower(), 'ℹ️')

    message = (
        f"<b>{sentiment_emoji} {data['headline']}</b>\n\n"
        f"{data['summary']}\n\n"
        f"<b>Sentiment:</b> {data['sentiment'].capitalize()}\n"
        f"<b>Confidence:</b> {data['confidence']:.2f}\n"
        f"<b>Channel:</b> {data['channel_handle']}\n"
    )
    
    if data.get('impact_assets'):
        impacts = []
        for asset in data['impact_assets']:
            ticker = asset.get('ticker', 'N/A')
            direction = asset.get('direction', 'N/A')
            impacts.append(f"• {ticker}: {direction}")
        if impacts:
            message += "\n<b>Impact Assets:</b>\n" + "\n".join(impacts)

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": NOTIFICATION_USER_ID,
        "text": message,
        "parse_mode": "HTML"
    }
    
    try:
        requests.post(url, json=payload, timeout=10)
    except Exception as e:
        print(f"[!] Failed to send Telegram notification: {e}")

client = TelegramClient('scrapper_bot', int(API_ID), API_HASH)

async def handle_message(event, chat_handle):
    msg_text = event.message.message
    if not msg_text or len(msg_text) < 10:
        return

    # Check for duplicates before processing with AI
    msg_id = event.message.id
    if is_event_exists(msg_id, chat_handle):
        print(f"[-] Skipping duplicate message {msg_id} from {chat_handle}")
        return

    print(f"[*] Processing message from {chat_handle}...")
    
    # Process with AI
    ai_result = process_message(msg_text)
    
    if ai_result:
        # Enrich data for DB
        ai_result['tg_msg_id'] = event.message.id
        ai_result['channel_handle'] = chat_handle
        ai_result['timestamp'] = event.message.date
        ai_result['raw_text'] = msg_text
        
        # Save to Postgres
        save_market_event(ai_result)
        print(f"[+] Saved Intelligence: {ai_result['headline']}")
        
        # Send notification
        send_telegram_notification(ai_result)
    else:
        print(f"[!] AI returned empty or failed for message from {chat_handle}")

async def process_sync_message(message, chat_handle):
    """Worker to process historical messages with concurrency control."""
    async with semaphore:
        # Mock event structure for the handler
        class MockEvent:
            def __init__(self, msg):
                self.message = msg
        
        await handle_message(MockEvent(message), chat_handle)
        # Small delay to prevent hitting rate limits too hard
        await asyncio.sleep(0.5)

async def sync_history(channel, display_name, days=1):
    print(f"[*] Syncing last {days} days from {display_name}...")
    try:
        limit_date = datetime.now() - timedelta(days=days)
        
        tasks = []
        async for message in client.iter_messages(channel, offset_date=limit_date, reverse=True):
            if message.message and len(message.message) > 10:
                tasks.append(process_sync_message(message, display_name))
                
        if tasks:
            print(f"[*] Dispatching {len(tasks)} messages for processing from {display_name}...")
            await asyncio.gather(*tasks)
                
        print(f"[+] Finished sync for {display_name}.")
    except Exception as e:
        print(f"[!] Error syncing {display_name}: {e}")
        print(f"    Skipping this channel and continuing...")

async def get_target_entities(client_instance, channels):
    """Memastikan semua target channel terdaftar dalam cache entity Telethon."""
    entities = []
    print("[*] Menyiapkan entitas target channel...")
    
    # Ambil semua dialog untuk mengisi cache entity internal Telethon
    print("[*] Mengambil dialog terbaru untuk sinkronisasi cache...")
    dialogs = await client_instance.get_dialogs()
    
    for channel_id in channels:
        try:
            # Mencoba mendapatkan entitas (ini akan berhasil jika ID ada di dialogs atau cache)
            entity = await client_instance.get_entity(channel_id)
            entities.append(entity)
            name = getattr(entity, 'username', None)
            display_name = f"@{name}" if name else getattr(entity, 'title', str(channel_id))
            print(f"    ✓ Berhasil mendapatkan akses ke: {display_name}")
        except ValueError:
            print(f"    ✗ Gagal menemukan info untuk ID: {channel_id}")
            print(f"      Pastikan akun Anda sudah bergabung (join) ke channel tersebut.")
        except Exception as e:
            print(f"    ! Error saat mengakses {channel_id}: {e}")
            
    return entities

async def main():
    await client.start()
    print("\n--- KabarChog Market Intelligence Scraper ---")
    
    # 1. Resolusi semua channel menjadi entitas Telethon yang valid
    target_entities = await get_target_entities(client, TARGET_CHANNELS)
    
    if not target_entities:
        print("[!] Tidak ada channel yang bisa diakses. Harap periksa TARGET_CHANNELS.")
        return

    # 2. Sync History secara paralel (menggunakan entitas yang sudah valid)
    print("\n[*] Memulai sinkronisasi histori pesan...")
    sync_tasks = []
    for entity in target_entities:
        # Tentukan nama tampilan
        name = getattr(entity, 'username', None)
        display_name = f"@{name}" if name else getattr(entity, 'title', str(entity.id))
        sync_tasks.append(sync_history(entity, display_name, days=2))
    
    if sync_tasks:
        await asyncio.gather(*sync_tasks)
    
    print("\n[*] Sinkronisasi selesai. Sekarang memantau pesan baru secara live...")

    # 3. Setup Listener menggunakan entitas yang sudah di-resolve
    @client.on(events.NewMessage(chats=target_entities))
    async def live_handler(event):
        try:
            chat = await event.get_chat()
            name = getattr(chat, 'username', None)
            chat_handle = f"@{name}" if name else getattr(chat, 'title', str(chat.id))
            await handle_message(event, chat_handle)
        except Exception as e:
            print(f"[!] Error pada live handler: {e}")

    await client.run_until_disconnected()

if __name__ == '__main__':
    try:
        client.loop.run_until_complete(main())
    except KeyboardInterrupt:
        print("\n[!] Scraper dihentikan oleh user.")

