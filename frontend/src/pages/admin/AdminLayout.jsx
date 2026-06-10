import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BarChart2, Users, CheckSquare, Activity, LogOut, ArrowLeft } from 'lucide-react'

const nav = [
  { to: '/admin/overview', label: 'Overview', icon: BarChart2 },
  { to: '/admin/users', label: 'User Management', icon: Users },
  { to: '/admin/tasks', label: 'Task Monitoring', icon: CheckSquare },
  { to: '/admin/activity-logs', label: 'Activity Logs', icon: Activity },
]

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex min-h-screen bg-purple-50">
      <aside className="w-64 bg-purple-900 text-white flex flex-col fixed h-full">
        <div className="px-6 py-5 border-b border-purple-700">
          <p className="text-xs text-purple-400 uppercase tracking-widest mb-1">Admin Panel</p>
          <p className="font-bold text-lg">TaskManager Pro</p>
          <p className="text-xs text-purple-300 mt-1">{user?.name}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-200 hover:bg-purple-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-purple-700 space-y-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-purple-200 hover:bg-purple-800 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-purple-200 hover:bg-red-700 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
