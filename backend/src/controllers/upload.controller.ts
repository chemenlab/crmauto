import { Request, Response, NextFunction } from 'express'
import { validateFile, getFileUrl } from '../services/upload.service'

/**
 * Upload Controllers
 */

/**
 * Upload single image
 * POST /api/v1/upload/image
 */
export async function uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: {
          message: 'No file uploaded',
          code: 'NO_FILE',
        },
      })
      return
    }

    // Validate file
    validateFile(req.file)

    // Get file URL
    const fileUrl = getFileUrl(req.file.filename)

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      message: 'File uploaded successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Upload multiple images
 * POST /api/v1/upload/images
 */
export async function uploadImages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({
        success: false,
        error: {
          message: 'No files uploaded',
          code: 'NO_FILES',
        },
      })
      return
    }

    // Validate all files
    for (const file of req.files) {
      validateFile(file)
    }

    // Get file URLs
    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      url: getFileUrl(file.filename),
      size: file.size,
      mimetype: file.mimetype,
    }))

    res.status(200).json({
      success: true,
      data: uploadedFiles,
      message: `${uploadedFiles.length} files uploaded successfully`,
    })
  } catch (error) {
    next(error)
  }
}
