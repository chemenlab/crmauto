import { Router } from 'express'
import * as reviewsController from '../controllers/reviews.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

/**
 * GET /api/v1/services/:serviceId/reviews
 * Get reviews for a service
 */
router.get('/services/:serviceId/reviews', reviewsController.getServiceReviews)

/**
 * POST /api/v1/services/:serviceId/reviews
 * Create review for a service (requires authentication)
 */
router.post('/services/:serviceId/reviews', authenticate, reviewsController.createReview)

/**
 * PUT /api/v1/reviews/:id
 * Update review (requires authentication, owner only)
 */
router.put('/reviews/:id', authenticate, reviewsController.updateReview)

/**
 * DELETE /api/v1/reviews/:id
 * Delete review (requires authentication, owner only)
 */
router.delete('/reviews/:id', authenticate, reviewsController.deleteReview)

/**
 * POST /api/v1/reviews/:id/response
 * Add response to review (requires authentication, service owner only)
 */
router.post('/reviews/:id/response', authenticate, reviewsController.addReviewResponse)

/**
 * GET /api/v1/users/me/reviews
 * Get current user's reviews (requires authentication)
 */
router.get('/users/me/reviews', authenticate, reviewsController.getMyReviews)

export default router
