export interface VideoGenerationResult {
  videoUrl: string
  videoData: string
  durationSeconds: number
  mimeType: string
}

export interface ImageGenerationResult {
  imageUrl: string
  imageData: string
  mimeType: string
}

export interface PollingOptions {
  maxAttempts?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
}

export const DEFAULT_POLLING_OPTIONS: Required<PollingOptions> = {
  maxAttempts: 60,
  initialDelayMs: 2000,
  maxDelayMs: 30000,
  backoffMultiplier: 1.5,
}
