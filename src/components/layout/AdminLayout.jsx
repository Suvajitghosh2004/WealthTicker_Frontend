import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import api from '../../services/api.js'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: '📊', end: true },
  { label: 'Posts', to: '/admin/posts', icon: '📝' },
  { label: 'Categories', to: '/admin/categories', icon: '🏷️' },
  { label: 'Comments', to: '/admin/comments', icon: '💬' },
  { label: 'Newsletter', to: '/admin/newsletter', icon: '📧' },
  { label: 'Media', to: '/admin/media', icon: '🖼️' }
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {}
    logout()
    navigate('/admin/login')
    toast.success('Logged out')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-gray-900 text-white flex flex-col transition-all duration-200 flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          {sidebarOpen && (
            <span className="font-bold text-sm text-white">WealthTicker CMS</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-800 p-4">
          {sidebarOpen && (
            <p className="text-xs text-gray-500 mb-2 truncate">{user?.email}</p>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-sm text-gray-400 hover:text-white px-2 py-1.5 rounded hover:bg-gray-800 transition-colors"
          >
            <span>🚪</span>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            ☰
          </button>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="text-sm text-gray-500 hover:text-brand-600"
            >
              View Site →
            </Link>
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
