import React from 'react';

export type Event = {
  id: number;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  info: string;
  image: string;
  price_min: number;
  price_max: number;
};

type EventCardProps = {
  event: Event;
  cart: any[];
  setCart: (cart: any[]) => void;
};

export default function EventCard({ event, cart, setCart }: EventCardProps) {
  const addToCart = () => {
    const existing = cart.find((e) => e.id === event.id);
    if (existing) {
      setCart(
        cart.map((e) =>
          e.id === event.id ? { ...e, quantity: e.quantity + 1 } : e
        )
      );
    } else {
      setCart([...cart, { ...event, quantity: 1 }]);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        display: 'flex',
        gap: '1rem',
      }}
    >
      <img
        src={event.image}
        alt={event.name}
        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
      />
      <div style={{ flex: 1 }}>
        <h2>{event.name}</h2>
        <p>{event.date} • {event.venue}</p>
        <p>Start: {event.start_time} • End: {event.end_time}</p>
        <p>{event.info}</p>
        <p>
          Price: ${event.price_min.toFixed(2)} – ${event.price_max.toFixed(2)}
        </p>
        <button onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
