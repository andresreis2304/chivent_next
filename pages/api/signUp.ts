import bcrypt from 'bcrypt';
import cookie, {serialize} from 'cookie';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: "postgres://postgres:28327677ARr$@localhost:5432/postgres" });

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { email, username, password } = req.body;

  if (
    !email?.trim() ||
    !username?.trim() ||
    !password?.trim()
  ) {
    console.log('Missing credentials');
    return res.status(400).json({ message: 'Missing credentials' });
  }
  try {
    //check if the user already exists
    const existing = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Username or email already in use' });
    }
    const password_hash = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username',
      [username, email, password_hash]
    );

    const newUser = insertResult.rows[0];

    console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);
    const token = jwt.sign(
      { user_id: newUser.user_id, username: newUser.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    
    res.setHeader('Set-Cookie', cookie.serialize('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    }));

    return res.status(201).json({ message: 'Signup successful' });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error during signup' });
  }
}
