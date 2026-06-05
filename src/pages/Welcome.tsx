import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  };

  const logoStyle: React.CSSProperties = {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    marginBottom: 16,
  };

  const featureCardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    textAlign: 'center',
    color: 'white',
  };

  const btnPrimaryStyle: React.CSSProperties = {
    background: 'white',
    color: '#4F46E5',
    border: 'none',
    borderRadius: 12,
    height: 52,
    width: 280,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 32,
  };

  return (
    <div style={containerStyle}>
      <div style={logoStyle}>💰</div>
      <h1 style={{ color: 'white', fontSize: 36, fontWeight: 700, margin: '0 0 8px' }}>SmartSpend</h1>
      <p style={{ color: 'white', fontSize: 18, opacity: 0.9, marginBottom: 40 }}>
        Track smarter, spend better
      </p>

      <div style={{ display: 'flex', gap: 16, maxWidth: 700, width: '100%', marginBottom: 16 }}>
        <div style={featureCardStyle}>
          <div style={{ fontSize: 28 }}>📊</div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>Smart Analytics</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>Understand your spending</div>
        </div>
        <div style={featureCardStyle}>
          <div style={{ fontSize: 28 }}>🔒</div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>Secure & Private</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>Your data stays local</div>
        </div>
        <div style={featureCardStyle}>
          <div style={{ fontSize: 28 }}>⚡</div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>Easy to Use</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>Add expenses in seconds</div>
        </div>
      </div>

      <button style={btnPrimaryStyle} onClick={() => navigate('/register')}>
        Get Started
      </button>

      <p style={{ color: 'white', marginTop: 20, fontSize: 14 }}>
        Already have an account?{' '}
        <span
          onClick={() => navigate('/login')}
          style={{ fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
        >
          Sign In
        </span>
      </p>
    </div>
  );
}
