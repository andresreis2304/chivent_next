// context/useCart.ts
'use client';
import { useState } from 'react';

interface CartItem {
  [key: string]: any;
  quantity: number;
}

export default function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddOne = (id: number) =>
    setCart(prev =>
      prev.map(e =>
        e.event_id === id ? { ...e, quantity: e.quantity + 1 } : e,
      ),
    );

  const handleRemoveOne = (id: number) =>
    setCart(prev =>
      prev
        .map(e =>
          e.event_id === id ? { ...e, quantity: e.quantity - 1 } : e,
        )
        .filter(e => e.quantity > 0),
    );

  const handleRemoveAll = (id: number) =>
    setCart(prev => prev.filter(e => e.event_id !== id));

  return { cart, setCart, handleAddOne, handleRemoveOne, handleRemoveAll };
}
