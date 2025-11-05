import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { errorHandler, notFound } from './middlewares/error.middleware'
import { rateLimit } from 'express-rate-limit'
import authRoutes from './routes/auth.routes'
import servicesRoutes from './routes/services.routes'
import reviewsRoutes from './routes/reviews.routes'
import citiesRoutes from './routes/cities.routes'
import categoriesRoutes from './routes/categories.routes'
import businessRoutes from './routes/business.routes'
import adminRoutes from './routes/admin.routes'
import favoritesRoutes from './routes/favorites.routes'
import uploadRoutes from './routes/upload.routes'

/**
 * Create Express application
 */
export function createApp(): Application {
  const app = express()

  // ============================================
  // Middleware
  // ============================================

  // CORS
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    })
  )

  // Body parser
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // Cookie parser
  app.use(cookieParser())

  // Static files - serve uploaded images
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  })
  app.use('/api', limiter)

  // ============================================
  // Health check
  // ============================================

  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'AutoHub API is running',
      timestamp: new Date().toISOString(),
    })
  })

  // ============================================
  // API Routes
  // ============================================

  app.get('/api/v1', (req, res) => {
    res.json({
      success: true,
      message: 'AutoHub API v1',
      version: '1.0.0',
      endpoints: {
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        services: '/api/v1/services',
        reviews: '/api/v1/reviews',
        cities: '/api/v1/cities',
        categories: '/api/v1/categories',
        business: '/api/v1/business',
        admin: '/api/v1/admin',
        favorites: '/api/v1/favorites',
        upload: '/api/v1/upload',
      },
    })
  })

  // API Routes
  app.use('/api/v1/auth', authRoutes)
  app.use('/api/v1/services', servicesRoutes)
  app.use('/api/v1', reviewsRoutes)
  app.use('/api/v1/cities', citiesRoutes)
  app.use('/api/v1/categories', categoriesRoutes)
  app.use('/api/v1/business', businessRoutes)
  app.use('/api/v1/admin', adminRoutes)
  app.use('/api/v1/favorites', favoritesRoutes)
  app.use('/api/v1/upload', uploadRoutes)

  // ============================================
  // Error Handling
  // ============================================

  app.use(notFound)
  app.use(errorHandler)

  return app
}
