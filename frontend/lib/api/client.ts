import axios, { AxiosInstance, AxiosError } from 'axios'

/**
 * API Client for AutoHub
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies (refresh tokens)
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get access token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    // If 401 and not already retrying, try to refresh token
    if (error.response?.status === 401 && originalRequest && !originalRequest.headers['X-Retry']) {
      try {
        // Call refresh token endpoint
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        // Save new access token
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', data.data.accessToken)
        }

        // Retry original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${data.data.accessToken}`
        originalRequest.headers['X-Retry'] = 'true'
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export { apiClient }
export default apiClient
