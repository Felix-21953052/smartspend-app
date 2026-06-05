import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';

export default function Pricing() {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarStyle: React.CSSProperties = {
    width: 240,
    minHeight: '100vh',
    background: '#fff',
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    position: 'fixed',
    top: 0,
    left: 0,
  };

  const mainStyle: React.CSSProperties = {
    marginLeft: 240,
    minHeight: '100vh',
    padding: 32,
    background: '#F7F9FC',
  };

  const navItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { icon: '➕', label: 'Add Expense', path: '/add-expense' },
    { icon: '📊', label: 'Insights', path: '/insights' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ];

  const active = (path: string) => location.pathname === path;

  const card = (title: string, value: string, note?: string) => (
    <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
      <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      {note && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>{note}</div>}
    </div>
  );

  return (
    <div style={{ display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#4F46E5', marginBottom: 24 }}>💎 SmartSpend</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map((n) => (
            <div key={n.path} onClick={() => navigate(n.path)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', background: active(n.path) ? '#EEF2FF' : 'transparent', color: active(n.path) ? '#4F46E5' : '#6B7280', fontWeight: active(n.path) ? 600 : 400 }}>
              <span style={{ fontSize: 18 }}>{n.icon}</span>
              <span>{n.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={mainStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Good morning 👋</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '6px 0 0' }}>Pricing</h1>
          </div>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 20px', fontWeight: 600 }}>Back</button>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          {[
            { title: 'Free', value: '$0', note: 'Basic tracking' },
            { title: 'Pro', value: '$4.99', note: 'Full features' },
          ].map((p) => (
            <div key={p.title} style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 20, border: p.title === 'Pro' ? '2px solid #4F46E5' : '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{p.value}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>{p.note}</div>
              <button style={{ marginTop: 12, width: '100%', padding: 12, borderRadius: 8, border: 'none', background: '#4F46E5', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                Choose {p.title}
              </button>
            </div>
          ))}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>Premium Features</div>
            <ul style={{ margin: '8px 0 0 18px', padding: 0, color: '#374151' }}>
              <li>Unlimited tracking</li>
              <li>Advanced insights</li>
              <li>Export data</li>
            </ul>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>Compare Plans</div>
            <p style={{ marginTop: 6, color: '#6B7280' }}>Simple comparison and upgrade path.</p>
          </div>
        </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function card(title: string, _value: string): React.CSSProperties {
  return {
    flex: 1,
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  };
}