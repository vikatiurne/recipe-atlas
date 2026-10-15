import { z } from 'zod';

const envSchema = z.object({
  STRAPI_URL: z.string().url(),
});

export const env = envSchema.parse({
  STRAPI_URL: process.env.STRAPI_URL,
});
