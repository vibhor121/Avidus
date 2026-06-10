import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Trash2 } from 'lucide-react'

const TaskMonitoring = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/admin/tasks')
      .then((res) => setTasks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    try {
      await api.delete(`/admin/tasks/${id}`)
      setTasks(tasks.filter((t) => t._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task')
    }
  }

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  const statusBadge = (status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
    }
    return map[status] || ''
  }

  const priorityBadge = (priority) => {
    const map = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-gray-100 text-gray-600',
    }
    return map[priority] || ''
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Task Monitoring</h1>
        <p className="text-gray-500 mt-1">View and manage all tasks across all users</p>
      </div>

      <div className="flex gap-2 mb-5">
        {['all', 'pending', 'in-progress', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-50 border-b border-purple-100">
                <tr>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Title</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Created By</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Priority</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Date</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {filtered.map((task) => (
                  <tr key={task._id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{task.user?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{task.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${priorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-12">No tasks found</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskMonitoring
