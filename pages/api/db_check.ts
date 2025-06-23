// pages/api/db-check.ts
import { Pool } from 'pg';
import type { NextApiRequest, NextApiResponse } from 'next';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await pool.query('SELECT NOW()');
    return res.status(200).json({ message: 'Connected to DB', time: result.rows[0].now });
  } catch (err) {
    console.error('DB check failed:', err);
    return res.status(500).json({ message: 'Failed to connect to DB' });
  }
}
