import { prisma } from '../config/database'
import { ApiError } from '../middlewares/error.middleware'

/**
 * Favorites Service
 */

/**
 * Get user's favorites
 */
export async function getUserFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      service: {
        include: {
          city: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return favorites.map((fav) => fav.service)
}

/**
 * Add service to favorites
 */
export async function addToFavorites(userId: string, serviceId: string) {
  // Check if service exists
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  })

  if (!service) {
    throw new ApiError(404, 'Service not found', 'SERVICE_NOT_FOUND')
  }

  // Check if already in favorites
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_serviceId: {
        userId,
        serviceId,
      },
    },
  })

  if (existing) {
    throw new ApiError(400, 'Service already in favorites', 'ALREADY_IN_FAVORITES')
  }

  // Add to favorites
  const favorite = await prisma.favorite.create({
    data: {
      userId,
      serviceId,
    },
    include: {
      service: {
        include: {
          city: true,
        },
      },
    },
  })

  return favorite.service
}

/**
 * Remove service from favorites
 */
export async function removeFromFavorites(userId: string, serviceId: string) {
  // Check if exists in favorites
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_serviceId: {
        userId,
        serviceId,
      },
    },
  })

  if (!existing) {
    throw new ApiError(404, 'Service not in favorites', 'NOT_IN_FAVORITES')
  }

  // Remove from favorites
  await prisma.favorite.delete({
    where: {
      userId_serviceId: {
        userId,
        serviceId,
      },
    },
  })

  return { success: true }
}

/**
 * Check if service is in user's favorites
 */
export async function isInFavorites(userId: string, serviceId: string): Promise<boolean> {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_serviceId: {
        userId,
        serviceId,
      },
    },
  })

  return !!favorite
}
