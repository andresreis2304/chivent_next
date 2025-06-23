'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import type useCart from '@/context/useCart';

type EventType = {
  event_id: number;
  name: string;
  date: string;
  image: string;
  price_min: number;
  price_max: number;
  start_time: string;
  end_time: string;
  venue: string;
  info: string;
};

type HomePageProps = {
  Cart: ReturnType<typeof useCart>;   // 💡  type-safe
};

export default function HomePage(props: any) {
  const { Cart, } = props;     // ← use THE cart
  const {cart, setCart} = Cart;
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(setEvents)
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  const total= cart.reduce((s, e) => s + e.quantity, 0);

  return (
    <div>
      <Navbar cartCount={total} />
      <div style={{ padding: '2rem' }}>
        {events.map(e => (
          <EventCard key={e.event_id} event={e} Cart={Cart} />
        ))}
      </div>
    </div>
  );
}
