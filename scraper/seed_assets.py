from database import get_connection

def seed_more():
    conn = get_connection()
    cur = conn.cursor()
    
    tickers = [
        ('BTC', 'Bitcoin'), ('ETH', 'Ethereum'), ('SOL', 'Solana'), ('MON', 'Monad'),
        ('OIL', 'Crude Oil'), ('XAU', 'Gold'), ('XAG', 'Silver'), ('XAUT', 'Tether Gold'),
        ('DXY', 'US Dollar Index'), ('SPX', 'S&P 500'), ('NDX', 'Nasdaq 100'), ('US10Y', 'US 10-Year Bond Yield')
    ]
    
    print("[*] Seeding assets into database...")
    for ticker, name in tickers:
        cur.execute("""
            INSERT INTO assets (ticker, name) VALUES (%s, %s)
            ON CONFLICT (ticker) DO UPDATE SET name = EXCLUDED.name, is_active = TRUE
        """, (ticker, name))
        print(f"[+] Synced: {ticker}")
    
    conn.commit()
    cur.close()
    conn.close()
    print("Done!")

if __name__ == '__main__':
    seed_more()
