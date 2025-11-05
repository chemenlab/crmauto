import jwt from 'jsonwebtoken'

/**
 * JWT utility functions
 */

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

/**
 * Generate access token
 */
export function generateAccessToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET not configured')
  }

  // @ts-ignore - TypeScript has issues with jsonwebtoken types
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  })
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(payload: TokenPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET not configured')
  }

  // @ts-ignore - TypeScript has issues with jsonwebtoken types
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  })
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET not configured')
  }

  return jwt.verify(token, secret) as TokenPayload
}
