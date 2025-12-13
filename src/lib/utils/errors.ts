export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }

  static badRequest(message: string, code?: string) {
    return new AppError(message, 400, code)
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401, 'UNAUTHORIZED')
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403, 'FORBIDDEN')
  }

  static notFound(message = 'Not found') {
    return new AppError(message, 404, 'NOT_FOUND')
  }

  static tooManyRequests(message = 'Too many requests') {
    return new AppError(message, 429, 'RATE_LIMIT')
  }

  static internal(message = 'Internal server error') {
    return new AppError(message, 500, 'INTERNAL_ERROR')
  }
}

export function handleError(error: unknown): { message: string; statusCode: number; code?: string } {
  if (error instanceof AppError) {
    return { message: error.message, statusCode: error.statusCode, code: error.code }
  }
  if (error instanceof Error) {
    console.error('Unhandled error:', error)
    return { message: 'An unexpected error occurred', statusCode: 500 }
  }
  return { message: 'An unknown error occurred', statusCode: 500 }
}
