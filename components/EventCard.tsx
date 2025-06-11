import { link } from 'fs';
import React from 'react';
import Link from 'next/link'; 
import { Chronos } from '@jstiava/chronos';

export default function EventCard(props: any) {
  const { event, Cart } = props;
  const { cart, setCart, handleAddOne } = Cart;

  const addToCart = () => {
    if (cart.some((i: { id: any; }) => i.id === event.id)) {
      handleAddOne(event.id);
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
        <Link
          href={`/events/${event.id}`}
          style={{
            display: 'inline-block',
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            background: '#86af49',
            color: '#fff',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          View details
        </Link>
      </div>
    </div>
  );
}
