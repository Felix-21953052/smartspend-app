
import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const API = "http://localhost:8000";

const CATEGORIES = ["Food", "Transport", "Shopping", "Entertainment", "Health", "Education", "Other"];

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899"];

function Dashboard({ user, onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "Food", date: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", amount: "", category: "Food", date: "", note: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/expenses/${user.email}`);
      setExpenses(Array.isArray(res.data.expenses) ? res.data.expenses : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/expenses`, {
        user_email: user.email,
        title: form.title,
        amount: parseFloat(form.amount),
        category: form.category,
        date: form.date,
        note: form.note,
      });
      setForm({ title: "", amount: "", category: "Food", date: "", note: "" });
      fetchExpenses();
    } catch (err) {
      setError("Failed to add expense");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditOpen = (exp) => {
    setEditingId(exp.id);
    setEditForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: exp.date,
      note: exp.note || "",
    });
    setEditError("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditError("");
  };

  const handleEditSave = async (id) => {
    setEditLoading(true);
    setEditError("");
    try {
      await axios.put(`${API}/expenses/${id}`, {
        title: editForm.title,
        amount: parseFloat(editForm.amount),
        category: editForm.category,
        date: editForm.date,
        note: editForm.note,
      });
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      setEditError("Failed to update expense");
    }
    setEditLoading(false);
  };

  // ─── Chart Data ───────────────────────────────────────
  const pieData = CATEGORIES.map((cat) => ({
    name: cat,
    value: expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter((d) => d.value > 0);

  const barData = expenses.reduce((acc, exp) => {
    const month = exp.date?.slice(0, 7);
    if (!month) return acc;
    const existing = acc.find((d) => d.month === month);
    if (existing) {
      existing.total += exp.amount;
    } else {
      acc.push({ month, total: exp.amount });
    }
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month));

  const total = (expenses || []).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header">
        <h1>💰 SmartSpend</h1>
        <div className="user-info">
          <span>👋 {user.full_name || user.email}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-card">
        <h2>Total Expenses</h2>
        <p className="total">${total.toFixed(2)}</p>
        <p>{expenses.length} transactions</p>
      </div>

      {/* ─── Charts ─── */}
      {expenses.length > 0 && (
        <div className="charts-section">
          {/* Pie Chart */}
          <div className="chart-card">
            <h3>🍕 Spending by Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="chart-card">
            <h3>📅 Monthly Spending</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Add Form */}
      <div className="add-form">
        <h3>➕ Add New Expense</h3>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount ($)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-row">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <input
            type="text"
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>

      {/* Expense List */}
      <div className="expense-list">
        <h3>📋 Expense History</h3>
        {expenses.length === 0 ? (
          <p className="empty">No expenses yet. Add your first one!</p>
        ) : (
          expenses.map((exp) => (
            <div key={exp.id} className="expense-item">
              {editingId === exp.id ? (
                <div className="edit-form">
                  <div className="form-row">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Title"
                      required
                    />
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                      placeholder="Amount ($)"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    >
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    value={editForm.note}
                    onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                    placeholder="Note (optional)"
                  />
                  {editError && <p className="error">{editError}</p>}
                  <div className="edit-actions">
                    <button onClick={() => handleEditSave(exp.id)} disabled={editLoading} className="save-btn">
                      {editLoading ? "Saving..." : "✅ Save"}
                    </button>
                    <button onClick={handleEditCancel} className="cancel-btn">❌ Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="expense-info">
                    <span className="expense-title">{exp.title}</span>
                    <span className="expense-category">{exp.category}</span>
                    <span className="expense-date">{exp.date}</span>
                    {exp.note && <span className="expense-note">{exp.note}</span>}
                  </div>
                  <div className="expense-right">
                    <span className="expense-amount">${parseFloat(exp.amount).toFixed(2)}</span>
                    <button onClick={() => handleEditOpen(exp)} className="edit-btn">✏️</button>
                    <button onClick={() => handleDelete(exp.id)} className="delete-btn">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
