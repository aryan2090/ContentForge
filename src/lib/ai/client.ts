import { GoogleGenAI } from '@google/genai'
import { AppError } from '@/lib/utils'

let client: GoogleGenAI | null = null

export function getAIClient(): GoogleGenAI {
  if (client) {
    return client
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    throw AppError.internal('GOOGLE_AI_API_KEY environment variable is not configured')
  }

  client = new GoogleGenAI({ apiKey })
  return client
}
