import { useNavigate, useLocation } from 'react-router-dom';
import { getExpenses, getUser } from '../utils/storage';
import type { Expense } from '../types';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Add Expense', path: '/add', icon: '➕' },
  { label: 'Insights', path: '/insights', icon: '💡' },
  { label: 'Profile', path: '/profile', icon: '👤' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F59E0B',
  Transport: '#3B82F6',
  Shopping: '#EC4899',
  Entertainment: '#8B5CF6',
  Health: '#10B981',
  Bills: '#EF4444',
  Other: '#6B7280',
};

export default function Insights() {
  const navigate = useNavigate();
  const location = useLocation();
  const expenses = getExpenses();
  const user = getUser();

  // Monthly totals (last 6 months)
  const now = new Date();
  const monthlyData: { label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short' });
    const total = expenses
      .filter(e => {
        const ed = new Date(e.date);
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);
    monthlyData.push({ label, total });
  }

  const maxMonthly = Math.max(...monthlyData.map(m => m.total), 1);

  // Category totals
  const catMap: Record<string, number> = {};
  expenses.forEach(e => {
    catMap[e.category] = (catMap[e.category] || 0) + e.amount;
  });
  const totalSpent = Object.values(catMap).reduce((a, b) => a + b, 0);
  const categories = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1]);

  // Top spending day of week
  const dowMap: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  const dowKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  expenses.forEach(e => {
    const d = new Date(e.date);
    dowMap[dowKeys[d.getDay()]] += e.amount;
  });
  const maxDow = Math.max(...Object.values(dowMap), 1);

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: 220, height: '100vh',
    background: 'white', borderRight: '1px solid #E5E7EB',
    display: 'flex', flexDirection: 'column', zIndex: 100,
  };
  const cardStyle: React.CSSProperties = {
    background: 'white', borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, marginBottom: 24,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F9FC' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ padding: '28px 24px 16px', borderBottom: '1px solid #F3F4F6' }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#4F46E5' }}>💰 SmartSpend</span>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <div key={item.path} onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10, marginBottom: 4,
                  cursor: 'pointer', fontWeight: active ? 600 : 400,
                  background: active ? '#EEF2FF' : 'transparent',
                  color: active ? '#4F46E5' : '#6B7280',
                }}>
                <span>{item.icon}</span><span>{item.label}</span>
              </div>
            );
          })}
        </nav>
        {user && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{user.email}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ marginLeft: 220, flex: 1, padding: 32 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: 0 }}>Insights</h1>
          <p style={{ color: '#6B7280', marginTop: 4, fontSize: 14 }}>Your spending patterns & analytics</p>
        </div>

        {expenses.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48 }}>📭</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginTop: 16 }}>No data yet</div>
            <div style={{ color: '#6B7280', marginTop: 8 }}>Add some expenses to see insights.</div>
            <button onClick={() => navigate('/add')}
              style={{ marginTop: 20, padding: '10px 24px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
              Add Expense
            </button>
          </div>
        ) : (
          <>
            {/* Monthly Trend */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 20px' }}>Monthly Spending (Last 6 Months)</h2>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
                {monthlyData.map((m, i) => {
                  const isLast = i === monthlyData.length - 1;
                  const barH = Math.max((m.total / maxMonthly) * 130, m.total > 0 ? 6 : 0);
                  return (
                    <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>
                        {m.total > 0 ? `$${m.total.toFixed(0)}` : ''}
                      </div>
                      <div style={{ width: '100%', height: barH, background: isLast ? '#4F46E5' : '#C7D2FE', borderRadius: '6px 6px 0 0', transition: 'height 0.3s' }} />
                      <div style={{ fontSize: 12, color: isLast ? '#4F46E5' : '#9CA3AF', fontWeight: isLast ? 700 : 400 }}>{m.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 20px' }}>Spending by Category</h2>
              {categories.map(([cat, amount]) => {
                const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                const color = CATEGORY_COLORS[cat] || '#6B7280';
                return (
                  <div key={cat} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{cat}</span>
                      <span style={{ fontSize: 14, color: '#6B7280' }}>${amount.toFixed(2)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Day of Week */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 20px' }}>Spending by Day of Week</h2>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
                {dowKeys.map(day => {
                  const val = dowMap[day];
                  const barH = Math.max((val / maxDow) * 90, val > 0 ? 6 : 0);
                  const today = dowKeys[new Date().getDay()];
                  const isToday = day === today;
                  return (
                    <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 10, color: '#6B7280' }}>{val > 0 ? `$${val.toFixed(0)}` : ''}</div>
                      <div style={{ width: '100%', height: barH, background: isToday ? '#4F46E5' : '#EEF2FF', borderRadius: '4px 4px 0 0' }} />
                      <div style={{ fontSize: 12, color: isToday ? '#4F46E5' : '#9CA3AF', fontWeight: isToday ? 700 : 400 }}>{day}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
