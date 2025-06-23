import { verify } from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { parse } from 'cookie';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.session;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as any).user_id;

    const result = await pool.query(
      'SELECT user_id, username, email, role FROM users WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Success', user: result.rows[0] });
  } catch (err) {
    console.error('Error verifying token or querying user:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
