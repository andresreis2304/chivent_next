import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await pool.query('SELECT * FROM events ORDER BY event_date ASC;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
}
