import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

def get_connection():
    return psycopg2.connect(DATABASE_URL)

def init_db():
    conn = get_connection()
    cur = conn.cursor()
    
    # Create Assets Table (Watchlist)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS assets (
            ticker VARCHAR(20) PRIMARY KEY,
            name VARCHAR(100),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create Market Events Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS market_events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tg_msg_id BIGINT,
            channel_handle VARCHAR(100),
            event_time TIMESTAMP,
            headline VARCHAR(255),
            summary TEXT,
            sentiment VARCHAR(20),
            confidence FLOAT,
            impact_assets JSONB,
            categories TEXT[],
            tags TEXT[],
            raw_text TEXT,
            UNIQUE(tg_msg_id, channel_handle)
        );
    """)
    
    # Insert some default tickers if empty
    cur.execute("SELECT COUNT(*) FROM assets")
    if cur.fetchone()[0] == 0:
        tickers = [('BTC', 'Bitcoin'), ('ETH', 'Ethereum'), ('SOL', 'Solana'), ('MONAD', 'Monad')]
        cur.executemany("INSERT INTO assets (ticker, name) VALUES (%s, %s)", tickers)
    
    conn.commit()
    cur.close()
    conn.close()
    print("Database initialized successfully.")

def get_active_tickers():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT ticker FROM assets WHERE is_active = TRUE")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [row['ticker'] for row in rows]

def save_market_event(data):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO market_events (
                tg_msg_id, channel_handle, event_time, headline, summary, 
                sentiment, confidence, impact_assets, categories, tags, raw_text
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (tg_msg_id, channel_handle) DO NOTHING
        """, (
            data['tg_msg_id'], data['channel_handle'], data['timestamp'],
            data['headline'], data['summary'], data['sentiment'],
            data['confidence'], json_dumps(data['impact_assets']),
            data['categories'], data['tags'], data['raw_text']
        ))
        conn.commit()
    except Exception as e:
        print(f"Error saving event: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def is_event_exists(tg_msg_id, channel_handle):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT 1 FROM market_events WHERE tg_msg_id = %s AND channel_handle = %s",
            (tg_msg_id, channel_handle)
        )
        return cur.fetchone() is not None
    except Exception as e:
        print(f"Error checking event existence: {e}")
        return False
    finally:
        cur.close()
        conn.close()

def json_dumps(data):
    import json
    return json.dumps(data)

if __name__ == '__main__':
    init_db()
