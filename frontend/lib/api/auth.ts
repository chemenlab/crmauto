import apiClient from './client'
import type { ApiResponse, User, LoginFormData, RegisterFormData } from '@/types'

/**
 * Authentication API
 */

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken?: string
}

/**
 * Register a new user
 */
export async function register(data: RegisterFormData): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data)

  // Save tokens
  if (response.data.success && response.data.data) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.data.accessToken)
    }
  }

  return response.data
}

/**
 * Login user
 */
export async function login(data: LoginFormData): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data)

  // Save tokens
  if (response.data.success && response.data.data) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.data.accessToken)
    }
  }

  return response.data
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    // Clear tokens even if request fails
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
    }
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const response = await apiClient.get<ApiResponse<User>>('/users/me')
  return response.data
}

/**
 * Request password reset
 */
export async function forgotPassword(email: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email })
  return response.data
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', {
    token,
    newPassword,
  })
  return response.data
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>('/auth/verify-email', { token })
  return response.data
}
