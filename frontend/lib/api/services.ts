import apiClient from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  Service,
  ServiceSearchParams,
  ServiceFormData,
  ServiceStats
} from '@/types'

/**
 * Services (Автосервисы) API
 */

/**
 * Get list of services with filters
 */
export async function getServices(
  params?: ServiceSearchParams
): Promise<ApiResponse<PaginatedResponse<Service>>> {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Service>>>('/services', {
    params,
  })
  return response.data
}

/**
 * Get service by ID
 */
export async function getServiceById(id: string): Promise<ApiResponse<Service>> {
  const response = await apiClient.get<ApiResponse<Service>>(`/services/${id}`)
  return response.data
}

/**
 * Create new service (requires auth)
 */
export async function createService(data: ServiceFormData): Promise<ApiResponse<Service>> {
  const response = await apiClient.post<ApiResponse<Service>>('/services', data)
  return response.data
}

/**
 * Update service (requires auth, owner only)
 */
export async function updateService(id: string, data: Partial<ServiceFormData>): Promise<ApiResponse<Service>> {
  const response = await apiClient.put<ApiResponse<Service>>(`/services/${id}`, data)
  return response.data
}

/**
 * Delete service (requires auth, owner only)
 */
export async function deleteService(id: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete<ApiResponse<void>>(`/services/${id}`)
  return response.data
}

/**
 * Upload service photos
 */
export async function uploadServicePhotos(serviceId: string, files: File[]): Promise<ApiResponse<any>> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('photos', file)
  })

  const response = await apiClient.post<ApiResponse<any>>(
    `/services/${serviceId}/photos`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

/**
 * Get service statistics (requires auth, owner only)
 */
export async function getServiceStats(id: string): Promise<ApiResponse<ServiceStats>> {
  const response = await apiClient.get<ApiResponse<ServiceStats>>(`/services/${id}/stats`)
  return response.data
}

/**
 * Track phone click
 */
export async function trackPhoneClick(serviceId: string): Promise<void> {
  await apiClient.post(`/services/${serviceId}/track-phone-click`)
}

/**
 * Track view
 */
export async function trackView(serviceId: string): Promise<void> {
  await apiClient.post(`/services/${serviceId}/track-view`)
}
