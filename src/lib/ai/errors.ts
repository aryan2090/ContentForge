import { AppError } from '@/lib/utils'

export const AI_ERROR_CODES = {
  RATE_LIMIT: 'AI_RATE_LIMIT',
  AUTH_ERROR: 'AI_AUTH_ERROR',
  CONTENT_BLOCKED: 'AI_CONTENT_BLOCKED',
  TIMEOUT: 'AI_TIMEOUT',
  GENERATION_FAILED: 'AI_GENERATION_FAILED',
  UNKNOWN: 'AI_UNKNOWN_ERROR',
} as const

export function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return message.includes('429') || message.includes('quota') || message.includes('rate')
  }
  return false
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return message.includes('401') || message.includes('api key') || message.includes('authentication')
  }
  return false
}

export function isContentBlockedError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return message.includes('safety') || message.includes('blocked') || message.includes('policy')
  }
  return false
}

export function handleGoogleAIError(error: unknown): never {
  if (isRateLimitError(error)) {
    throw AppError.tooManyRequests('AI service rate limit exceeded. Please try again later.')
  }

  if (isAuthError(error)) {
    throw AppError.internal('AI service authentication failed')
  }

  if (isContentBlockedError(error)) {
    throw AppError.badRequest(
      'Content was blocked by safety filters. Please modify your prompt.',
      AI_ERROR_CODES.CONTENT_BLOCKED
    )
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    if (message.includes('timeout') || message.includes('econnreset')) {
      throw AppError.internal('AI service unavailable. Please try again.')
    }
  }

  throw AppError.internal('AI generation failed unexpectedly')
}
