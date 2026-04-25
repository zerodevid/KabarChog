import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      'SELECT ticker FROM assets WHERE is_active = TRUE ORDER BY ticker ASC'
    );
    return NextResponse.json(result.rows.map(r => r.ticker));
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
