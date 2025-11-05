import { prisma } from '../config/database'
import { ApiError } from '../middlewares/error.middleware'

/**
 * Business Service - for service owners
 */

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
export async function getBusinessStats(userId: string): Promise<BusinessStats> {
  // Find service owned by this user
  const service = await prisma.service.findFirst({
    where: { ownerId: userId },
    include: {
      reviews: {
        select: {
          rating: true,
          status: true,
        },
      },
    },
  })

  if (!service) {
    throw new ApiError(404, 'Service not found', 'SERVICE_NOT_FOUND')
  }

  // Calculate stats
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Get all-time stats
  const totalViews = service.viewsCount
  const totalPhoneClicks = service.phoneClicksCount
  const totalReviews = service.reviewsCount
  const averageRating = service.rating

  // Reviews by status
  const pendingReviews = service.reviews.filter((r) => r.status === 'pending').length
  const approvedReviews = service.reviews.filter((r) => r.status === 'approved').length

  // This month stats (mock data - would need additional tracking table in production)
  // For MVP, we'll return simplified data
  const viewsThisMonth = Math.floor(totalViews * 0.2) // Approximate 20% this month
  const phoneClicksThisMonth = Math.floor(totalPhoneClicks * 0.2)

  // Rating distribution
  const ratingDistribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }

  service.reviews.forEach((review) => {
    if (review.status === 'approved' && review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating]++
    }
  })

  return {
    totalViews,
    totalPhoneClicks,
    totalReviews,
    averageRating,
    pendingReviews,
    approvedReviews,
    viewsThisMonth,
    phoneClicksThisMonth,
    ratingDistribution,
  }
}

/**
 * Get business service
 */
export async function getBusinessService(userId: string) {
  const service = await prisma.service.findFirst({
    where: { ownerId: userId },
    include: {
      city: true,
      prices: {
        include: {
          category: true,
        },
      },
      photos: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!service) {
    throw new ApiError(404, 'Service not found', 'SERVICE_NOT_FOUND')
  }

  return service
}

/**
 * Update business service
 */
export async function updateBusinessService(
  userId: string,
  data: {
    name?: string
    description?: string
    address?: string
    phone?: string
    email?: string
    website?: string
    workingHours?: any
  }
) {
  // Find service
  const service = await prisma.service.findFirst({
    where: { ownerId: userId },
  })

  if (!service) {
    throw new ApiError(404, 'Service not found', 'SERVICE_NOT_FOUND')
  }

  // Update service
  const updatedService = await prisma.service.update({
    where: { id: service.id },
    data: {
      name: data.name,
      description: data.description,
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website,
      workingHours: data.workingHours,
    },
    include: {
      city: true,
      prices: {
        include: {
          category: true,
        },
      },
    },
  })

  return updatedService
}

/**
 * Get reviews for business service
 */
export async function getBusinessReviews(
  userId: string,
  params?: {
    status?: 'pending' | 'approved' | 'rejected'
    page?: number
    limit?: number
  }
) {
  const { status, page = 1, limit = 20 } = params || {}

  // Find service
  const service = await prisma.service.findFirst({
    where: { ownerId: userId },
  })

  if (!service) {
    throw new ApiError(404, 'Service not found', 'SERVICE_NOT_FOUND')
  }

  // Build where clause
  const where: any = { serviceId: service.id }
  if (status) {
    where.status = status
  }

  // Get reviews with pagination
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        photos: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where }),
  ])

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
