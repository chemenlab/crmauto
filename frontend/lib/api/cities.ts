import apiClient from './client'
import type { ApiResponse } from '@/types'

/**
 * Cities API
 */

export interface City {
  id: number
  name: string
  slug: string
  region: string | null
  servicesCount: number
}

/**
 * Get all cities
 */
export async function getCities(): Promise<ApiResponse<City[]>> {
  const response = await apiClient.get<ApiResponse<City[]>>('/cities')
  return response.data
}

/**
 * Get city by slug
 */
export async function getCityBySlug(slug: string): Promise<ApiResponse<City>> {
  const response = await apiClient.get<ApiResponse<City>>(`/cities/${slug}`)
  return response.data
}
