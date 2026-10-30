import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  const review = mode === 'review'
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'local'
  return {
    plugins: [react(), tailwindcss(), {
      name: 'build-identity',
      generateBundle() { this.emitFile({ type: 'asset', fileName: 'build-info.json', source: JSON.stringify({ mode, sha, environment: review ? 'review' : process.env.VITE_APP_ENV || 'unconfigured', visualReview: review }) }) },
    }],
    resolve: { alias: review ? ['firebase/app', 'firebase/auth', 'firebase/firestore'].map(name => ({ find: new RegExp('^' + name + '$'), replacement: fileURLToPath(new URL('./src/review/firebase.ts', import.meta.url)) })) : [] },
    define: {
      'import.meta.env.VITE_BUILD_SHA': JSON.stringify(sha),
      ...(review ? { 'import.meta.env.VITE_USE_EMULATORS': JSON.stringify('false'), 'import.meta.env.VITE_AI_PROXY_URL': JSON.stringify('demo'), 'import.meta.env.VITE_AI_CLAUDE_URL': JSON.stringify('') } : {}),
    },
    build: { outDir: review ? 'dist-review' : 'dist' },
  }
})
