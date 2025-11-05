import fs from 'fs/promises'
import path from 'path'
import { ApiError } from '../middlewares/error.middleware'

/**
 * Upload Service
 */

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * Ensure upload directory exists
 */
export async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR)
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  }
}

/**
 * Validate uploaded file
 */
export function validateFile(file: Express.Multer.File) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new ApiError(
      400,
      'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
      'INVALID_FILE_TYPE'
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ApiError(400, 'File too large. Maximum size is 10MB.', 'FILE_TOO_LARGE')
  }
}

/**
 * Get file URL
 */
export function getFileUrl(filename: string): string {
  const baseUrl = process.env.API_URL || 'http://localhost:5000'
  return `${baseUrl}/uploads/${filename}`
}

/**
 * Delete file
 */
export async function deleteFile(filename: string) {
  try {
    const filePath = path.join(UPLOAD_DIR, filename)
    await fs.unlink(filePath)
  } catch (error) {
    console.error('Failed to delete file:', error)
  }
}
