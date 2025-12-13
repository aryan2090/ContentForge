import { NextResponse } from 'next/server'
import { handleError } from './errors'

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(error: unknown) {
  const { message, statusCode, code } = handleError(error)
  return NextResponse.json(
    { success: false, error: message, code },
    { status: statusCode }
  )
}
