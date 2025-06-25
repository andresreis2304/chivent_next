import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, date, start_time, end_time, venue, info, image_url } = req.body;

  try {
    await pool.query(
      `INSERT INTO events (name, event_date, location, image_url, start_time, end_time, info)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [name, date, venue, image_url, start_time, end_time, info]
    );

    res.status(201).json({ message: 'Event created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating event' });
  }
}
