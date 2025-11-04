import { Router } from 'express'
import * as servicesController from '../controllers/services.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

/**
 * GET /api/v1/services
 * Get list of services with filters
 */
router.get('/', servicesController.getServices)

/**
 * GET /api/v1/services/:id
 * Get service by ID
 */
router.get('/:id', servicesController.getServiceById)

/**
 * POST /api/v1/services
 * Create new service (requires authentication)
 */
router.post('/', authenticate, servicesController.createService)

/**
 * PUT /api/v1/services/:id
 * Update service (requires authentication, owner only)
 */
router.put('/:id', authenticate, servicesController.updateService)

/**
 * DELETE /api/v1/services/:id
 * Delete service (requires authentication, owner only)
 */
router.delete('/:id', authenticate, servicesController.deleteService)

/**
 * POST /api/v1/services/:id/track-view
 * Track service view
 */
router.post('/:id/track-view', servicesController.trackView)

/**
 * POST /api/v1/services/:id/track-phone-click
 * Track phone click
 */
router.post('/:id/track-phone-click', servicesController.trackPhoneClick)

export default router
