'use client';
import Navbar from '@/components/Navbar';

export default function CartPage(props: any) {
  const { Cart } = props;
  const { cart, handleAddOne, handleRemoveOne, handleRemoveAll } = Cart;

  const total = cart.reduce((s: any, e: { quantity: any; }) => s + e.quantity, 0);

  return (
    <div style={{ width: '100vw', boxSizing: 'border-box', margin: 0 }}>
      <Navbar cartCount={total} />
      <div style={{ paddingTop: '2rem', padding: '2rem', textAlign: 'center' }}>
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <p>No events in the cart yet.</p>
        ) : (
          cart.map((e: any) => (
            <div
              key={e.event_id}
              style={{
                border: '8px solid #86af49',
                backgroundColor: '#FFF',
                margin: '1rem 0',
                padding: '1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <img
                src={e.image}
                alt={e.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{e.name}</h3>
                <p style={{ margin: 0 }}>{e.date} • {e.place}</p>
                <p style={{ margin: '0.25rem 0 0 0' }}>Qty: {e.quantity}</p>
              </div>
              <button onClick={() => handleAddOne(e.event_id)}>+</button>
              <button onClick={() => handleRemoveOne(e.event_id)}>-</button>
              <button onClick={() => handleRemoveAll(e.event_id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
