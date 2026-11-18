import { defineConfig } from 'vite'

// React 17+ 자동 JSX 런타임 사용 (각 파일에서 React를 import하지 않아도 됨)
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
})
