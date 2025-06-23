'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          console.log('Logged in as:', data.user.username);
          if (data.user.role === 'admin') {
            setIsAdmin(true);
          } else {
            router.replace('/unauthorized');
          }
        } else {
          router.replace('/login');
        }
      })
      .catch(() => router.replace('/login'))
      .finally(() => setReady(true));
  }, [router]);

  if (!ready) return null;

  return (
    <>
      <Navbar cartCount={0} />
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Admin Board</h1>
        <p>Welcome, admin user.</p>
      </div>
    </>
  );
}
