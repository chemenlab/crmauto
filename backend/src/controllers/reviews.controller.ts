import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import * as reviewsService from '../services/reviews.service'

/**
 * Reviews Controllers
 */

const getReviewsSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sort: z.enum(['recent', 'rating_desc', 'rating_asc']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
})

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(255).optional(),
  text: z.string().min(100).max(2000),
  pros: z.string().max(500).optional(),
  cons: z.string().max(500).optional(),
})

const updateReviewSchema = createReviewSchema.partial()

const addResponseSchema = z.object({
  response: z.string().min(10).max(1000),
})

/**
 * GET /api/v1/services/:serviceId/reviews
 * Get reviews for a service
 */
export async function getServiceReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { serviceId } = req.params
    const params = getReviewsSchema.parse(req.query)

    const result = await reviewsService.getServiceReviews({
      serviceId,
      ...params,
    })

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/v1/services/:serviceId/reviews
 * Create review for a service
 */
export async function createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    const { serviceId } = req.params
    const data = createReviewSchema.parse(req.body)

    const review = await reviewsService.createReview(req.user.userId, serviceId, data)

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created and sent for moderation',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /api/v1/reviews/:id
 * Update review
 */
export async function updateReview(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    const { id } = req.params
    const data = updateReviewSchema.parse(req.body)

    const review = await reviewsService.updateReview(id, req.user.userId, data)

    res.status(200).json({
      success: true,
      data: review,
      message: 'Review updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/v1/reviews/:id
 * Delete review
 */
export async function deleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    const { id } = req.params
    await reviewsService.deleteReview(id, req.user.userId)

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/v1/reviews/:id/response
 * Add response to review (service owner only)
 */
export async function addReviewResponse(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    const { id } = req.params
    const { response } = addResponseSchema.parse(req.body)

    const review = await reviewsService.addReviewResponse(id, req.user.userId, response)

    res.status(200).json({
      success: true,
      data: review,
      message: 'Response added successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/v1/users/me/reviews
 * Get current user's reviews
 */
export async function getMyReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    const reviews = await reviewsService.getUserReviews(req.user.userId)

    res.status(200).json({
      success: true,
      data: reviews,
    })
  } catch (error) {
    next(error)
  }
}
