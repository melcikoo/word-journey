import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 전체 URL 대신, 배포되는 하위 경로(레포지토리 명)만 적어줍니다.
  base: '/word-journey/', 
})