import { spawnSync } from 'node:child_process'
import { cpSync, rmSync } from 'node:fs'
const mode = process.env.VITE_APP_ENV
if (!['review', 'staging', 'production'].includes(mode)) throw new Error('Define VITE_APP_ENV=review, staging o production explícitamente.')
const script = mode === 'review' ? 'build:review' : mode === 'production' ? 'build:production' : 'build'
if (mode === 'staging' && (!process.env.VITE_FIREBASE_PROJECT_ID || !/dev|staging|test/.test(process.env.VITE_FIREBASE_PROJECT_ID))) throw new Error('Staging requiere un proyecto Firebase de desarrollo explícito.')
for (const args of [['test'], ['--prefix', 'functions', 'run', 'build'], ['--prefix', 'mcp-server', 'run', 'build']]) {
  const check = spawnSync('npm', args, { stdio: 'inherit', shell: process.platform === 'win32' })
  if (check.status !== 0) process.exit(check.status || 1)
}
const result = spawnSync('npm', ['run', script], { stdio: 'inherit', shell: process.platform === 'win32' })
if (result.status !== 0) process.exit(result.status || 1)
if (mode === 'review') { rmSync('dist', { recursive: true, force: true }); cpSync('dist-review', 'dist', { recursive: true }) }
