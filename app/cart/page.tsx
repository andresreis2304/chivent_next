'use client';

import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const { cart, setCart } = useCart();
  console.log('Cart contents:', cart); // Debugging log

  const handleAddOne = (id: number) => {
    const updated = cart.map((e) =>
      e.id === id ? { ...e, quantity: e.quantity + 1 } : e
    );
    setCart(updated);
  };

  const handleRemoveOne = (id: number) => {
    const updated = cart
      .map((e) =>
        e.id === id ? { ...e, quantity: e.quantity - 1 } : e
      )
      .filter((e) => e.quantity > 0);
    setCart(updated);
  };

  const handleRemoveAll = (id: number) => {
    setCart(cart.filter((e) => e.id !== id));
  };

  const totalItems = cart?.reduce((sum, e) => sum + e.quantity, 0) || 0;

  return (
    <div style={{ width: '100vw', boxSizing: 'border-box', margin: 0 }}>
      <Navbar cartCount={totalItems} />
      <div style={{ paddingTop: '2rem', padding: '2rem', textAlign: 'center' }}>
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <p>No events in the cart yet.</p>
        ) : (
          cart.map((e) => (
            <div
              key={e.id}
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
              <button onClick={() => handleAddOne(e.id)}>+</button>
              <button onClick={() => handleRemoveOne(e.id)}>-</button>
              <button onClick={() => handleRemoveAll(e.id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
