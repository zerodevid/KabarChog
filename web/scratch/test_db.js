import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function test() {
  try {
    console.log('Connecting to database...');
    const res = await pool.query('SELECT count(*) FROM market_events');
    console.log('Success! Connection established.');
    console.log('Event count:', res.rows[0].count);
    process.exit(0);
  } catch (err) {
    console.error('Database connection failed:');
    console.error(err);
    process.exit(1);
  }
}

test();
