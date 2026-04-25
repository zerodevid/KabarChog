import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      'SELECT ticker, name FROM assets WHERE is_active = TRUE ORDER BY ticker ASC'
    );
    
    const tickers = result.rows.map(r => ({
      symbol: r.ticker,
      name: r.name,
      sentiment: Math.random() > 0.5 ? 'BULLISH' : 'BEARISH',
      change: (Math.random() * 8 - 2).toFixed(1) + '%'
    }));

    return NextResponse.json(tickers);
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
