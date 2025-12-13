import { cache } from 'react'
import { auth } from '@/lib/auth'
import { AppError } from '@/lib/utils'

/**
 * Get the current session with React cache for request deduplication
 * Returns null if not authenticated
 */
export const getSession = cache(async () => {
  const session = await auth()
  return session
})

/**
 * Get the current session or throw an error if not authenticated
 * Use in server components/actions that require authentication
 */
export const requireAuth = cache(async () => {
  const session = await getSession()

  if (!session?.user) {
    throw AppError.unauthorized('You must be logged in to access this resource')
  }

  return session
})

/**
 * Get the current user ID or throw if not authenticated
 * Convenience helper for common use case
 */
export const getCurrentUserId = cache(async () => {
  const session = await requireAuth()
  return session.user.id
})
