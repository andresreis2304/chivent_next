import { useRouter } from "next/router";
import { useState } from "react";
import { hasToken, DEV_SECRET, clearToken, setToken } from '@/lib/auth';
import Navbar from "@/components/Navbar";

export default function LoginPage(){
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // If someone already has a token, kick them straight to /admin
  if (typeof window !== 'undefined' && hasToken()) {
    router.replace('/admin');
    return null;
  }

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    if(password == DEV_SECRET){
        setToken();
        router.push('/admin');
    }
    else{
        setError('Incorrect username or password');
        setPassword('');
    }
  };
  
  return (
    <div style={{ width: '100vw', boxSizing: 'border-box' }}>
      <Navbar cartCount={0} /> {/* remove if you don’t want the nav here */}
      <div
        style={{
          maxWidth: 400,
          margin: '4rem auto',
          padding: '2rem',
          border: '1px solid #ccc',
          borderRadius: 8,
          boxShadow: '0 2px 6px rgba(0,0,0,.1)',
          textAlign: 'center',
        }}>
            
        <h1>Admin Login</h1>

        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter admin password"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: 4,
              border: '1px solid #999',
            }}
          />
          <button
            type="submit"
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.6rem',
              background: '#86af49',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Log in
          </button>
        </form>

        {error && (
          <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
        )}
      </div>
    </div>
  );
}