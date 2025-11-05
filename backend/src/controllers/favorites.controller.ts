import { Request, Response, NextFunction } from 'express'
import * as favoritesService from '../services/favorites.service'

/**
 * Favorites Controllers
 */

/**
 * Get user's favorites
 * GET /api/v1/favorites
 */
export async function getFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    const favorites = await favoritesService.getUserFavorites(req.user.userId)

    res.status(200).json({
      success: true,
      data: favorites,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Add service to favorites
 * POST /api/v1/favorites/:serviceId
 */
export async function addFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    const { serviceId } = req.params
    const service = await favoritesService.addToFavorites(req.user.userId, serviceId)

    res.status(201).json({
      success: true,
      data: service,
      message: 'Added to favorites',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Remove service from favorites
 * DELETE /api/v1/favorites/:serviceId
 */
export async function removeFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    const { serviceId } = req.params
    await favoritesService.removeFromFavorites(req.user.userId, serviceId)

    res.status(200).json({
      success: true,
      message: 'Removed from favorites',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Check if service is in favorites
 * GET /api/v1/favorites/:serviceId/check
 */
export async function checkFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    const { serviceId } = req.params
    const isFavorite = await favoritesService.isInFavorites(req.user.userId, serviceId)

    res.status(200).json({
      success: true,
      data: { isFavorite },
    })
  } catch (error) {
    next(error)
  }
}
