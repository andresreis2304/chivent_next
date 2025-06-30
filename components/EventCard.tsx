import { link } from 'fs';
import React from 'react';
import Link from 'next/link'; 
import { Chronos } from '@jstiava/chronos';
import { enqueueSnackbar } from 'notistack';

export default function EventCard(props: any) {
  const { event, Cart } = props;
  const { cart, setCart, handleAddOne } = Cart;

  const addToCart = () => {
    if (cart.some((i: { event_id: any }) => i.event_id === event.event_id)) {
      handleAddOne(event.event_id);
      enqueueSnackbar('Event added successfully', { variant: 'success' });
    } else {
      setCart([...cart, { ...event, quantity: 1 }]);
      enqueueSnackbar('Event added successfully', { variant: 'success' });
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
        src={event.image_url}
        alt={event.name}
        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
      />
      <div style={{ flex: 1 }}>
        <h2>{event.name}</h2>
        <p>{event.date} • {event.venue}</p>
        <p>Start: {event.start_time} • End: {event.end_time}</p>
        <p>{event.info}</p>
        <button onClick={addToCart}>Add to Cart</button>
        <Link
          href={`/${event.event_id}`}
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
