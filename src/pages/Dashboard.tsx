import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, getExpenses } from '../utils/storage';
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

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 220,
      background: 'white', borderRight: '1px solid #E5E7EB',
      display: 'flex', flexDirection: 'column', zIndex: 100,
    }}>
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid #F3F4F6' }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#4F46E5' }}>💰 SmartSpend</span>
      </div>
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10, marginBottom: 4,
                cursor: 'pointer', fontWeight: active ? 600 : 400,
                background: active ? '#EEF2FF' : 'transparent',
                color: active ? '#4F46E5' : '#374151',
                fontSize: 14, transition: 'background 0.15s',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
      {user && (
        <div style={{
          padding: '16px 20px', borderTop: '1px solid #F3F4F6',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#4F46E5', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, flexShrink: 0,
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{
      background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      padding: 24, flex: 1, minWidth: 160,
    }}>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || '#111827' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const expenses: Expense[] = getExpenses();
  const BUDGET = 2000;

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const largest = expenses.length ? Math.max(...expenses.map(e => e.amount)) : 0;
  const budgetLeft = BUDGET - total;

  // Weekly bar chart — last 7 days
  const today = new Date();
  const last7: { label: string; date: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = i === 0 ? 'Today' : d.toLocaleDateString('en', { weekday: 'short' });
    const dayTotal = expenses.filter(e => e.date === dateStr).reduce((s, e) => s + e.amount, 0);
    last7.push({ label: dayLabel, date: dateStr, total: dayTotal });
  }
  const maxBar = Math.max(...last7.map(d => d.total), 1);
  const todayStr = today.toISOString().split('T')[0];

  // Category breakdown
  const catMap: Record<string, number> = {};
  expenses.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
  const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Recent 5
  const recent = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div style={{ marginLeft: 220, minHeight: '100vh', background: '#F7F9FC' }}>
      <Sidebar />
      <div style={{ padding: '32px 32px 48px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: 0 }}>Dashboard</h1>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
              {today.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <button
            onClick={() => navigate('/add')}
            style={{
              background: '#4F46E5', color: 'white', border: 'none',
              borderRadius: 10, padding: '10px 20px', fontSize: 14,
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            + Add Expense
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          <StatCard label="Total Spent" value={`$${total.toFixed(2)}`} sub={`of $${BUDGET} budget`} color="#4F46E5" />
          <StatCard label="Transactions" value={String(expenses.length)} sub="all time" />
          <StatCard label="Largest Expense" value={largest ? `$${largest.toFixed(2)}` : '—'} />
          <StatCard
            label="Budget Left"
            value={`$${budgetLeft.toFixed(2)}`}
            sub={budgetLeft < 0 ? 'Over budget!' : 'remaining'}
            color={budgetLeft < 0 ? '#EF4444' : '#10B981'}
          />
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {/* Weekly bar chart */}
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, flex: 2, minWidth: 300 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#111827', marginBottom: 20 }}>Weekly Spending</div>
            {expenses.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '32px 0', fontSize: 14 }}>No data yet</div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
                {last7.map(day => {
                  const isToday = day.date === todayStr;
                  const barH = day.total > 0 ? Math.max((day.total / maxBar) * 100, 6) : 4;
                  return (
                    <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ fontSize: 10, color: '#6B7280' }}>{day.total > 0 ? `$${day.total.toFixed(0)}` : ''}</div>
                      <div style={{
                        width: '100%', height: barH, borderRadius: 6,
                        background: isToday ? '#4F46E5' : '#EEF2FF',
                        transition: 'height 0.3s',
                      }} />
                      <div style={{ fontSize: 11, color: isToday ? '#4F46E5' : '#9CA3AF', fontWeight: isToday ? 600 : 400 }}>{day.label}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category breakdown */}
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#111827', marginBottom: 20 }}>By Category</div>
            {topCats.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 14, padding: '32px 0' }}>No data yet</div>
            ) : topCats.map(([cat, amt]) => {
              const pct = total > 0 ? (amt / total) * 100 : 0;
              const color = CATEGORY_COLORS[cat] || '#6B7280';
              return (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                    <span style={{ color: '#374151', fontWeight: 500 }}>{cat}</span>
                    <span style={{ color: '#6B7280' }}>${amt.toFixed(2)}</span>
                  </div>
                  <div style={{ height: 6, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent transactions */}
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, marginTop: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#111827', marginBottom: 16 }}>Recent Transactions</div>
          {recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💸</div>
              <div style={{ fontSize: 15, color: '#374151', fontWeight: 600 }}>No expenses yet</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6 }}>Click "Add Expense" to get started</div>
            </div>
          ) : recent.map((e, i) => {
            const color = CATEGORY_COLORS[e.category] || '#6B7280';
            return (
              <div key={e.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: i < recent.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>
                    {e.category === 'Food' ? '🍔' : e.category === 'Transport' ? '🚗' : e.category === 'Shopping' ? '🛍️' : e.category === 'Entertainment' ? '🎬' : e.category === 'Health' ? '💊' : e.category === 'Bills' ? '📄' : '💰'}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{e.note || e.category}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{e.category} · {e.date}</div>
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#EF4444' }}>-${e.amount.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
