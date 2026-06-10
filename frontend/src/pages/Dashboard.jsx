import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import api from '../api/axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tasks')
      .then((res) => setTasks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const total = tasks.length
  const completed = tasks.filter((t) => t.status === 'completed').length
  const pending = tasks.filter((t) => t.status === 'pending').length
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length

  const recentTasks = tasks.slice(0, 5)

  const statusBadge = (status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
    }
    return map[status] || 'bg-gray-100 text-gray-700'
  }

  const priorityBadge = (priority) => {
    const map = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-gray-100 text-gray-600',
    }
    return map[priority] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, <span className="text-purple-600">{user?.name}</span>
          </h1>
          <p className="text-gray-500 mt-1">Here's a summary of your tasks</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard title="Total Tasks" value={total} icon="📋" color="purple" />
          <StatCard title="Completed" value={completed} icon="✅" color="green" />
          <StatCard title="In Progress" value={inProgress} icon="🔄" color="blue" />
          <StatCard title="Pending" value={pending} icon="⏳" color="yellow" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-purple-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100">
            <h2 className="text-lg font-semibold text-gray-800">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No tasks yet.</p>
              <Link
                to="/tasks"
                className="mt-3 inline-block bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create your first task
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-purple-50">
              {recentTasks.map((task) => (
                <div key={task._id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
