import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getUser, setUser, getExpenses, clearSession } from '../utils/storage';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Add Expense', path: '/add', icon: '➕' },
  { label: 'Insights', path: '/insights', icon: '💡' },
  { label: 'Profile', path: '/profile', icon: '👤' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F59E0B', Transport: '#3B82F6', Shopping: '#EC4899',
  Entertainment: '#8B5CF6', Health: '#10B981', Bills: '#EF4444',
  Education: '#06B6D4', Other: '#6B7280',
};

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const expenses = getExpenses();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [saveMsg, setSaveMsg] = useState('');

  if (!user) { navigate('/welcome'); return null; }

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const avgExpense = expenses.length ? totalSpent / expenses.length : 0;

  // Category breakdown
  const catMap: Record<string, number> = {};
  expenses.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

  // This month
  const now = new Date();
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonth.reduce((s, e) => s + e.amount, 0);

  const handleSave = () => {
    if (!name.trim()) return;
    setUser({ ...user, name: name.trim() });
    setEditing(false);
    setSaveMsg('Profile updated!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  const handleLogout = () => {
    clearSession();
    navigate('/welcome');
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: 220, height: '100vh',
    background: 'white', borderRight: '1px solid #E5E7EB',
    display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 100,
  };

  const mainStyle: React.CSSProperties = {
    marginLeft: 220, minHeight: '100vh', background: '#F7F9FC', padding: 32,
  };

  const cardStyle: React.CSSProperties = {
    background: 'white', borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, marginBottom: 24,
  };

  const statCardStyle: React.CSSProperties = {
    background: 'white', borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 20,
    flex: 1,
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#4F46E5' }}>💰 SmartSpend</div>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 10, marginBottom: 4, cursor: 'pointer',
                  background: active ? '#EEF2FF' : 'transparent',
                  color: active ? '#4F46E5' : '#6B7280',
                  fontWeight: active ? 600 : 400, fontSize: 14,
                }}>
                  <span>{item.icon}</span>{item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: '#4F46E5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0,
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={mainStyle}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#111827' }}>Profile</h1>
            <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: 14 }}>Manage your account settings</p>
          </div>
          <button onClick={handleLogout} style={{
            background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA',
            borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            🚪 Log Out
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: '💸', color: '#4F46E5' },
            { label: 'This Month', value: `$${thisMonthTotal.toFixed(2)}`, icon: '📅', color: '#10B981' },
            { label: 'Avg Expense', value: `$${avgExpense.toFixed(2)}`, icon: '📊', color: '#F59E0B' },
            { label: 'Top Category', value: topCat ? topCat[0] : 'N/A', icon: '🏆', color: '#8B5CF6' },
          ].map(s => (
            <div key={s.label} style={statCardStyle}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Profile card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>Account Info</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} style={{
                background: '#EEF2FF', color: '#4F46E5', border: 'none',
                borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>✏️ Edit</button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 28, flexShrink: 0,
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{user.name}</div>
              <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>{user.email}</div>
            </div>
          </div>

          {editing ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Full Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1.5px solid #4F46E5', fontSize: 14, outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
                <input
                  value={email}
                  disabled
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1.5px solid #E5E7EB', fontSize: 14, background: '#F9FAFB', color: '#9CA3AF',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0' }}>Email cannot be changed</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleSave} style={{
                  background: '#4F46E5', color: 'white', border: 'none',
                  borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>Save Changes</button>
                <button onClick={() => { setEditing(false); setName(user.name); }} style={{
                  background: '#F3F4F6', color: '#374151', border: 'none',
                  borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              {[{ label: 'Full Name', value: user.name }, { label: 'Email', value: user.email }].map(f => (
                <div key={f.label} style={{ marginBottom: 16, padding: '12px 16px', background: '#F9FAFB', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#111827' }}>{f.value}</div>
                </div>
              ))}
            </div>
          )}

          {saveMsg && (
            <div style={{ marginTop: 12, padding: '10px 16px', background: '#ECFDF5', color: '#10B981', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
              ✅ {saveMsg}
            </div>
          )}
        </div>

        {/* Category spending */}
        {Object.keys(catMap).length > 0 && (
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#111827' }}>Spending by Category</h2>
            {Object.entries(catMap).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
              const pct = totalSpent > 0 ? (amt / totalSpent) * 100 : 0;
              const color = CATEGORY_COLORS[cat] || '#6B7280';
              return (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: '#374151' }}>{cat}</span>
                    <span style={{ color: '#6B7280' }}>${amt.toFixed(2)} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ background: '#F3F4F6', borderRadius: 99, height: 8 }}>
                    <div style={{ width: `${pct}%`, height: 8, borderRadius: 99, background: color, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
