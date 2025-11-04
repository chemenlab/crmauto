import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import * as servicesService from '../services/services.service'

/**
 * Services Controllers
 */

// Validation schemas
const getServicesSchema = z.object({
  city: z.string().optional(),
  category: z.coerce.number().int().positive().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  openNow: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sort: z.enum(['rating', 'reviews', 'name', 'newest']).optional(),
})

const createServiceSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().max(5000).optional(),
  cityId: z.number().int().positive(),
  address: z.string().min(10).max(500),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  workingHours: z.record(z.string()),
})

const updateServiceSchema = createServiceSchema.partial()

/**
 * GET /api/v1/services
 * Get list of services with filters
 */
export async function getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = getServicesSchema.parse(req.query)
    const result = await servicesService.getServices(params)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/v1/services/:id
 * Get service by ID
 */
export async function getServiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params
    const service = await servicesService.getServiceById(id)

    res.status(200).json({
      success: true,
      data: service,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/v1/services
 * Create new service (requires authentication)
 */
export async function createService(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    const data = createServiceSchema.parse(req.body)
    const service = await servicesService.createService(req.user.userId, data)

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created and sent for moderation',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /api/v1/services/:id
 * Update service (owner only)
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

    const { id } = req.params
    const data = updateServiceSchema.parse(req.body)
    const service = await servicesService.updateService(id, req.user.userId, data)

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
 * DELETE /api/v1/services/:id
 * Delete service (owner only)
 */
export async function deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    await servicesService.deleteService(id, req.user.userId)

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/v1/services/:id/track-view
 * Track service view
 */
export async function trackView(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params
    await servicesService.trackView(id)

    res.status(200).json({
      success: true,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/v1/services/:id/track-phone-click
 * Track phone click
 */
export async function trackPhoneClick(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params
    await servicesService.trackPhoneClick(id)

    res.status(200).json({
      success: true,
    })
  } catch (error) {
    next(error)
  }
}
