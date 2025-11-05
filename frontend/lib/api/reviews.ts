import apiClient from './client'
import type { ApiResponse, PaginatedResponse, Review, ReviewFormData } from '@/types'

/**
 * Reviews API
 */

export interface GetReviewsParams {
  rating?: number
  sort?: 'recent' | 'rating_desc' | 'rating_asc'
  page?: number
  limit?: number
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

/**
 * Get reviews for a service
 */
export async function getServiceReviews(
  serviceId: string,
  params?: GetReviewsParams
): Promise<ApiResponse<{ reviews: Review[]; pagination: any; stats: ReviewStats }>> {
  const response = await apiClient.get<ApiResponse<any>>(
    `/services/${serviceId}/reviews`,
    { params }
  )
  return response.data
}

/**
 * Create review for a service
 */
export async function createReview(
  serviceId: string,
  data: ReviewFormData
): Promise<ApiResponse<Review>> {
  const response = await apiClient.post<ApiResponse<Review>>(
    `/services/${serviceId}/reviews`,
    data
  )
  return response.data
}

/**
 * Update review
 */
export async function updateReview(
  reviewId: string,
  data: Partial<ReviewFormData>
): Promise<ApiResponse<Review>> {
  const response = await apiClient.put<ApiResponse<Review>>(
    `/reviews/${reviewId}`,
    data
  )
  return response.data
}

/**
 * Delete review
 */
export async function deleteReview(reviewId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete<ApiResponse<void>>(`/reviews/${reviewId}`)
  return response.data
}

/**
 * Add response to review (service owner only)
 */
export async function addReviewResponse(
  reviewId: string,
  response: string
): Promise<ApiResponse<Review>> {
  const res = await apiClient.post<ApiResponse<Review>>(
    `/reviews/${reviewId}/response`,
    { response }
  )
  return res.data
}

/**
 * Get current user's reviews
 */
export async function getMyReviews(): Promise<ApiResponse<Review[]>> {
  const response = await apiClient.get<ApiResponse<Review[]>>('/users/me/reviews')
  return response.data
}
