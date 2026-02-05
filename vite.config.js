import path from "path" // 1. Added this missing import
import { fileURLToPath } from "url"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// 2. Correctly defining __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    viteSingleFile(),
  ],
  resolve: {
    alias: {
      // 3. Changed require('path') to just 'path'
      '@': path.resolve(__dirname, './src'),
    },
  },
})