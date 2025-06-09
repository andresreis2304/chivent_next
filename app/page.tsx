'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';

type EventType = {
  id: number;
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

export default function HomePage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [cart, setCart] = useState<any[]>([]); // Optional: define a proper CartItem type

  useEffect(() => {
    fetch('http://127.0.0.1:5000/events/all')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const totalItems = cart.reduce((sum, e) => sum + e.quantity, 0);

  return (
    <div>
      <Navbar cartCount={totalItems} />
      <div style={{ padding: '2rem' }}>
        {events.map((e) => (
          <EventCard key={e.id} event={e} cart={cart} setCart={setCart} />
        ))}
      </div>
    </div>
  );
}
