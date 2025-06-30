import { useRouter } from 'next/router';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { enqueueSnackbar } from 'notistack';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isError, setError] = useState(false);
  const [loading, setLoading]   = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    console.log('Log in button pressed.');
    const allValuesFilled = username.trim() !== '' && password.trim() !== '';
    if (!allValuesFilled) {
        console.log("Not all fields are filled.")
        setError(true);
        setPassword('');
        return;
    }

    const response = await fetch('/api/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
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
    router.push('/admin')

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
        <h1>Login</h1>

        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or e-mail"
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
              border: 'bold',
              borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in…' : 'Submit'}
          </button>
        </form>
        <button
          onClick={() => router.push('/signUp')}
          style={{
            marginTop: '1rem', 
            width: '100%',
            backgroundColor: '#86af49',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '0.6rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >Sign Up</button>

      </div>
    </div>
  );
}
