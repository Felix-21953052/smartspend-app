import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const getStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strengthColor = ['transparent', '#EF4444', '#F59E0B', '#22C55E'][getStrength()];
  const strengthWidth = ['0%', '33%', '66%', '100%'][getStrength()];
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'][getStrength()];

  const handleSubmit = () => {
    if (!name || !email || !password || !confirm) return setError('Please fill in all fields.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (!agreed) return setError('Please agree to the Terms & Privacy Policy.');

    const user = { id: Date.now().toString(), name, email, password, plan: 'free' };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('session', 'true');
    navigate('/');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0',
    fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#F8FAFC',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 40, width: 420, maxWidth: '100%' }}>
        
        <button onClick={() => navigate('/welcome')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748B', marginBottom: 24, padding: 0 }}>←</button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12 }}>💰</div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1E293B' }}>Create Account</h2>
          <p style={{ margin: '6px 0 0', color: '#64748B', fontSize: 14 }}>Start tracking your expenses</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name</label>
          <input style={inputStyle} placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email</label>
          <input style={inputStyle} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input style={{ ...inputStyle, paddingRight: 44 }} type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
            <span onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 16 }}>{showPass ? '🙈' : '👁'}</span>
          </div>
          {password.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 4, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: strengthWidth, background: strengthColor, transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: 12, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Confirm Password</label>
          <input style={inputStyle} type="password" placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <input type="checkbox" id="terms" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
          <label htmlFor="terms" style={{ fontSize: 13, color: '#64748B', cursor: 'pointer' }}>I agree to <span style={{ color: '#4F46E5', fontWeight: 600 }}>Terms & Privacy Policy</span></label>
        </div>

        {error && <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}

        <button onClick={handleSubmit} style={{ width: '100%', padding: '14px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 20 }}>
          Create Account
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748B', margin: 0 }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>Sign In</span>
        </p>
      </div>
    </div>
  );
}
