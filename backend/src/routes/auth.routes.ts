import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { rateLimit } from 'express-rate-limit'

const router = Router()

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Too many authentication attempts, please try again later',
})

/**
 * POST /api/v1/auth/register
 * Register new user
 */
router.post('/register', authLimiter, authController.register)

/**
 * POST /api/v1/auth/login
 * Login user
 */
router.post('/login', authLimiter, authController.login)

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
router.post('/refresh', authController.refresh)

/**
 * POST /api/v1/auth/logout
 * Logout user
 */
router.post('/logout', authController.logout)

/**
 * GET /api/v1/auth/me
 * Get current user (requires authentication)
 */
router.get('/me', authenticate, authController.getCurrentUser)

export default router
