import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { getCache, setCache } from '../config/redis'

const router = Router()

/**
 * GET /api/v1/cities
 * Get all cities
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Check cache
    const cacheKey = 'cities:all'
    const cached = await getCache<any>(cacheKey)
    if (cached) {
      res.json({ success: true, data: cached })
      return
    }

    // Get cities with service count
    const cities = await prisma.city.findMany({
      include: {
        _count: {
          select: { services: { where: { status: 'approved' } } },
        },
      },
      orderBy: { name: 'asc' },
    })

    const result = cities.map((city) => ({
      id: city.id,
      name: city.name,
      slug: city.slug,
      region: city.region,
      servicesCount: city._count.services,
    }))

    // Cache for 24 hours
    await setCache(cacheKey, result, 86400)

    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/v1/cities/:slug
 * Get city by slug
 */
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const city = await prisma.city.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { services: { where: { status: 'approved' } } },
        },
      },
    })

    if (!city) {
      res.status(404).json({
        success: false,
        error: { message: 'City not found', code: 'CITY_NOT_FOUND' },
      })
      return
    }

    res.json({
      success: true,
      data: {
        id: city.id,
        name: city.name,
        slug: city.slug,
        region: city.region,
        population: city.population,
        servicesCount: city._count.services,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
