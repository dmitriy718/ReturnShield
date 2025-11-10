import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_POSTHOG_KEY': JSON.stringify(process.env.VITE_POSTHOG_KEY || ''),
    'import.meta.env.VITE_POSTHOG_HOST': JSON.stringify(
      process.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
    ),
  },
})
