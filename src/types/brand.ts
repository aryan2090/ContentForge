import { z } from "zod";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const INDUSTRIES = [
  "technology",
  "retail",
  "food",
  "health",
  "finance",
  "education",
  "entertainment",
  "travel",
  "fashion",
  "other",
] as const;

export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100),
  logoUrl: z.string().url("Invalid URL").optional().nullable(),
  primaryColor: z
    .string()
    .regex(hexColorRegex, "Invalid hex color")
    .default("#000000"),
  secondaryColor: z
    .string()
    .regex(hexColorRegex, "Invalid hex color")
    .default("#ffffff"),
  accentColor: z
    .string()
    .regex(hexColorRegex, "Invalid hex color")
    .default("#3b82f6"),
  voiceDescription: z.string().max(500).optional().nullable(),
  industry: z.enum(INDUSTRIES).default("other"),
});

export type BrandInput = z.infer<typeof brandSchema>;
export type Industry = (typeof INDUSTRIES)[number];
