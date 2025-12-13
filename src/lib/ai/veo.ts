import type { GenerateVideosOperation } from '@google/genai'
import type { GenerateVideoInput } from '@/types/generation'
import { AppError } from '@/lib/utils'
import { getAIClient } from './client'
import { mapVideoModelId } from './models'
import { handleGoogleAIError, AI_ERROR_CODES } from './errors'
import type { VideoGenerationResult, PollingOptions } from './types'
import { DEFAULT_POLLING_OPTIONS } from './types'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function pollForCompletion(
  operation: GenerateVideosOperation,
  options: PollingOptions = {}
): Promise<VideoGenerationResult> {
  const ai = getAIClient()
  const { maxAttempts, initialDelayMs, maxDelayMs, backoffMultiplier } = {
    ...DEFAULT_POLLING_OPTIONS,
    ...options,
  }

  let currentOperation = operation
  let attempts = 0
  let delay = initialDelayMs

  while (attempts < maxAttempts) {
    try {
      if (currentOperation.done) {
        if (currentOperation.error) {
          const errorMessage =
            typeof currentOperation.error === 'object'
              ? JSON.stringify(currentOperation.error)
              : 'Unknown error'
          throw AppError.internal(`Video generation failed: ${errorMessage}`, AI_ERROR_CODES.GENERATION_FAILED)
        }

        const result = currentOperation.response
        if (!result?.generatedVideos?.[0]) {
          throw AppError.internal('No video data in completed operation')
        }

        const generatedVideo = result.generatedVideos[0]
        const video = generatedVideo.video
        const videoData = video?.videoBytes || ''
        const videoUri = video?.uri || ''
        const mimeType = video?.mimeType || 'video/mp4'

        return {
          videoUrl: videoUri || (videoData ? `data:${mimeType};base64,${videoData}` : ''),
          videoData,
          durationSeconds: 0,
          mimeType,
        }
      }

      await sleep(delay)
      delay = Math.min(delay * backoffMultiplier, maxDelayMs)
      attempts++

      currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation })
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      handleGoogleAIError(error)
    }
  }

  throw AppError.internal('Video generation timed out. Please try again.', AI_ERROR_CODES.TIMEOUT)
}

export async function generateVideo(
  input: GenerateVideoInput,
  brandContext?: string
): Promise<VideoGenerationResult> {
  const ai = getAIClient()
  const modelId = mapVideoModelId(input.model)
  const prompt = brandContext ? `${input.prompt}\n\nBrand context: ${brandContext}` : input.prompt

  try {
    const operation = await ai.models.generateVideos({
      model: modelId,
      prompt,
      config: {
        aspectRatio: input.aspectRatio,
        durationSeconds: input.duration,
      },
    })

    return await pollForCompletion(operation)
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    handleGoogleAIError(error)
  }
}
