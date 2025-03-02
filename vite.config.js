import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: "",
  define: {
    __VUE_PROD_DEVTOOLS__: mode !== 'production'
  },
  build: {
    sourcemap: true
  },
}))
