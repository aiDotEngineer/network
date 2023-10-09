import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    LOOPS_API_KEY: z.string().optional(),
    CMS_HOST: z.string().optional(),
    CMS_API_KEY: z.string().optional(),
    TITO_API_KEY: z.string().optional(),
    DESCOPE_PROJECT_ID: z.string().optional(),
    DESCOPE_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
  },
  client: {},
  runtimeEnv: {
    LOOPS_API_KEY: process.env.LOOPS_API_KEY,
    CMS_HOST: process.env.CMS_HOST,
    CMS_API_KEY: process.env.CMS_API_KEY,
    TITO_API_KEY: process.env.TITO_API_KEY,
    DESCOPE_PROJECT_ID: process.env.DESCOPE_PROJECT_ID,
    DESCOPE_API_KEY: process.env.DESCOPE_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
