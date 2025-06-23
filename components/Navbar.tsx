'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { use } from 'react';

type NavbarProps = {
  cartCount: number;
};

export default function Navbar({ cartCount }: NavbarProps) {
  const router = useRouter();

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#86af49',   // medium green 
        color: 'white',
        padding: '1rem',
        borderBottom: '5px solid black',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link
          href="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '24px',
          }}
        >Chivent</Link>

        <button
          onClick={() => router.push('/login')}
          style={{
            backgroundColor: 'white',
            color: '#86af49',
            border: 'none',
            borderRadius: 4,
            padding: '0.4rem 0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >Login</button>
      </div>

      <div style={{ fontSize: '20px' }}>
        Events in Chicago
      </div>

      <div>
        <Link onClick={(e)=>{
          e.preventDefault()
          router.push('/cart')}} href="/cart" style={{ color: 'white', textDecoration: 'none' }}>
          🛒
        </Link>
        <span style={{ marginLeft: '0.5rem' }}>
          Cart Items: {cartCount}
        </span>
      </div>
    </nav>
  );
}
