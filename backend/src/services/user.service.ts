import { prisma } from '../config/database'

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  phone?: string
}

/**
 * Get user profile by ID
 */
export async function getUserProfileById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
  })

  return user
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, data: UpdateUserData) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
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
  })

  return user
}
