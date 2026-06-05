import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentUser } from '../utils/storage'
import { Outlet, NavLink } from 'react-router-dom'

const Layout: React.FC = () => {
  const location = useLocation()
  const user = getCurrentUser()
  // Global guard: redirect to login if unauthenticated on any protected route
  const isProtected = [
    '/dashboard',
    '/add-expense',
    '/breakdown',
    '/insights',
    '/pricing',
    '/profile'
  ].some((p) => location.pathname.startsWith(p))
  if (isProtected && !user) {
    return <Navigate to="/login" replace />
  }
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#111', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '8px 0',
        }}
      >
        <NavLink to="/dashboard" style={({ isActive }) => ({ color: isActive ? '#16a34a' : '#374151', textDecoration: 'none' })}>Dashboard</NavLink>
        <NavLink to="/add-expense" style={({ isActive }) => ({ color: isActive ? '#16a34a' : '#374151', textDecoration: 'none' })}>Add Expense</NavLink>
        <NavLink to="/insights" style={({ isActive }) => ({ color: isActive ? '#16a34a' : '#374151', textDecoration: 'none' })}>Insights</NavLink>
        <NavLink to="/profile" style={({ isActive }) => ({ color: isActive ? '#16a34a' : '#374151', textDecoration: 'none' })}>Profile</NavLink>
      </nav>
    </div>
  )
}

export default Layout
