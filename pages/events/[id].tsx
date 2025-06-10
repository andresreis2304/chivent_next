'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

// Define the type for a single event
type Event = {
  id: number;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  image: string;
  info: string;
  price_min: number;
  price_max: number;
};

// Props expected from parent (likely passed down via a wrapper layout or context)
type EventPageProps = {
  events: Event[];
  Cart: ReturnType<typeof import('@/context/useCart').default>;
};

export default function EventPage(props: any) {
  const { events, Cart } = props;
  const { cart, setCart } = Cart;

  const { id } = useParams();
  const numericId = Number(id);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const local = events.find((e) => e.id === numericId);

    if (local) {
      setEvent(local);
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:5000/event/${numericId}`)
      .then((res) => {
        if (!res.ok) throw new Error('404');
        return res.json();
      })
      .then((data) => setEvent(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [numericId, events]);

  const totalItems = cart.reduce((sum, e) => sum + e.quantity, 0);

  const addToCart = () => {
    if (cart.some(e => e.id === event?.id)) {
      setCart(cart.map(e =>
        e.id === event?.id ? { ...e, quantity: e.quantity + 1 } : e,
      ));
    } else if (event) {
      setCart([...cart, { ...event, quantity: 1 }]);
    }
  };

  if (loading) {
    return (
      <div style={{ width: '100vw' }}>
        <Navbar cartCount={totalItems} />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Loading event details…</h1>
        </div>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div style={{ width: '100vw' }}>
        <Navbar cartCount={totalItems} />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Event Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw' }}>
      <Navbar cartCount={totalItems} />
      <div
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <h1>{event.name}</h1>

        <img
          src={event.image}
          alt={event.name}
          style={{ width: 300, height: 300, objectFit: 'cover' }}
        />

        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Start:</strong> {event.start_time}
        </p>
        <p>
          <strong>End:</strong> {event.end_time}
        </p>
        <p>
          <strong>Venue:</strong> {event.venue}
        </p>

        {event.price_min !== null && (
          <p style={{ fontSize: '1rem', color: 'gray' }}>
            Min Price ${event.price_min.toFixed(2)}<br />
            Max Price ${event.price_max.toFixed(2)}
          </p>
        )}

        <p style={{ maxWidth: 600 }}>
          <strong>Info:</strong> {event.info}
        </p>

        <button onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
