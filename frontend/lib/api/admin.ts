import { apiClient } from './client'

export interface AdminStats {
  totalUsers: number
  totalBusinesses: number
  totalServices: number
  totalReviews: number
  pendingServices: number
  pendingReviews: number
  newUsersThisMonth: number
  newServicesThisMonth: number
}

/**
 * Get admin statistics
 */
export async function getAdminStats(): Promise<{ success: boolean; data: AdminStats }> {
  const response = await apiClient.get('/admin/stats')
  return response.data
}

/**
 * Get all users
 */
export async function getUsers(params?: {
  role?: 'user' | 'business' | 'admin'
  search?: string
  page?: number
  limit?: number
}): Promise<{ success: boolean; data: any[]; pagination: any }> {
  const response = await apiClient.get('/admin/users', { params })
  return response.data
}

/**
 * Get all services
 */
export async function getAdminServices(params?: {
  status?: 'pending' | 'approved' | 'rejected'
  search?: string
  page?: number
  limit?: number
}): Promise<{ success: boolean; data: any[]; pagination: any }> {
  const response = await apiClient.get('/admin/services', { params })
  return response.data
}

/**
 * Get all reviews
 */
export async function getAdminReviews(params?: {
  status?: 'pending' | 'approved' | 'rejected'
  page?: number
  limit?: number
}): Promise<{ success: boolean; data: any[]; pagination: any }> {
  const response = await apiClient.get('/admin/reviews', { params })
  return response.data
}

/**
 * Moderate service
 */
export async function moderateService(
  serviceId: string,
  status: 'approved' | 'rejected'
): Promise<{ success: boolean; data: any }> {
  const response = await apiClient.patch(`/admin/services/${serviceId}/moderate`, { status })
  return response.data
}

/**
 * Moderate review
 */
export async function moderateReview(
  reviewId: string,
  status: 'approved' | 'rejected'
): Promise<{ success: boolean; data: any }> {
  const response = await apiClient.patch(`/admin/reviews/${reviewId}/moderate`, { status })
  return response.data
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<{ success: boolean }> {
  const response = await apiClient.delete(`/admin/users/${userId}`)
  return response.data
}

/**
 * Toggle premium status
 */
export async function togglePremium(
  serviceId: string,
  isPremium: boolean
): Promise<{ success: boolean; data: any }> {
  const response = await apiClient.patch(`/admin/services/${serviceId}/premium`, { isPremium })
  return response.data
}
