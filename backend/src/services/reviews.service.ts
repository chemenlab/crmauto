import { prisma } from '../config/database'
import { ApiError } from '../middlewares/error.middleware'
import { deleteCachePattern } from '../config/redis'

/**
 * Reviews Service
 */

export interface CreateReviewData {
  rating: number
  title?: string
  text: string
  pros?: string
  cons?: string
}

export interface GetReviewsParams {
  serviceId: string
  rating?: number
  sort?: 'recent' | 'rating_desc' | 'rating_asc'
  page?: number
  limit?: number
}

/**
 * Get reviews for a service
 */
export async function getServiceReviews(params: GetReviewsParams) {
  const {
    serviceId,
    rating,
    sort = 'recent',
    page = 1,
    limit = 20,
  } = params

  // Build where clause
  const where: any = {
    serviceId,
    status: 'approved',
  }

  if (rating) {
    where.rating = rating
  }

  // Build orderBy clause
  let orderBy: any = {}
  switch (sort) {
    case 'recent':
      orderBy = { createdAt: 'desc' }
      break
    case 'rating_desc':
      orderBy = { rating: 'desc' }
      break
    case 'rating_asc':
      orderBy = { rating: 'asc' }
      break
  }

  // Calculate pagination
  const skip = (page - 1) * limit

  // Execute query
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        photos: true,
      },
    }),
    prisma.review.count({ where }),
  ])

  // Calculate rating distribution
  const ratingDistribution = await prisma.review.groupBy({
    by: ['rating'],
    where: {
      serviceId,
      status: 'approved',
    },
    _count: {
      rating: true,
    },
  })

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ratingDistribution.forEach((item) => {
    distribution[item.rating] = item._count.rating
  })

  // Get average rating
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { rating: true, reviewsCount: true },
  })

  return {
    reviews: reviews.map((r) => ({
      id: r.id,
      user: {
        id: r.user.id,
        firstName: r.user.firstName,
        lastName: r.user.lastName,
      },
      rating: r.rating,
      title: r.title,
      text: r.text,
      pros: r.pros,
      cons: r.cons,
      photos: r.photos,
      response: r.response,
      responseAt: r.responseAt,
      createdAt: r.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    stats: {
      averageRating: service ? Number(service.rating) : 0,
      totalReviews: service?.reviewsCount || 0,
      ratingDistribution: distribution,
    },
  }
}

/**
 * Create review
 */
export async function createReview(
  userId: string,
  serviceId: string,
  data: CreateReviewData
) {
  // Check if service exists and is approved
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  })

  if (!service) {
    throw new ApiError(404, 'Service not found', 'SERVICE_NOT_FOUND')
  }

  if (service.status !== 'approved') {
    throw new ApiError(403, 'Cannot review this service', 'SERVICE_NOT_APPROVED')
  }

  // Check if user already reviewed this service
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_serviceId: {
        userId,
        serviceId,
      },
    },
  })

  if (existingReview) {
    throw new ApiError(409, 'You have already reviewed this service', 'REVIEW_EXISTS')
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      userId,
      serviceId,
      rating: data.rating,
      title: data.title || null,
      text: data.text,
      pros: data.pros || null,
      cons: data.cons || null,
      status: 'pending', // Requires moderation
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  // Clear cache
  await deleteCachePattern(`service:${serviceId}`)

  return review
}

/**
 * Update review (owner only)
 */
export async function updateReview(
  reviewId: string,
  userId: string,
  data: Partial<CreateReviewData>
) {
  // Get review and check ownership
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  })

  if (!review) {
    throw new ApiError(404, 'Review not found', 'REVIEW_NOT_FOUND')
  }

  if (review.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to update this review', 'FORBIDDEN')
  }

  // Update review
  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(data.rating && { rating: data.rating }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.text && { text: data.text }),
      ...(data.pros !== undefined && { pros: data.pros }),
      ...(data.cons !== undefined && { cons: data.cons }),
      status: 'pending', // Reset to pending for moderation
    },
  })

  // Clear cache
  await deleteCachePattern(`service:${review.serviceId}`)

  return updated
}

/**
 * Delete review (owner only)
 */
export async function deleteReview(reviewId: string, userId: string) {
  // Get review and check ownership
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  })

  if (!review) {
    throw new ApiError(404, 'Review not found', 'REVIEW_NOT_FOUND')
  }

  if (review.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to delete this review', 'FORBIDDEN')
  }

  const serviceId = review.serviceId

  // Delete review
  await prisma.review.delete({
    where: { id: reviewId },
  })

  // Recalculate service rating
  await recalculateServiceRating(serviceId)

  // Clear cache
  await deleteCachePattern(`service:${serviceId}`)
}

/**
 * Add response to review (service owner only)
 */
export async function addReviewResponse(
  reviewId: string,
  userId: string,
  response: string
) {
  // Get review with service
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { service: true },
  })

  if (!review) {
    throw new ApiError(404, 'Review not found', 'REVIEW_NOT_FOUND')
  }

  // Check if user owns the service
  if (review.service.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to respond to this review', 'FORBIDDEN')
  }

  // Update review with response
  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      response,
      responseAt: new Date(),
    },
  })

  // Clear cache
  await deleteCachePattern(`service:${review.serviceId}`)

  return updated
}

/**
 * Recalculate service rating
 */
async function recalculateServiceRating(serviceId: string) {
  const result = await prisma.review.aggregate({
    where: {
      serviceId,
      status: 'approved',
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  })

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      rating: result._avg.rating || 0,
      reviewsCount: result._count.rating,
    },
  })
}

/**
 * Get user's reviews
 */
export async function getUserReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          city: {
            select: {
              name: true,
            },
          },
        },
      },
      photos: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return reviews.map((r) => ({
    id: r.id,
    service: {
      id: r.service.id,
      name: r.service.name,
      city: r.service.city.name,
    },
    rating: r.rating,
    title: r.title,
    text: r.text,
    pros: r.pros,
    cons: r.cons,
    photos: r.photos,
    status: r.status,
    response: r.response,
    responseAt: r.responseAt,
    createdAt: r.createdAt,
  }))
}
