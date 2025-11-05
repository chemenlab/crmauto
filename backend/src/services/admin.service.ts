import { prisma } from '../config/database'
import { ApiError } from '../middlewares/error.middleware'

/**
 * Admin Service - for platform administrators
 */

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
 * Get admin dashboard statistics
 */
export async function getAdminStats(): Promise<AdminStats> {
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalUsers,
    totalBusinesses,
    totalServices,
    totalReviews,
    pendingServices,
    pendingReviews,
    newUsersThisMonth,
    newServicesThisMonth,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'business' } }),
    prisma.service.count(),
    prisma.review.count(),
    prisma.service.count({ where: { status: 'pending' } }),
    prisma.review.count({ where: { status: 'pending' } }),
    prisma.user.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
    prisma.service.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
  ])

  return {
    totalUsers,
    totalBusinesses,
    totalServices,
    totalReviews,
    pendingServices,
    pendingReviews,
    newUsersThisMonth,
    newServicesThisMonth,
  }
}

/**
 * Get all users with pagination
 */
export async function getAllUsers(params?: {
  role?: 'user' | 'business' | 'admin'
  search?: string
  page?: number
  limit?: number
}) {
  const { role, search, page = 1, limit = 20 } = params || {}

  const where: any = {}
  if (role) where.role = role
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get all services with pagination
 */
export async function getAllServices(params?: {
  status?: 'pending' | 'approved' | 'rejected'
  search?: string
  page?: number
  limit?: number
}) {
  const { status, search, page = 1, limit = 20 } = params || {}

  const where: any = {}
  if (status) where.status = status
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        city: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.service.count({ where }),
  ])

  return {
    services,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get all reviews with pagination
 */
export async function getAllReviews(params?: {
  status?: 'pending' | 'approved' | 'rejected'
  page?: number
  limit?: number
}) {
  const { status, page = 1, limit = 20 } = params || {}

  const where: any = {}
  if (status) where.status = status

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
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

/**
 * Approve or reject service
 */
export async function moderateService(
  serviceId: string,
  status: 'approved' | 'rejected'
) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  })

  if (!service) {
    throw new ApiError(404, 'Service not found', 'SERVICE_NOT_FOUND')
  }

  const updatedService = await prisma.service.update({
    where: { id: serviceId },
    data: { status },
  })

  return updatedService
}

/**
 * Approve or reject review
 */
export async function moderateReview(
  reviewId: string,
  status: 'approved' | 'rejected'
) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { service: true },
  })

  if (!review) {
    throw new ApiError(404, 'Review not found', 'REVIEW_NOT_FOUND')
  }

  // Update review status
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  })

  // If approved, recalculate service rating
  if (status === 'approved') {
    const approvedReviews = await prisma.review.findMany({
      where: {
        serviceId: review.serviceId,
        status: 'approved',
      },
      select: { rating: true },
    })

    const avgRating =
      approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
      approvedReviews.length

    await prisma.service.update({
      where: { id: review.serviceId },
      data: {
        rating: avgRating,
        reviewsCount: approvedReviews.length,
      },
    })
  }

  return updatedReview
}

/**
 * Delete user
 */
export async function deleteUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new ApiError(404, 'User not found', 'USER_NOT_FOUND')
  }

  // Delete user (cascading will handle related records)
  await prisma.user.delete({
    where: { id: userId },
  })

  return { success: true }
}

/**
 * Toggle premium status for service
 */
export async function togglePremium(serviceId: string, isPremium: boolean) {
  const service = await prisma.service.update({
    where: { id: serviceId },
    data: { plan: isPremium ? 'premium' : 'free' },
  })

  return service
}
