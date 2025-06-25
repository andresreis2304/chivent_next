'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

type Event = {
  event_id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  image_url: string;
  info: string;
  price_min: number;
  price_max: number;
};

export default function EventPage(props: any) {
  const { Cart } = props;
  const { cart, setCart } = Cart;
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  console.log("router.query.id:", router.query.id);

  useEffect(() => {
    if (!router.isReady) return;
  
    const idParam = router.query.id;
  
    if (!idParam || Array.isArray(idParam)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
  
    const eventId = parseInt(idParam, 10);
    if (isNaN(eventId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
  
    console.log("Fetching event with ID:", eventId);
  
    fetch(`/api/events/${eventId}`)
      .then(res => {
        if (!res.ok) throw new Error('404');
        return res.json();
      })
      .then(setEvent)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [router.isReady, router.query.id]);
  

  const totalItems = cart.reduce((s: any, e: any) => s + e.quantity, 0);

  const addToCart = () => {
    if (!event) return;

    const exists = cart.some((e: { event_id: string }) => e.event_id === event.event_id);
    if (exists) {
      setCart(
        cart.map((e: { event_id: string; quantity: number }) =>
          e.event_id === event.event_id ? { ...e, quantity: e.quantity + 1 } : e
        )
      );
    } else {
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
          src={event.image_url}
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

        <p style={{ maxWidth: 600 }}>
          <strong>Info:</strong> {event.info}
        </p>

        <button onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
