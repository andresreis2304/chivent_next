'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

type Event = {
  id: string;                //string, not number
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

export default function EventPage(props: any) {
  const { Cart } = props;
  const { cart, setCart } = Cart;
  const router = useRouter();

  const [event, setEvent]   = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* fetch once router is ready */
  useEffect(() => {
    if (!router.isReady) return;

    const idParam = router.query.id;
    if (typeof idParam !== 'string') {
      setNotFound(true);
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:5000/events/${encodeURIComponent(idParam)}`)   // string id
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
    if (cart.some(e => e.id === event?.id)) {
      setCart(cart.map(e =>
        e.id === event?.id ? { ...e, quantity: e.quantity + 1 } : e,
      ));
    } else if (event) {
      setCart([...cart, { ...event, quantity: 1 }]);
    }
  };

  /* render states  */
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

  /*success view */
  return (
    <div style={{ width: '100vw' }}>
      <Navbar cartCount={totalItems} />
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '1rem' }}>
        <h1>{event.name}</h1>

        <img src={event.image} alt={event.name}
             style={{ width: 300, height: 300, objectFit: 'cover' }} />

        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Start:</strong> {event.start_time}</p>
        <p><strong>End:</strong> {event.end_time}</p>
        <p><strong>Venue:</strong> {event.venue}</p>

        {event.price_min !== null && (
          <p style={{ fontSize: '1rem', color: 'gray' }}>
            Min Price ${event.price_min.toFixed(2)}<br />
            Max Price ${event.price_max.toFixed(2)}
          </p>
        )}

        <p style={{ maxWidth: 600 }}><strong>Info:</strong> {event.info}</p>

        <button onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
