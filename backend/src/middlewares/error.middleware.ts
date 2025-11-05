import { Request, Response, NextFunction } from 'express'

/**
 * Custom Error class
 */
export class ApiError extends Error {
  statusCode: number
  code?: string

  constructor(statusCode: number, message: string, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Error handling middleware
 */
export const errorHandler = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err)

  // Default error
  let statusCode = 500
  let message = 'Internal Server Error'
  let code: string | undefined

  // API Error
  if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
    code = err.code
  }

  // Prisma Errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any
    if (prismaError.code === 'P2002') {
      statusCode = 409
      message = 'Resource already exists'
      code = 'DUPLICATE_ENTRY'
    } else if (prismaError.code === 'P2025') {
      statusCode = 404
      message = 'Resource not found'
      code = 'NOT_FOUND'
    }
  }

  // Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = err.message
    code = 'VALIDATION_ERROR'
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
    code = 'INVALID_TOKEN'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
    code = 'TOKEN_EXPIRED'
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
}

/**
 * Not found middleware
 */
export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
    },
  })
}
