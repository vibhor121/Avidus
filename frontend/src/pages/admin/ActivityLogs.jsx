import { useEffect, useState } from 'react'
import api from '../../api/axios'

const actionColor = (action) => {
  const map = {
    USER_LOGIN: 'bg-blue-100 text-blue-700',
    USER_REGISTERED: 'bg-purple-100 text-purple-700',
    TASK_CREATED: 'bg-green-100 text-green-700',
    TASK_UPDATED: 'bg-yellow-100 text-yellow-700',
    TASK_DELETED: 'bg-red-100 text-red-600',
    ADMIN_TASK_DELETED: 'bg-red-200 text-red-700',
  }
  return map[action] || 'bg-gray-100 text-gray-600'
}

const actionIcon = (action) => {
  const map = {
    USER_LOGIN: '🔐',
    USER_REGISTERED: '👤',
    TASK_CREATED: '✅',
    TASK_UPDATED: '✏️',
    TASK_DELETED: '🗑️',
    ADMIN_TASK_DELETED: '⚠️',
  }
  return map[action] || '📌'
}

const ActivityLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/admin/activity-logs')
      .then((res) => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = logs.filter(
    (log) =>
      log.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Activity Logs</h1>
        <p className="text-gray-500 mt-1">Track all user actions across the platform</p>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by user, action, or details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-50 border-b border-purple-100">
                <tr>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Action</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">User</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Details</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {filtered.map((log) => (
                  <tr key={log._id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${actionColor(log.action)}`}>
                        <span>{actionIcon(log.action)}</span>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700">{log.user?.name || 'Deleted User'}</p>
                      <p className="text-xs text-gray-400">{log.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs">
                      <p className="line-clamp-2">{log.details}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-12">No logs found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityLogs
