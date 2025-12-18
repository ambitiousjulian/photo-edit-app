import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/replicate': {
          target: 'https://api.replicate.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/replicate/, ''),
          headers: {
            'Authorization': `Bearer ${env.VITE_REPLICATE_API_TOKEN}`,
          },
        },
      },
    },
  }
})
