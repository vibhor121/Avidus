import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = () => {
    api.get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this user and all their data?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(users.filter((u) => u._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    try {
      const res = await api.patch(`/admin/users/${user._id}/status`, { status: newStatus })
      setUsers(users.map((u) => (u._id === user._id ? res.data : u)))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500 mt-1">Manage all registered users</p>
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
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Name</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Email</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Role</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Joined</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                              className={`p-2 rounded-lg transition-colors ${
                                user.status === 'active'
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              {user.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                        {user.role === 'admin' && (
                          <span className="text-xs text-purple-400 italic">Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-center text-gray-400 py-12">No users found</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
