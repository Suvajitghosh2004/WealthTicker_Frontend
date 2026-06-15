import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore()
  const navigate = useNavigate()

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setAuth(data.user, data.accessToken)
    return data
  }, [setAuth])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {}
    storeLogout()
    toast.success('Logged out')
    navigate('/admin/login')
  }, [storeLogout, navigate])

  return { user, isAuthenticated, login, logout }
}
