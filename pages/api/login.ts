import bcrypt from 'bcrypt';
import cookie, {serialize} from 'cookie';

import jwt, { Secret} from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';


const pool = new Pool({connectionString: process.env.DATABASE_URL});

export default async function handleRequest(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST'){
        res.setHeader('Allow', ['POST']);
        console.log('only post allowed')
        return res.status(405).end();
    }

    const {username, password} = req.body;

    if (!username || !password){
        console.log('missing creds')
        return res.status(400).json({message: 'Missing credentials'});

    }
    
    try{
        console.log('Attempting DB lookup for username:', username);
        const result = await pool.query('SELECT user_id, username, password_hash FROM users WHERE username = $1',
        [username]);
        console.log('Query completed. Rows returned:', result.rows.length);
    
        if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        //console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);

        const token = jwt.sign(
          { user_id: user.user_id, username: username }, 
          process.env.JWT_SECRET as Secret,
          { expiresIn: '7d' }
        );
        res.setHeader(
            'Set-Cookie',
            serialize('session', token, {
              httpOnly: true,
              //secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7,
              path: '/',
            }));
      
        return res.status(200).json({
            message: 'Login successful',
            user: { username: user.username, user_id: user.user_id }
          });
        } 
        catch (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error' });
        }

}