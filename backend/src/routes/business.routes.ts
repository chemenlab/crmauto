import { Router } from 'express'
import * as businessController from '../controllers/business.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

/**
 * All business routes require authentication
 */
router.use(authenticate)

/**
 * GET /api/v1/business/stats
 * Get business statistics
 */
router.get('/stats', businessController.getStats)

/**
 * GET /api/v1/business/service
 * Get business service details
 */
router.get('/service', businessController.getService)

/**
 * PUT /api/v1/business/service
 * Update business service
 */
router.put('/service', businessController.updateService)

/**
 * GET /api/v1/business/reviews
 * Get reviews for business service
 */
router.get('/reviews', businessController.getReviews)

export default router
