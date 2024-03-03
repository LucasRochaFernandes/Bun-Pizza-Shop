import { z } from 'zod'
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string(),
  AUTH_REDIRECT_URL: z.string(),
  JWT_SECRET_KEY: z.string().min(10),
})

export const env = envSchema.parse(process.env)
