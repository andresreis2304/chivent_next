'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { use } from 'react';

type NavbarProps = {
  cartCount: number;
};

export default function Navbar({ cartCount }: NavbarProps) {
  const Router = useRouter();

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
      <div style={{ fontWeight: 'bold', fontSize: '24px' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
          Chivent
        </Link>
      </div>

      <div style={{ fontSize: '20px' }}>
        Events in Chicago
      </div>

      <div>
        <Link onClick={(e)=>{
          e.preventDefault()
          Router.push('/cart')}} href="/cart" style={{ color: 'white', textDecoration: 'none' }}>
          🛒
        </Link>
        <span style={{ marginLeft: '0.5rem' }}>
          Cart Items: {cartCount}
        </span>
      </div>
    </nav>
  );
}
