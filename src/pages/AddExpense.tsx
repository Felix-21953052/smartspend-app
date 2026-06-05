import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addExpense, getUser } from '../utils/storage';
import type { Category } from '../types';

const CATEGORIES: { value: Category; label: string; emoji: string; color: string }[] = [
  { value: 'Food', label: 'Food', emoji: '🍔', color: '#F59E0B' },
  { value: 'Transport', label: 'Transport', emoji: '🚗', color: '#3B82F6' },
  { value: 'Shopping', label: 'Shopping', emoji: '🛍️', color: '#EC4899' },
  { value: 'Entertainment', label: 'Entertainment', emoji: '🎬', color: '#8B5CF6' },
  { value: 'Health', label: 'Health', emoji: '❤️', color: '#EF4444' },
  { value: 'Bills', label: 'Bills', emoji: '📄', color: '#6B7280' },
  { value: 'Other', label: 'Other', emoji: '📦', color: '#10B981' },
];

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', emoji: '📊' },
  { path: '/add', label: 'Add Expense', emoji: '➕' },
  { path: '/insights', label: 'Insights', emoji: '💡' },
  { path: '/profile', label: 'Profile', emoji: '👤' },
];

export default function AddExpense() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    addExpense({
      id: Date.now().toString(),
      userId: user?.id ?? '',
      title: title || category,
      amount: Number(amount),
      category,
      note,
      date,
    });

    setSubmitted(true);
    setTimeout(() => navigate('/'), 1200);
  };

  const sidebarStyle: React.CSSProperties = {
    width: 220,
    minHeight: '100vh',
    background: 'white',
    borderRight: '1px solid #E5E7EB',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: '#4F46E5',
    padding: '0 24px 24px',
    borderBottom: '1px solid #F3F4F6',
  };

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 24px',
    cursor: 'pointer',
    borderRadius: 8,
    margin: '2px 12px',
    background: active ? '#EEF2FF' : 'transparent',
    color: active ? '#4F46E5' : '#6B7280',
    fontWeight: active ? 600 : 400,
    fontSize: 14,
    border: 'none',
    textAlign: 'left',
    width: 'calc(100% - 24px)',
  });

  const mainStyle: React.CSSProperties = {
    marginLeft: 220,
    background: '#F7F9FC',
    minHeight: '100vh',
    padding: 32,
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    padding: 32,
    maxWidth: 560,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1.5px solid #E5E7EB',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: 6,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    display: 'block',
    marginBottom: 2,
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F7F9FC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#4F46E5', marginTop: 12 }}>Expense Added!</div>
          <div style={{ color: '#6B7280', marginTop: 4 }}>Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={logoStyle}>💰 SmartSpend</div>
        <nav style={{ flex: 1, marginTop: 16 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              style={navItemStyle(location.pathname === item.path)}
              onClick={() => navigate(item.path)}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        {user && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{user.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{user.email}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={mainStyle}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Add Expense</h1>
          <p style={{ color: '#6B7280', margin: '4px 0 0', fontSize: 14 }}>Record a new transaction</p>
        </div>

        <div style={cardStyle}>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                placeholder="e.g. Lunch, Grab, Netflix..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            {/* Amount */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Amount ($)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{ ...inputStyle, fontSize: 22, fontWeight: 700, color: '#4F46E5' }}
                required
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
                {CATEGORIES.map(cat => (
                  <button
                    type="button"
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    style={{
                      padding: '10px 6px',
                      borderRadius: 10,
                      border: category === cat.value ? `2px solid ${cat.color}` : '2px solid #E5E7EB',
                      background: category === cat.value ? cat.color + '18' : 'white',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: 12,
                      fontWeight: category === cat.value ? 700 : 400,
                      color: category === cat.value ? cat.color : '#6B7280',
                    }}
                  >
                    <div style={{ fontSize: 20 }}>{cat.emoji}</div>
                    <div style={{ marginTop: 4 }}>{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Note (optional)</label>
              <input
                type="text"
                placeholder="What was this for?"
                value={note}
                onChange={e => setNote(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Date */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: '#4F46E5',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
