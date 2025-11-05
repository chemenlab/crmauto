import { Request, Response, NextFunction } from 'express'
import * as businessService from '../services/business.service'
import { z } from 'zod'

/**
 * Business Controllers - for service owners
 */

// Validation schemas
const updateServiceSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(50).max(2000).optional(),
  address: z.string().min(10).optional(),
  phone: z.string().regex(/^\+7\d{10}$/).optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  workingHours: z.record(z.string(), z.string()).optional(),
})

const getReviewsQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
})

/**
 * Get business statistics
 * GET /api/v1/business/stats
 */
export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
      })
      return
    }

    // Check if user is business owner
    if (req.user.role !== 'business') {
      res.status(403).json({
        success: false,
        error: {
          message: 'Access denied. Business account required.',
          code: 'FORBIDDEN',
        },
      })
      return
    }

    const stats = await businessService.getBusinessStats(req.user.userId)

    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get business service
 * GET /api/v1/business/service
 */
export async function getService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
      })
      return
    }

    if (req.user.role !== 'business') {
      res.status(403).json({
        success: false,
        error: {
          message: 'Access denied. Business account required.',
          code: 'FORBIDDEN',
        },
      })
      return
    }

    const service = await businessService.getBusinessService(req.user.userId)

    res.status(200).json({
      success: true,
      data: service,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update business service
 * PUT /api/v1/business/service
 */
export async function updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
      })
      return
    }

    if (req.user.role !== 'business') {
      res.status(403).json({
        success: false,
        error: {
          message: 'Access denied. Business account required.',
          code: 'FORBIDDEN',
        },
      })
      return
    }

    // Validate request body
    const validatedData = updateServiceSchema.parse(req.body)

    const service = await businessService.updateBusinessService(req.user.userId, validatedData)

    res.status(200).json({
      success: true,
      data: service,
      message: 'Service updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get reviews for business service
 * GET /api/v1/business/reviews
 */
export async function getReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
      })
      return
    }

    if (req.user.role !== 'business') {
      res.status(403).json({
        success: false,
        error: {
          message: 'Access denied. Business account required.',
          code: 'FORBIDDEN',
        },
      })
      return
    }

    // Validate query params
    const validatedQuery = getReviewsQuerySchema.parse(req.query)

    const result = await businessService.getBusinessReviews(req.user.userId, validatedQuery)

    res.status(200).json({
      success: true,
      data: result.reviews,
      pagination: result.pagination,
    })
  } catch (error) {
    next(error)
  }
}
