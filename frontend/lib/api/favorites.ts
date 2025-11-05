import { apiClient } from './client'

/**
 * Get user's favorites
 */
export async function getFavorites(): Promise<{ success: boolean; data: any[] }> {
  const response = await apiClient.get('/favorites')
  return response.data
}

/**
 * Add service to favorites
 */
export async function addToFavorites(serviceId: string): Promise<{ success: boolean; data: any }> {
  const response = await apiClient.post(`/favorites/${serviceId}`)
  return response.data
}

/**
 * Remove service from favorites
 */
export async function removeFromFavorites(
  serviceId: string
): Promise<{ success: boolean }> {
  const response = await apiClient.delete(`/favorites/${serviceId}`)
  return response.data
}

/**
 * Check if service is in favorites
 */
export async function checkFavorite(
  serviceId: string
): Promise<{ success: boolean; data: { isFavorite: boolean } }> {
  const response = await apiClient.get(`/favorites/${serviceId}/check`)
  return response.data
}
