import { getAIClient } from './client'

export interface EnhancePromptOptions {
  brandContext?: string
  contentType?: 'video' | 'image'
  maxLength?: number
}

export async function enhancePrompt(
  prompt: string,
  options: EnhancePromptOptions = {}
): Promise<string> {
  const { brandContext, contentType = 'image', maxLength = 500 } = options

  const systemPrompt = `You are a prompt engineer specializing in AI content generation.
Improve the following prompt for ${brandContext ? 'brand-aligned ' : ''}social media ${contentType} content generation.
Make it more descriptive, specific, and likely to produce high-quality results.
Keep the enhanced prompt under ${maxLength} characters.
${brandContext ? `Brand context: ${brandContext}` : ''}
Return ONLY the enhanced prompt, nothing else.`

  try {
    const ai = getAIClient()
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemPrompt}\n\nOriginal prompt: ${prompt}`,
    })

    const enhancedPrompt = response.text?.trim()
    return enhancedPrompt || prompt
  } catch (error) {
    console.error('Prompt enhancement failed:', error)
    return prompt
  }
}
