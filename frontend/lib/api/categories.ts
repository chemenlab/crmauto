import apiClient from './client'
import type { ApiResponse } from '@/types'

/**
 * Categories API
 */

export interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
}

/**
 * Get all service categories
 */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const response = await apiClient.get<ApiResponse<Category[]>>('/categories')
  return response.data
}
