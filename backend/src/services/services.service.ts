import { Prisma } from '@prisma/client'
import { prisma } from '../config/database'
import { ApiError } from '../middlewares/error.middleware'
import { getCache, setCache, deleteCachePattern } from '../config/redis'

/**
 * Services (Автосервисы) Business Logic
 */

export interface ServiceFilters {
  city?: string
  category?: number
  rating?: number
  openNow?: boolean
  search?: string
}

export interface GetServicesParams extends ServiceFilters {
  page?: number
  limit?: number
  sort?: 'rating' | 'reviews' | 'name' | 'newest'
}

export interface CreateServiceData {
  name: string
  description?: string
  cityId: number
  address: string
  latitude?: number
  longitude?: number
  phone: string
  email?: string
  website?: string
  workingHours: Record<string, string>
}

/**
 * Get list of services with filters and pagination
 */
export async function getServices(params: GetServicesParams) {
  const {
    city,
    category,
    rating,
    // openNow,
    search,
    page = 1,
    limit = 20,
    sort = 'rating',
  } = params

  // Build where clause
  const where: Prisma.ServiceWhereInput = {
    status: 'approved', // Only show approved services
  }

  // Filter by city slug
  if (city) {
    where.city = {
      slug: city,
    }
  }

  // Filter by category
  if (category) {
    where.prices = {
      some: {
        categoryId: category,
      },
    }
  }

  // Filter by minimum rating
  if (rating) {
    where.rating = {
      gte: rating,
    }
  }

  // Search by name or description
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ]
  }

  // Build orderBy clause
  let orderBy: Prisma.ServiceOrderByWithRelationInput = {}
  switch (sort) {
    case 'rating':
      orderBy = { rating: 'desc' }
      break
    case 'reviews':
      orderBy = { reviewsCount: 'desc' }
      break
    case 'name':
      orderBy = { name: 'asc' }
      break
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
  }

  // Calculate pagination
  const skip = (page - 1) * limit

  // Check cache
  const cacheKey = `services:${JSON.stringify({ where, orderBy, skip, limit })}`
  const cached = await getCache<any>(cacheKey)
  if (cached) {
    return cached
  }

  // Execute query
  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        city: true,
        photos: {
          where: { isPrimary: true },
          take: 1,
        },
        _count: {
          select: { reviews: true },
        },
      },
    }),
    prisma.service.count({ where }),
  ])

  const result = {
    services: services.map((service) => ({
      id: service.id,
      name: service.name,
      city: service.city.name,
      citySlug: service.city.slug,
      address: service.address,
      phone: service.phone,
      rating: Number(service.rating),
      reviewsCount: service.reviewsCount,
      primaryPhoto: service.photos[0]?.url || null,
      workingHours: service.workingHours,
      plan: service.plan,
      viewsCount: service.viewsCount,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }

  // Cache for 15 minutes
  await setCache(cacheKey, result, 900)

  return result
}

/**
 * Get service by ID
 */
export async function getServiceById(id: string) {
  // Check cache
  const cacheKey = `service:${id}`
  const cached = await getCache<any>(cacheKey)
  if (cached) {
    return cached
  }

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      city: true,
      photos: {
        orderBy: { orderIndex: 'asc' },
      },
      prices: {
        include: {
          category: true,
        },
      },
      reviews: {
        where: { status: 'approved' },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          photos: true,
        },
      },
    },
  })

  if (!service) {
    throw new ApiError(404, 'Service not found', 'SERVICE_NOT_FOUND')
  }

  if (service.status !== 'approved') {
    throw new ApiError(403, 'Service is not available', 'SERVICE_NOT_AVAILABLE')
  }

  const result = {
    id: service.id,
    name: service.name,
    description: service.description,
    city: {
      id: service.city.id,
      name: service.city.name,
      slug: service.city.slug,
    },
    address: service.address,
    coordinates: service.latitude && service.longitude
      ? {
          lat: Number(service.latitude),
          lon: Number(service.longitude),
        }
      : null,
    phone: service.phone,
    email: service.email,
    website: service.website,
    workingHours: service.workingHours,
    rating: Number(service.rating),
    reviewsCount: service.reviewsCount,
    viewsCount: service.viewsCount,
    phoneClicksCount: service.phoneClicksCount,
    plan: service.plan,
    photos: service.photos,
    prices: service.prices.map((p) => ({
      id: p.id,
      category: p.category.name,
      name: p.name,
      priceFrom: p.priceFrom ? Number(p.priceFrom) : null,
      priceTo: p.priceTo ? Number(p.priceTo) : null,
      duration: p.duration,
    })),
    recentReviews: service.reviews.map((r) => ({
      id: r.id,
      user: {
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
  }

  // Cache for 5 minutes
  await setCache(cacheKey, result, 300)

  return result
}

/**
 * Create new service (requires authentication)
 */
export async function createService(userId: string, data: CreateServiceData) {
  // Check if city exists
  const city = await prisma.city.findUnique({
    where: { id: data.cityId },
  })

  if (!city) {
    throw new ApiError(404, 'City not found', 'CITY_NOT_FOUND')
  }

  // Create service
  const service = await prisma.service.create({
    data: {
      userId,
      name: data.name,
      description: data.description || null,
      cityId: data.cityId,
      address: data.address,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      phone: data.phone,
      email: data.email || null,
      website: data.website || null,
      workingHours: data.workingHours as any,
      status: 'pending', // Requires moderation
    },
    include: {
      city: true,
    },
  })

  // Clear cache
  await deleteCachePattern('services:*')

  return service
}

/**
 * Update service (owner only)
 */
export async function updateService(serviceId: string, userId: string, data: Partial<CreateServiceData>) {
  // Get service and check ownership
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  })

  if (!service) {
    throw new ApiError(404, 'Service not found', 'SERVICE_NOT_FOUND')
  }

  if (service.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to update this service', 'FORBIDDEN')
  }

  // Update service
  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.cityId && { cityId: data.cityId }),
      ...(data.address && { address: data.address }),
      ...(data.latitude !== undefined && { latitude: data.latitude }),
      ...(data.longitude !== undefined && { longitude: data.longitude }),
      ...(data.phone && { phone: data.phone }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.website !== undefined && { website: data.website }),
      ...(data.workingHours && { workingHours: data.workingHours as any }),
    },
  })

  // Clear cache
  await deleteCachePattern('services:*')
  await deleteCachePattern(`service:${serviceId}`)

  return updated
}

/**
 * Delete service (owner only)
 */
export async function deleteService(serviceId: string, userId: string) {
  // Get service and check ownership
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  })

  if (!service) {
    throw new ApiError(404, 'Service not found', 'SERVICE_NOT_FOUND')
  }

  if (service.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to delete this service', 'FORBIDDEN')
  }

  // Delete service (cascade will delete related records)
  await prisma.service.delete({
    where: { id: serviceId },
  })

  // Clear cache
  await deleteCachePattern('services:*')
  await deleteCachePattern(`service:${serviceId}`)
}

/**
 * Track view
 */
export async function trackView(serviceId: string) {
  await prisma.service.update({
    where: { id: serviceId },
    data: {
      viewsCount: {
        increment: 1,
      },
    },
  })

  // Clear service cache
  await deleteCachePattern(`service:${serviceId}`)
}

/**
 * Track phone click
 */
export async function trackPhoneClick(serviceId: string) {
  await prisma.service.update({
    where: { id: serviceId },
    data: {
      phoneClicksCount: {
        increment: 1,
      },
    },
  })

  // Clear service cache
  await deleteCachePattern(`service:${serviceId}`)
}
