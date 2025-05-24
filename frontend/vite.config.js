import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import process from 'node:process'
dotenv.config()
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{port:process.env.FRONTEND_PORT}
})
