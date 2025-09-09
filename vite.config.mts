import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()
  ],
  server: {
  proxy: {
    '/api': {
      target: 'https://spot.api.sui-prod.bluefin.io',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
},
});
