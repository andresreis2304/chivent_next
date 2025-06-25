import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { event_id },
    method,
  } = req;

  if (method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, date, venue, image_url, start_time, end_time, info } = req.body;

  try {
    const result = await pool.query(
      `UPDATE events
       SET name = $1,
           event_date = $2,
           location = $3,
           image_url = $4,
           start_time = $5,
           end_time = $6,
           info = $7
       WHERE event_id = $8`,
      [name, date, venue, image_url, start_time, end_time, info, event_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
}
