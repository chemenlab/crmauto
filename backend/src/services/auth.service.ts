import bcrypt from 'bcrypt'
import { prisma } from '../config/database'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util'
import { ApiError } from '../middlewares/error.middleware'

/**
 * Authentication Service
 */

export interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: 'user' | 'business' | 'admin'
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    role: string
    emailVerified: boolean
  }
  accessToken: string
  refreshToken: string
}

/**
 * Register new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists', 'USER_EXISTS')
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 12)

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      phone: data.phone || null,
      role: data.role || 'user',
    },
  })

  // Generate tokens
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  const accessToken = generateAccessToken(tokenPayload)
  const refreshToken = generateRefreshToken(tokenPayload)

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    accessToken,
    refreshToken,
  }
}

/**
 * Login user
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (!user) {
    throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS')
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash)

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS')
  }

  // Generate tokens
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  const accessToken = generateAccessToken(tokenPayload)
  const refreshToken = generateRefreshToken(tokenPayload)

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    accessToken,
    refreshToken,
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
  try {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      throw new ApiError(401, 'User not found', 'USER_NOT_FOUND')
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return { accessToken: newAccessToken }
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN')
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
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
      updatedAt: true,
    },
  })

  if (!user) {
    throw new ApiError(404, 'User not found', 'USER_NOT_FOUND')
  }

  return user
}
