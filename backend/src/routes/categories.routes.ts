import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { getCache, setCache } from '../config/redis'

const router = Router()

/**
 * GET /api/v1/categories
 * Get all service categories
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Check cache
    const cacheKey = 'categories:all'
    const cached = await getCache<any>(cacheKey)
    if (cached) {
      res.json({ success: true, data: cached })
      return
    }

    // Get categories
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { name: 'asc' },
    })

    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
    }))

    // Cache for 24 hours
    await setCache(cacheKey, result, 86400)

    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
})

export default router
