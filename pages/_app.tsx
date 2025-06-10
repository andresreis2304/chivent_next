import { AppProps } from 'next/app';
import '../styles/globals.css';
import useCart from '@/context/useCart';

export const metadata = {
  title: 'Chivent',
  description: 'Events in Chicago',
};

export default function App({ Component, pageProps }: AppProps) {
  const Cart = useCart();

  return (
    <div style={{ width: '100vw', boxSizing: 'border-box', margin: 0 }}>
      <Component
        {...pageProps}
        Cart={Cart}
      />
    </div>
  );
}