import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware'
import { getCurrentUser, getUserById, updateUser } from '../controllers/user.controller'

const router = Router()

/**
 * @route   GET /api/v1/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, getCurrentUser)

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', getUserById)

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user profile
 * @access  Private (own profile only)
 */
router.put('/:id', authenticate, updateUser)

export default router
