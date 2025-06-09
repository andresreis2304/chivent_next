'use client';

import React, { createContext, useContext, useState } from 'react';

export type CartItem = {
  id: number;
  name: string;
  date: string;
  place: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const CartContext = React.createContext<CartContextType>({
  cart: [],
  setCart: () => { throw new Error('setCart function must be overridden'); },
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
