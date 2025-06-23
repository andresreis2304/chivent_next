import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasToken, clearToken } from '@/lib/auth';
import Navbar from '@/components/Navbar';


export default function Admin() {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        fetch('/api/me')
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              console.log('Logged in as:', data.user.username);
            } else {
              console.log('Not logged in');
            }
          });
      }, []);

    if (!ready) return null;

    return <h1>Admin board. Only authorized users</h1>

}