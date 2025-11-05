import { Request, Response, NextFunction } from 'express'
import * as adminService from '../services/admin.service'
import { z } from 'zod'

/**
 * Admin Controllers - for platform administrators
 */

const getUsersQuerySchema = z.object({
  role: z.enum(['user', 'business', 'admin']).optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
})

const getServicesQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
})

const getReviewsQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
})

const moderateSchema = z.object({
  status: z.enum(['approved', 'rejected']),
})

const togglePremiumSchema = z.object({
  isPremium: z.boolean(),
})

/**
 * Check if user is admin
 */
function checkAdmin(req: Request, res: Response): boolean {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      },
    })
    return false
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: {
        message: 'Access denied. Admin privileges required.',
        code: 'FORBIDDEN',
      },
    })
    return false
  }

  return true
}

/**
 * Get admin statistics
 * GET /api/v1/admin/stats
 */
export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!checkAdmin(req, res)) return

    const stats = await adminService.getAdminStats()

    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all users
 * GET /api/v1/admin/users
 */
export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!checkAdmin(req, res)) return

    const validatedQuery = getUsersQuerySchema.parse(req.query)
    const result = await adminService.getAllUsers(validatedQuery)

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all services
 * GET /api/v1/admin/services
 */
export async function getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!checkAdmin(req, res)) return

    const validatedQuery = getServicesQuerySchema.parse(req.query)
    const result = await adminService.getAllServices(validatedQuery)

    res.status(200).json({
      success: true,
      data: result.services,
      pagination: result.pagination,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all reviews
 * GET /api/v1/admin/reviews
 */
export async function getReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!checkAdmin(req, res)) return

    const validatedQuery = getReviewsQuerySchema.parse(req.query)
    const result = await adminService.getAllReviews(validatedQuery)

    res.status(200).json({
      success: true,
      data: result.reviews,
      pagination: result.pagination,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Moderate service
 * PATCH /api/v1/admin/services/:id/moderate
 */
export async function moderateService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!checkAdmin(req, res)) return

    const { id } = req.params
    const validatedData = moderateSchema.parse(req.body)

    const service = await adminService.moderateService(id, validatedData.status)

    res.status(200).json({
      success: true,
      data: service,
      message: `Service ${validatedData.status}`,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Moderate review
 * PATCH /api/v1/admin/reviews/:id/moderate
 */
export async function moderateReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!checkAdmin(req, res)) return

    const { id } = req.params
    const validatedData = moderateSchema.parse(req.body)

    const review = await adminService.moderateReview(id, validatedData.status)

    res.status(200).json({
      success: true,
      data: review,
      message: `Review ${validatedData.status}`,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete user
 * DELETE /api/v1/admin/users/:id
 */
export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!checkAdmin(req, res)) return

    const { id } = req.params
    await adminService.deleteUser(id)

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Toggle premium status
 * PATCH /api/v1/admin/services/:id/premium
 */
export async function togglePremium(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!checkAdmin(req, res)) return

    const { id } = req.params
    const validatedData = togglePremiumSchema.parse(req.body)

    const service = await adminService.togglePremium(id, validatedData.isPremium)

    res.status(200).json({
      success: true,
      data: service,
      message: `Premium status ${validatedData.isPremium ? 'enabled' : 'disabled'}`,
    })
  } catch (error) {
    next(error)
  }
}
