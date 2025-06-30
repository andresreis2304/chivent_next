import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SnackbarProvider } from 'notistack';
import useCart from '@/context/useCart';

export default function MyApp({ Component, pageProps }: AppProps) {
  const Cart = useCart();               // ↪ your custom hook is still fine

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      {/* everything that needs snackbars lives INSIDE the provider */}
      <div style={{ width: '100vw', boxSizing: 'border-box', margin: 0 }}>
        <Component {...pageProps} Cart={Cart} />
      </div>
    </SnackbarProvider>
  );
}
