import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'
import { registerSchema } from '@/types/auth'
import {
  successResponse,
  errorResponse,
  validateInput,
  AppError,
} from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = validateInput(registerSchema, body)

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      throw AppError.badRequest(
        'An account with this email already exists',
        'EMAIL_EXISTS'
      )
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })

    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      201
    )
  } catch (error) {
    return errorResponse(error)
  }
}
