import { useRouter } from 'next/router';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { SnackbarProvider, useSnackbar } from 'notistack';

export default function LoginPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')

  const [isError, setError] = useState(false);
  const [loading, setLoading]   = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    console.log('Log in button pressed.');
    const allValuesFilled = username.trim() !== '' && password.trim() !== '';
    if (!allValuesFilled) {
        enqueueSnackbar('Please fill in all fields.', { variant: 'warning' });
        setError(true);
        setPassword('');
        return;
    }

    const response = await fetch('/api/signUp', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, username, password})
    })

    if (!response.ok) {
      enqueueSnackbar('Something went wrong. Please try again.', {
        variant: 'error',
      });
        setError(true);
        setPassword('');
        return;
    }

    const data = await response.json();
    enqueueSnackbar('Signed up successfully! 🎉', { variant: 'success' });
    router.push('/')

};

  return (
    <div style={{ width: '100vw', boxSizing: 'border-box' }}>
      <Navbar cartCount={0} />

      <div
        style={{
          maxWidth: 400,
          margin: '4rem auto',
          padding: '2rem',
          border: '1px solid #ccc',
          borderRadius: 8,
          boxShadow: '0 2px 6px rgba(0,0,0,.1)',
          textAlign: 'center',
        }}
      >
        <h1>Sign Up</h1>

        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            style={{
              width: '100%',
              marginBottom: '0.8rem',
              padding: '0.5rem',
              borderRadius: 4,
              border: '1px solid #999',
            }}
          />

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            style={{
              width: '100%',
              marginBottom: '0.8rem',
              padding: '0.5rem',
              borderRadius: 4,
              border: '1px solid #999',
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: 4,
              border: '1px solid #999',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.6rem',
              background: loading ? '#9dbb6e' : '#86af49',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}