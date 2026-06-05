import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    try {
      const stored = localStorage.getItem('user');
      if (!stored) { setError('No account found. Please register first.'); return; }
      const user = JSON.parse(stored);
      if (user.email === email && user.password === password) {
        localStorage.setItem('session', 'true');
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#F7F9FC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    padding: 40,
    width: '100%',
    maxWidth: 420,
    position: 'relative',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
  };

  const btnStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <button
          onClick={() => navigate('/welcome')}
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', position: 'absolute', top: 20, left: 20, color: '#64748B' }}
        >←</button>

        <div style={{ textAlign: 'center', marginBottom: 28, marginTop: 8 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EEF2FF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 12 }}>💰</div>
          <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#1E293B' }}>Welcome Back</h2>
          <p style={{ margin: 0, color: '#64748B', fontSize: 14 }}>Sign in to your account</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              style={{ ...inputStyle, paddingRight: 44 }}
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 18 }}
            >{showPass ? '🙈' : '👁'}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginBottom: 20 }}>
          <span style={{ color: '#4F46E5', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Forgot Password?</span>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '10px 14px', borderRadius: 8, fontSize: 14, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button style={btnStyle} onClick={handleLogin}>Sign In</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          <span style={{ color: '#94A3B8', fontSize: 13 }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        </div>

        <button style={{ width: '100%', padding: 14, background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748B' }}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={{ color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}
