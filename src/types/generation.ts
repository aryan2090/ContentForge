import { z } from "zod";

export const VIDEO_MODELS = [
  { id: "veo-3.1", label: "Veo 3.1 (Best quality)", price: 0.4, unit: "$/second" },
  { id: "veo-3.1-fast", label: "Veo 3.1 Fast", price: 0.15, unit: "$/second" },
  { id: "veo-3", label: "Veo 3", price: 0.4, unit: "$/second" },
  { id: "veo-2", label: "Veo 2 (Budget)", price: 0.35, unit: "$/second" },
] as const;

export const IMAGE_MODELS = [
  {
    id: "gemini-3-pro-image",
    label: "Nano Banana Pro (4K)",
    price: 0.15,
    unit: "$/image",
  },
  {
    id: "gemini-2.5-flash-image",
    label: "Nano Banana (Fast)",
    price: 0.04,
    unit: "$/image",
  },
] as const;

const videoModelIds = VIDEO_MODELS.map((m) => m.id) as [string, ...string[]];
const imageModelIds = IMAGE_MODELS.map((m) => m.id) as [string, ...string[]];

export const generateVideoSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1000),
  model: z.enum(videoModelIds).default("veo-3.1-fast"),
  aspectRatio: z.enum(["9:16", "16:9"]).default("9:16"),
  duration: z.union([z.literal(4), z.literal(6), z.literal(8)]).default(4),
  resolution: z.enum(["720p", "1080p"]).default("1080p"),
  includeBrand: z.boolean().default(false),
});

export const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1000),
  model: z.enum(imageModelIds).default("gemini-2.5-flash-image"),
  aspectRatio: z.enum(["9:16", "16:9", "1:1"]).default("1:1"),
  resolution: z.enum(["1080p", "2K", "4K"]).default("1080p"),
  includeBrand: z.boolean().default(false),
});

export type GenerateVideoInput = z.infer<typeof generateVideoSchema>;
export type GenerateImageInput = z.infer<typeof generateImageSchema>;
export type VideoModel = (typeof VIDEO_MODELS)[number];
export type ImageModel = (typeof IMAGE_MODELS)[number];

export function getEstimatedCost(modelId: string, duration?: number): number {
  const videoModel = VIDEO_MODELS.find((m) => m.id === modelId);
  if (videoModel && duration) {
    return videoModel.price * duration;
  }
  const imageModel = IMAGE_MODELS.find((m) => m.id === modelId);
  if (imageModel) {
    return imageModel.price;
  }
  return 0;
}
