import { apiClient } from './client'

export interface BusinessStats {
  totalViews: number
  totalPhoneClicks: number
  totalReviews: number
  averageRating: number
  pendingReviews: number
  approvedReviews: number
  viewsThisMonth: number
  phoneClicksThisMonth: number
  ratingDistribution: Record<number, number>
}

/**
 * Get business statistics
 */
export async function getBusinessStats(): Promise<{ success: boolean; data: BusinessStats }> {
  const response = await apiClient.get('/business/stats')
  return response.data
}

/**
 * Get business service info
 */
export async function getMyService(): Promise<{ success: boolean; data: any }> {
  const response = await apiClient.get('/business/service')
  return response.data
}

/**
 * Update business service
 */
export async function updateMyService(data: any): Promise<{ success: boolean; data: any }> {
  const response = await apiClient.put('/business/service', data)
  return response.data
}

/**
 * Get reviews for business service
 */
export async function getMyServiceReviews(params?: {
  status?: 'pending' | 'approved' | 'rejected'
  page?: number
  limit?: number
}): Promise<{ success: boolean; data: any[] }> {
  const response = await apiClient.get('/business/reviews', { params })
  return response.data
}

/**
 * Respond to review
 */
export async function respondToReview(
  reviewId: string,
  response: string
): Promise<{ success: boolean; data: any }> {
  const res = await apiClient.post(`/reviews/${reviewId}/response`, { response })
  return res.data
}
