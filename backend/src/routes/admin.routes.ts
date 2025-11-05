import { Router } from 'express'
import * as adminController from '../controllers/admin.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

/**
 * All admin routes require authentication
 */
router.use(authenticate)

/**
 * GET /api/v1/admin/stats
 * Get admin dashboard statistics
 */
router.get('/stats', adminController.getStats)

/**
 * GET /api/v1/admin/users
 * Get all users
 */
router.get('/users', adminController.getUsers)

/**
 * DELETE /api/v1/admin/users/:id
 * Delete user
 */
router.delete('/users/:id', adminController.deleteUser)

/**
 * GET /api/v1/admin/services
 * Get all services
 */
router.get('/services', adminController.getServices)

/**
 * PATCH /api/v1/admin/services/:id/moderate
 * Approve or reject service
 */
router.patch('/services/:id/moderate', adminController.moderateService)

/**
 * PATCH /api/v1/admin/services/:id/premium
 * Toggle premium status
 */
router.patch('/services/:id/premium', adminController.togglePremium)

/**
 * GET /api/v1/admin/reviews
 * Get all reviews
 */
router.get('/reviews', adminController.getReviews)

/**
 * PATCH /api/v1/admin/reviews/:id/moderate
 * Approve or reject review
 */
router.patch('/reviews/:id/moderate', adminController.moderateReview)

export default router
