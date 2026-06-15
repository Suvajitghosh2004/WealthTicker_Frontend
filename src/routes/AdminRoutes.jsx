import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import AdminLayout from '../components/layout/AdminLayout.jsx'

export default function AdminRoutes() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
