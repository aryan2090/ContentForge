import { type ZodSchema, ZodError } from 'zod'
import { AppError } from './errors'

export function validateInput<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw AppError.badRequest(message, 'VALIDATION_ERROR')
    }
    throw error
  }
}

export function formatZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  error.issues.forEach(issue => {
    const path = issue.path.join('.')
    errors[path] = issue.message
  })
  return errors
}
