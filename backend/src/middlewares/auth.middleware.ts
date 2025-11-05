import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ApiError } from './error.middleware'

/**
 * JWT Payload interface
 */
interface JwtPayload {
  userId: string
  email: string
  role: string
}

/**
 * Extend Express Request type
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided', 'NO_TOKEN')
    }

    const token = authHeader.substring(7)

    // Verify token
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET not configured')
    }

    const payload = jwt.verify(token, secret) as JwtPayload

    // Attach user to request
    req.user = payload

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid token', 'INVALID_TOKEN'))
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, 'Token expired', 'TOKEN_EXPIRED'))
    } else {
      next(error)
    }
  }
}

/**
 * Check if user has required role
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED')
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden - Insufficient permissions', 'FORBIDDEN')
    }

    next()
  }
}
