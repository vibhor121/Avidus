import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, LayoutDashboard, CheckSquare, Shield } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-xl font-bold tracking-wide">
            TaskManager Pro
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-purple-100 hover:text-white transition-colors text-sm"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <Link
              to="/tasks"
              className="flex items-center gap-1.5 text-purple-100 hover:text-white transition-colors text-sm"
            >
              <CheckSquare size={16} />
              My Tasks
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin/overview"
                className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-400 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
              >
                <Shield size={16} />
                Admin Panel
              </Link>
            )}

            <div className="flex items-center gap-3 border-l border-purple-500 pl-6">
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-purple-300 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-purple-800 hover:bg-purple-900 px-3 py-1.5 rounded-lg transition-colors text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
