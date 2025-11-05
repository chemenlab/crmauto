import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

/**
 * Configure multer storage
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

/**
 * File filter
 */
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'))
  }
}

/**
 * Multer upload instance
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
})

/**
 * Upload single image
 */
export const uploadSingle = upload.single('image')

/**
 * Upload multiple images (max 10)
 */
export const uploadMultiple = upload.array('images', 10)
