import os
import asyncio
import requests
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv

from telethon import TelegramClient, events
from telethon.tl.functions.channels import JoinChannelRequest
from telethon.tl.types import PeerChannel, InputPeerChannel

from database import save_market_event, is_event_exists
from ai_processor import process_message

load_dotenv()

# Set up basic logging for background monitoring
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.WARNING)

API_ID = os.getenv('TELEGRAM_API_ID')
API_HASH = os.getenv('TELEGRAM_API_HASH')
PHONE = os.getenv('TELEGRAM_PHONE')

# Target channels
TARGET_CHANNELS = [
    '@marketfeed',
    '@WatcherGuru',
    -1003943362704,   # KabarChog News
]

# Notification Bot config
BOT_TOKEN = os.getenv('NOTIFICATION_BOT_TOKEN')
NOTIFICATION_USER_ID = os.getenv('NOTIFICATION_USER_ID')

# Concurrency config
MAX_CONCURRENT_TASKS = 5
semaphore = asyncio.Semaphore(MAX_CONCURRENT_TASKS)

# Cache for channel names
_channel_name_cache = {}

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

# Initialize client with defined retries to allow bubble-up on persistent failure
client = TelegramClient(
    'scrapper_bot', 
    int(API_ID), 
    API_HASH,
    connection_retries=10,        # Internal retries before bubbling up
    retry_delay=5,
    auto_reconnect=True
)

async def handle_message(event, chat_handle):
    msg_text = event.message.message
    if not msg_text or len(msg_text) < 10:
        return

    # msg_id check - wrap in to_thread because database.py uses psycopg2 (blocking)
    msg_id = event.message.id
    exists = await asyncio.to_thread(is_event_exists, msg_id, chat_handle)
    if exists:
        return

    print(f"[*] Processing message from {chat_handle}...")
    
    # AI processing - wrap in to_thread because ai_processor.py uses requests (blocking)
    ai_result = await asyncio.to_thread(process_message, msg_text)
    
    if ai_result:
        ai_result['tg_msg_id'] = event.message.id
        ai_result['channel_handle'] = chat_handle
        ai_result['timestamp'] = event.message.date
        ai_result['raw_text'] = msg_text
        
        # Save to Postgres (blocking)
        await asyncio.to_thread(save_market_event, ai_result)
        print(f"[+] Saved Intelligence: {ai_result['headline']}")
        
        # Send notification (blocking)
        await asyncio.to_thread(send_telegram_notification, ai_result)
    else:
        print(f"[!] AI returned empty or failed for message from {chat_handle}")

async def process_sync_message(message, chat_handle):
    async with semaphore:
        class MockEvent:
            def __init__(self, msg):
                self.message = msg
        await handle_message(MockEvent(message), chat_handle)
        await asyncio.sleep(0.1)  # Minimal delay

async def sync_history(channel, display_name, hours=1):
    print(f"[*] Syncing last {hours} hours from {display_name}...")
    try:
        limit_date = datetime.now() - timedelta(hours=hours)
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

async def get_target_entities(client_instance, channels):
    entities = []
    print("[*] Menyiapkan entitas target channel...")
    await client_instance.get_dialogs()
    
    for channel_id in channels:
        try:
            entity = await client_instance.get_entity(channel_id)
            entities.append(entity)
            name = getattr(entity, 'username', None)
            display_name = f"@{name}" if name else getattr(entity, 'title', str(channel_id))
            print(f"    ✓ Berhasil mendapatkan akses ke: {display_name}")
        except Exception as e:
            print(f"    ! Error saat mengakses {channel_id}: {e}")
    return entities

async def live_handler(event):
    try:
        chat = await event.get_chat()
        name = getattr(chat, 'username', None)
        chat_handle = f"@{name}" if name else getattr(chat, 'title', str(chat.id))
        await handle_message(event, chat_handle)
    except Exception as e:
        print(f"[!] Error pada live handler: {e}")

async def main():
    print("\n--- KabarChog Market Intelligence Scraper [Resilient Mode] ---")
    
    while True:
        try:
            if not client.is_connected():
                print("\n[*] Menghubungkan ke Telegram...")
                await client.start()
            
            target_entities = await get_target_entities(client, TARGET_CHANNELS)
            if not target_entities:
                print("[!] Tidak ada channel yang bisa diakses. Mencoba lagi dalam 30 detik...")
                await asyncio.sleep(30)
                continue

            print("\n[*] Memulai sinkronisasi histori pesan (3 jam terakhir)...")
            sync_tasks = []
            for entity in target_entities:
                name = getattr(entity, 'username', None)
                display_name = f"@{name}" if name else getattr(entity, 'title', str(entity.id))
                sync_tasks.append(sync_history(entity, display_name, hours=3))
            
            if sync_tasks:
                await asyncio.gather(*sync_tasks)
            
            print("\n[*] Sinkronisasi selesai. Sekarang memantau pesan baru secara live...")

            # Remove and re-add handler to avoid duplicates and ensure target_entities are fresh
            client.remove_event_handler(live_handler)
            client.add_event_handler(live_handler, events.NewMessage(chats=target_entities))

            # This will wait until a fatal disconnection occurs
            await client.run_until_disconnected()
            
        except (ConnectionError, BrokenPipeError, asyncio.CancelledError) as e:
            print(f"\n[!] Masalah koneksi terdeteksi: {e}")
            print("[*] Melakukan restart koneksi dalam 5 detik...")
            await asyncio.sleep(5)
            try:
                await client.disconnect()
            except:
                pass
        except Exception as e:
            print(f"\n[!] Error tidak terduga: {e}")
            print("[*] Restarting logic dalam 10 detik...")
            await asyncio.sleep(10)

if __name__ == '__main__':
    try:
        # Use a more stable loop run
        loop = asyncio.get_event_loop()
        loop.run_until_complete(main())
    except KeyboardInterrupt:
        print("\n[!] Scraper dihentikan oleh user.")
    except Exception as e:
        print(f"\n[!] Fatal Error: {e}")

