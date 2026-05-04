export const APP_CONFIG = {
  API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  GOOGLE_LOGIN_URL: process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL || '',
} as const;
