import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')

def check_all_tables_for_ticker_dupes():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    print("[*] Checking assets table (including inactive)...")
    cur.execute("SELECT ticker, name, is_active FROM assets")
    assets = cur.fetchall()
    
    ticker_tracker = {}
    name_tracker = {}
    
    for a in assets:
        t = a['ticker'].strip().upper()
        n = a['name'].strip().lower()
        
        if t in ticker_tracker:
            print(f"[!] Exact ticker dupe: {t} is in DB multiple times!")
        ticker_tracker[t] = ticker_tracker.get(t, 0) + 1
        
        if n in name_tracker:
            print(f"[!] Name '{a['name']}' is shared by tickers: {a['ticker']} and {name_tracker[n]}")
        name_tracker[n] = a['ticker']

    print("\n[*] Checking for tickers that are very similar (e.g. prefix)...")
    sorted_tickers = sorted(ticker_tracker.keys())
    for i in range(len(sorted_tickers)-1):
        for j in range(i+1, len(sorted_tickers)):
            t1 = sorted_tickers[i]
            t2 = sorted_tickers[j]
            if t2.startswith(t1) or t1.startswith(t2):
                print(f"[?] Potential overlap: {t1} and {t2}")

    cur.close()
    conn.close()

if __name__ == '__main__':
    check_all_tables_for_ticker_dupes()
