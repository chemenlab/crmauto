import { Router } from 'express'
import * as favoritesController from '../controllers/favorites.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

/**
 * All favorites routes require authentication
 */
router.use(authenticate)

/**
 * GET /api/v1/favorites
 * Get user's favorites
 */
router.get('/', favoritesController.getFavorites)

/**
 * POST /api/v1/favorites/:serviceId
 * Add service to favorites
 */
router.post('/:serviceId', favoritesController.addFavorite)

/**
 * DELETE /api/v1/favorites/:serviceId
 * Remove service from favorites
 */
router.delete('/:serviceId', favoritesController.removeFavorite)

/**
 * GET /api/v1/favorites/:serviceId/check
 * Check if service is in favorites
 */
router.get('/:serviceId/check', favoritesController.checkFavorite)

export default router
