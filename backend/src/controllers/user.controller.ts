import { Request, Response } from 'express'
import { z } from 'zod'
import { getUserProfileById, updateUserProfile } from '../services/user.service'

/**
 * Get current user profile
 */
export async function getCurrentUser(req: Request, res: Response) {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
      })
    }

    const user = await getUserProfileById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        },
      })
    }

    return res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Get current user error:', error)

    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get user profile',
        code: 'INTERNAL_ERROR',
      },
    })
  }
}

/**
 * Get user by ID
 */
export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params

    const user = await getUserProfileById(id)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        },
      })
    }

    return res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Get user by ID error:', error)

    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get user',
        code: 'INTERNAL_ERROR',
      },
    })
  }
}

/**
 * Update user profile
 */
export async function updateUser(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    const { id } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
      })
    }

    // Users can only update their own profile
    if (userId !== id) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Forbidden',
          code: 'FORBIDDEN',
        },
      })
    }

    const updateSchema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
    })

    const validatedData = updateSchema.parse(req.body)

    const updatedUser = await updateUserProfile(id, validatedData)

    return res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    console.error('Update user error:', error)

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: error.issues,
        },
      })
    }

    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update profile',
        code: 'INTERNAL_ERROR',
      },
    })
  }
}
