import type { GenerateImageInput } from '@/types/generation'
import { AppError } from '@/lib/utils'
import { getAIClient } from './client'
import { mapImageModelId, mapResolution } from './models'
import { handleGoogleAIError } from './errors'
import type { ImageGenerationResult } from './types'

export async function generateImage(
  input: GenerateImageInput,
  brandContext?: string
): Promise<ImageGenerationResult> {
  const ai = getAIClient()
  const modelId = mapImageModelId(input.model)
  const prompt = brandContext ? `${input.prompt}\n\nBrand context: ${brandContext}` : input.prompt

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          aspectRatio: input.aspectRatio,
          imageSize: mapResolution(input.resolution),
        },
      },
    })

    const parts = response.candidates?.[0]?.content?.parts
    if (!parts) {
      throw AppError.internal('No response from image generation')
    }

    const imagePart = parts.find((part) => part.inlineData?.data)
    if (!imagePart?.inlineData?.data) {
      throw AppError.internal('No image data in response')
    }

    const { data, mimeType } = imagePart.inlineData
    const imageUrl = `data:${mimeType || 'image/png'};base64,${data}`

    return {
      imageUrl,
      imageData: data,
      mimeType: mimeType || 'image/png',
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    handleGoogleAIError(error)
  }
}
