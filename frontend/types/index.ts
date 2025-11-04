/**
 * TypeScript type definitions for AutoHub
 */

// ============================================
// User Types
// ============================================

export type UserRole = 'user' | 'business' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  role: UserRole
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

// ============================================
// Service (Автосервис) Types
// ============================================

export type ServiceStatus = 'pending' | 'approved' | 'rejected' | 'inactive'
export type ServicePlan = 'free' | 'basic' | 'premium'

export interface WorkingHours {
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
}

export interface Service {
  id: string
  userId: string
  name: string
  description: string | null
  cityId: number
  city?: City
  address: string
  latitude: number | null
  longitude: number | null
  phone: string
  email: string | null
  website: string | null
  workingHours: WorkingHours
  rating: number
  reviewsCount: number
  status: ServiceStatus
  moderationComment: string | null
  plan: ServicePlan
  planExpiresAt: string | null
  viewsCount: number
  phoneClicksCount: number
  createdAt: string
  updatedAt: string
  photos?: ServicePhoto[]
  prices?: ServicePrice[]
  reviews?: Review[]
}

export interface ServicePhoto {
  id: string
  serviceId: string
  url: string
  isPrimary: boolean
  orderIndex: number
  createdAt: string
}

export interface ServicePrice {
  id: string
  serviceId: string
  categoryId: number
  category?: ServiceCategory
  name: string
  priceFrom: number | null
  priceTo: number | null
  duration: string | null
  createdAt: string
}

export interface ServiceCategory {
  id: number
  name: string
  slug: string
  icon: string | null
  createdAt: string
}

// ============================================
// Review Types
// ============================================

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface Review {
  id: string
  userId: string
  user?: User
  serviceId: string
  service?: Service
  rating: number
  title: string | null
  text: string
  pros: string | null
  cons: string | null
  status: ReviewStatus
  moderationComment: string | null
  response: string | null
  responseAt: string | null
  createdAt: string
  updatedAt: string
  photos?: ReviewPhoto[]
}

export interface ReviewPhoto {
  id: string
  reviewId: string
  url: string
  createdAt: string
}

// ============================================
// City Types
// ============================================

export interface City {
  id: number
  name: string
  slug: string
  region: string | null
  population: number | null
  createdAt: string
}

// ============================================
// Favorite Types
// ============================================

export interface Favorite {
  id: string
  userId: string
  serviceId: string
  service?: Service
  createdAt: string
}

// ============================================
// Payment Types
// ============================================

export type PaymentStatus = 'pending' | 'completed' | 'failed'

export interface Payment {
  id: string
  serviceId: string
  plan: ServicePlan
  amount: number
  status: PaymentStatus
  paymentMethod: string | null
  transactionId: string | null
  createdAt: string
  completedAt: string | null
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
  }
  message?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationMeta
}

// ============================================
// Filter & Sort Types
// ============================================

export interface ServiceFilters {
  city?: string
  category?: number
  rating?: number
  priceFrom?: number
  priceTo?: number
  openNow?: boolean
  plan?: ServicePlan
}

export type ServiceSortBy = 'rating' | 'reviews' | 'name' | 'newest'

export interface ServiceSearchParams extends ServiceFilters {
  sort?: ServiceSortBy
  page?: number
  limit?: number
  search?: string
}

// ============================================
// Form Types
// ============================================

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface ReviewFormData {
  rating: number
  title?: string
  text: string
  pros?: string
  cons?: string
  photos?: File[]
}

export interface ServiceFormData {
  name: string
  description?: string
  cityId: number
  address: string
  latitude?: number
  longitude?: number
  phone: string
  email?: string
  website?: string
  workingHours: WorkingHours
}

// ============================================
// Statistics Types
// ============================================

export interface ServiceStats {
  views: {
    total: number
    thisWeek: number
    thisMonth: number
  }
  phoneClicks: {
    total: number
    thisWeek: number
    thisMonth: number
  }
  reviews: {
    total: number
    averageRating: number
    thisMonth: number
  }
  chart?: ChartDataPoint[]
}

export interface ChartDataPoint {
  date: string
  views: number
  phoneClicks: number
}

export interface RatingDistribution {
  5: number
  4: number
  3: number
  2: number
  1: number
}

export interface AdminStats {
  users: {
    total: number
    thisMonth: number
  }
  services: {
    total: number
    pending: number
    approved: number
  }
  reviews: {
    total: number
    pending: number
  }
  revenue: {
    total: number
    thisMonth: number
  }
}
