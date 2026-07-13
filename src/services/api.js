import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000
})

// Safe localStorage reader
const getStoredToken = () => {
  try {
    const raw = localStorage.getItem('wt-auth')
    if (!raw || raw === 'undefined' || raw === 'null') return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.accessToken || null
  } catch {
    // Corrupted storage — clear it
    localStorage.removeItem('wt-auth')
    return null
  }
}

// Request interceptor — attach access token
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — silent refresh on 401
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh') &&
      !original.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        }).catch((err) => Promise.reject(err))
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newToken = data.accessToken

        // Safely update stored token
        try {
          const raw = localStorage.getItem('wt-auth')
          if (raw) {
            const stored = JSON.parse(raw)
            if (stored?.state) {
              stored.state.accessToken = newToken
              localStorage.setItem('wt-auth', JSON.stringify(stored))
            }
          }
        } catch {
          localStorage.removeItem('wt-auth')
        }

        processQueue(null, newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('wt-auth')
        window.location.href = '/admin/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api