'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          }
        },
      });
      if (error) setError(error.message);
      else setMessage('Check your email to confirm your account!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else router.push('/editor');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">          <h1 className="mono">{isSignUp ? 'INITIALIZE_USER' : 'SYSTEM_ACCESS'}</h1>
          <p className="text-dim text-sm">
            {isSignUp ? 'Create your operational credentials.' : 'Authenticate to access the engine.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          {isSignUp && (
            <div className="input-group">
              <label className="mono text-xxs">FULL_NAME</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSignUp}
              />
            </div>
          )}

          <div className="input-group">
            <label className="mono text-xxs">OPERATOR_EMAIL</label>
            <input
              type="email"
              placeholder="operator@system.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="mono text-xxs">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-msg mono text-xxs">{error.toUpperCase()}</div>}
          {message && <div className="success-msg mono text-xxs">{message.toUpperCase()}</div>}

          <button type="submit" className="btn-brutal auth-btn" disabled={loading}>
            {loading ? 'PROCESSING...' : (isSignUp ? 'CREATE_ACCOUNT' : 'AUTHENTICATE')}
          </button>
        </form>

        <div className="auth-footer">
          <button
            className="mono text-xxs toggle-btn"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'ALREADY_HAVE_ACCESS?' : 'NEW_OPERATOR?'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          color: white;
          padding: 24px;
          background: radial-gradient(circle at 50% 50%, rgba(197, 255, 0, 0.05) 0%, transparent 70%);
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 48px;
          background: #000;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 20px 20px 0px rgba(197, 255, 0, 0.02);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .logo-text {
          color: #c5ff00;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
          margin-bottom: 24px;
          display: block;
        }
        .auth-header h1 {
          font-size: 1.5rem;
          margin-bottom: 12px;
        }
        .text-dim { color: #888; }
        .text-sm { font-size: 14px; }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .input-group label {
          display: block;
          color: #444;
          margin-bottom: 8px;
        }
        .input-group input {
          width: 100%;
          background: #080808;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 16px;
          color: white;
          font-family: inherit;
          outline: none;
        }
        .input-group input:focus { border-color: #c5ff00; }
        .btn-brutal {
          background: #c5ff00;
          color: black;
          border: none;
          padding: 18px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
        }
        .btn-brutal:disabled { opacity: 0.5; }
        .error-msg { color: #ff3e3e; margin-top: 12px; }
        .success-msg { color: #c5ff00; margin-top: 12px; }
        .auth-footer {
          margin-top: 32px;
          text-align: center;
        }
        .toggle-btn {
          background: transparent;
          border: none;
          color: #444;
          cursor: pointer;
          text-decoration: underline;
        }
        .toggle-btn:hover { color: #c5ff00; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .text-xxs { font-size: 10px; }
      `}</style>
    </div>
  );
}
