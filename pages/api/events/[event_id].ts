import type { NextApiRequest, NextApiResponse } from 'next';
import { enqueueSnackbar } from 'notistack';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {event_id} = req.query;
  const id = event_id as string;

  // if (method !== 'GET'|| method !== 'DELETE' || method !== 'PUT' ) {
  //   return res.status(405).json({ message: 'Method not allowed' });
  // }

  switch (req.method){
    case 'GET':
      try {
        const result = await pool.query(
          'SELECT * FROM events WHERE event_id = $1',
          [event_id]
        );
    
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Event not found' });
        }
    
        res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Failed to fetch event' });
      }

    case 'PUT':
      const {name, event_date, location, image_url, start_time, end_time, info} = req.body;
      // if (!name || !event_date || !location) {
      //   return res.status(400).json({ message: 'Missing required fields' });
      // }
      try{
        const { rowCount } = await pool.query(
          `UPDATE events
             SET name = $1,
                 event_date = $2,
                 location = $3,
                 image_url = $4,
                 start_time = $5,
                 end_time = $6,
                 info = $7
           WHERE event_id = $8`,
          [name, event_date, location, image_url, start_time, end_time, info, event_id]
        );

        return rowCount
          ? res.status(200).json({ message: 'Event updated' })
          : res.status(404).json({ message: 'Event not found' });
      } catch (err) {
        
        return res.status(500).json({ message: 'Failed to update event' });
      }

    case 'DELETE':
        try {
          const { rowCount } = await pool.query(
            'DELETE FROM events WHERE event_id = $1',
            [id]
          );
          return rowCount
            ? res.status(200).json({ message: 'Event deleted' })
            : res.status(404).json({ message: 'Event not found' });
          } catch (err) {
            
          return res.status(500).json({ message: 'Failed to delete event' });
        }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }


}
