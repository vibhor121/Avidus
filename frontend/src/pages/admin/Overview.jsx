import { useEffect, useState } from 'react'
import StatCard from '../../components/StatCard'
import api from '../../api/axios'

const Overview = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
        <p className="text-gray-500 mt-1">Platform-wide analytics and statistics</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon="👥" color="purple" />
          <StatCard title="Total Tasks" value={stats?.totalTasks ?? 0} icon="📋" color="blue" />
          <StatCard title="Completed Tasks" value={stats?.completedTasks ?? 0} icon="✅" color="green" />
          <StatCard title="Pending Tasks" value={stats?.pendingTasks ?? 0} icon="⏳" color="yellow" />
        </div>
      )}

      <div className="mt-10 bg-white rounded-2xl border border-purple-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
        {stats && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Task Completion Rate</span>
                <span className="font-semibold text-purple-700">
                  {stats.totalTasks > 0
                    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-purple-100 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full transition-all"
                  style={{
                    width: `${stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pending Tasks</span>
                <span className="font-semibold text-yellow-600">
                  {stats.totalTasks > 0
                    ? Math.round((stats.pendingTasks / stats.totalTasks) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-yellow-100 rounded-full h-2.5">
                <div
                  className="bg-yellow-500 h-2.5 rounded-full transition-all"
                  style={{
                    width: `${stats.totalTasks > 0 ? Math.round((stats.pendingTasks / stats.totalTasks) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Overview
