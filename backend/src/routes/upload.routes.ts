import { Router } from 'express'
import * as uploadController from '../controllers/upload.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { uploadSingle, uploadMultiple } from '../middlewares/upload.middleware'

const router = Router()

/**
 * All upload routes require authentication
 */
router.use(authenticate)

/**
 * POST /api/v1/upload/image
 * Upload single image
 */
router.post('/image', uploadSingle, uploadController.uploadImage)

/**
 * POST /api/v1/upload/images
 * Upload multiple images
 */
router.post('/images', uploadMultiple, uploadController.uploadImages)

export default router
