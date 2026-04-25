'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const supabase = createClient('admin');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = isSignUp 
        ? await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback?next=/admin` : undefined
            }
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else if (isSignUp && !data.session) {
        setError("Account created! Please check your email to confirm your account.");
        setLoading(false);
      } else if (data.user) {
        // Double check admin status in DB
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();

        if (!profile?.is_admin) {
          setError("Access Denied: You do not have administrator privileges.");
          await supabase.auth.signOut();
          setLoading(false);
        } else {
          router.push('/admin');
          setTimeout(() => {
            router.refresh();
            setLoading(false);
          }, 1000);
        }
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  // Inline Styles - No Tailwind needed
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#050505',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'monospace',
    padding: '20px'
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#0a0a0a',
    border: '2px solid #c5ff00',
    padding: '40px',
    boxShadow: '10px 10px 0px rgba(197, 255, 0, 0.1)'
  };

  const headerStyle: React.CSSProperties = {
    color: '#c5ff00',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  };

  const subHeaderStyle: React.CSSProperties = {
    color: '#666',
    fontSize: '12px',
    textAlign: 'center',
    marginBottom: '30px',
    textTransform: 'uppercase'
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '20px'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#c5ff00',
    fontSize: '10px',
    fontWeight: 'bold',
    marginBottom: '8px',
    textTransform: 'uppercase'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#000',
    border: '1px solid #333',
    padding: '12px',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#c5ff00',
    color: '#000',
    border: 'none',
    padding: '15px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textTransform: 'uppercase',
    marginTop: '10px'
  };

  const errorStyle: React.CSSProperties = {
    color: '#ff4444',
    fontSize: '10px',
    marginTop: '15px',
    textAlign: 'center',
    textTransform: 'uppercase'
  };

  const toggleButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#444',
    fontSize: '10px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginTop: '20px',
    width: '100%',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          Admin {isSignUp ? 'Sign Up' : 'Login'}
        </div>
        <div style={subHeaderStyle}>
          Restricted Access Area
        </div>

        <form onSubmit={handleAuth}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={inputStyle}
              required
            />
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Processing...' : (isSignUp ? 'Create Admin Account' : 'Login Now')}
          </button>
        </form>

        {error && <div style={errorStyle}>Error: {error}</div>}

        <button 
          onClick={() => setIsSignUp(!isSignUp)} 
          style={toggleButtonStyle}
        >
          {isSignUp ? 'Already have an account? Login' : 'Need an admin account? Register'}
        </button>
      </div>
    </div>
  );
}
