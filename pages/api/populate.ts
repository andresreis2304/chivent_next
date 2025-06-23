import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import axios from 'axios';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.API_KEY}&city=Chicago`
    );
    const data = response.data;

    if (!data._embedded?.events) {
      return res.status(404).json({ message: 'No events found' });
    }

    for (const event of data._embedded.events) {
      const insertQuery = `
        INSERT INTO events (name, event_date, location, image_url, start_time, end_time, info)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (event_id) DO NOTHING;
      `;
      const values = [
        event.name,
        event.dates.start?.localDate ?? 'TBA',
        event._embedded?.venues?.[0]?.name ?? 'TBA',
        event.images?.[0]?.url ?? '',
        event.dates.start?.localTime ?? 'TBA',
        event.dates.end?.localTime ?? 'TBA',
        event.info ?? event.pleaseNote ?? '',
      ];

      await pool.query(insertQuery, values);
    }

    res.status(200).json({ message: 'Events inserted successfully' });
  } catch (error) {
    console.error('Insert failed:', error);
    res.status(500).json({ message: 'Failed to insert events' });
  }
}
