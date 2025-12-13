import { VIDEO_MODELS, IMAGE_MODELS, VideoModel, ImageModel } from '@/types/generation'

export { VIDEO_MODELS, IMAGE_MODELS }
export type { VideoModel, ImageModel }

const VIDEO_MODEL_ID_MAP: Record<string, string> = {
  'veo-3.1': 'veo-3.1-generate-preview',
  'veo-3.1-fast': 'veo-3.1-fast-generate-preview',
  'veo-3': 'veo-3.0-generate-001',
  'veo-2': 'veo-2.0-generate-001',
}

const IMAGE_MODEL_ID_MAP: Record<string, string> = {
  'gemini-3-pro-image': 'gemini-3-pro-image-preview',
  'gemini-2.5-flash-image': 'gemini-2.5-flash-image',
}

const RESOLUTION_MAP: Record<string, string> = {
  '1080p': '1K',
  '2K': '2K',
  '4K': '4K',
}

export function getVideoModel(id: string): VideoModel {
  return VIDEO_MODELS.find((m) => m.id === id) ?? VIDEO_MODELS[1]
}

export function getImageModel(id: string): ImageModel {
  return IMAGE_MODELS.find((m) => m.id === id) ?? IMAGE_MODELS[1]
}

export function mapVideoModelId(id: string): string {
  return VIDEO_MODEL_ID_MAP[id] ?? VIDEO_MODEL_ID_MAP['veo-3.1-fast']
}

export function mapImageModelId(id: string): string {
  return IMAGE_MODEL_ID_MAP[id] ?? IMAGE_MODEL_ID_MAP['gemini-2.5-flash-image']
}

export function mapResolution(resolution: string): string {
  return RESOLUTION_MAP[resolution] ?? '1K'
}
