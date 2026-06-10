import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'

import AdminLayout from './pages/admin/AdminLayout'
import Overview from './pages/admin/Overview'
import UserManagement from './pages/admin/UserManagement'
import TaskMonitoring from './pages/admin/TaskMonitoring'
import ActivityLogs from './pages/admin/ActivityLogs'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/tasks"
            element={<ProtectedRoute><Tasks /></ProtectedRoute>}
          />

          <Route
            path="/admin"
            element={<AdminRoute><AdminLayout /></AdminRoute>}
          >
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="tasks" element={<TaskMonitoring />} />
            <Route path="activity-logs" element={<ActivityLogs />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
