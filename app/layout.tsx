import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'Chivent',
  description: 'Events in Chicago',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

