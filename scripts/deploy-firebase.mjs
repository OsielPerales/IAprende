import { spawnSync } from 'node:child_process'
import { loadEnv } from 'vite'
import { validateProduction } from './check-production-env.mjs'
const environment = process.argv[2]
const settings = { ...loadEnv(environment, process.cwd(), ''), ...process.env }
const project = settings.VITE_FIREBASE_PROJECT_ID
if (!project || !['staging', 'production'].includes(environment)) throw new Error('Selecciona entorno y VITE_FIREBASE_PROJECT_ID explícitos.')
if (environment === 'production') {
  const errors = validateProduction(settings)
  if (errors.length) throw new Error(errors.join('\n'))
} else if (settings.VITE_APP_ENV !== 'staging' || !/dev|staging|test/.test(project)) throw new Error('Staging requiere proyecto DEV y VITE_APP_ENV=staging.')
function run(args) {
  const result = spawnSync('npm', args, { stdio: 'inherit', env: settings, shell: process.platform === 'win32' })
  if (result.status !== 0) process.exit(result.status || 1)
}
// Failing checks abort before touching Firebase. Every deploy specifies its project.
run(['run', 'check'])
run(['run', 'test:rules'])
run(['exec', '--', 'firebase', 'deploy', '--project', project, '--only', 'hosting,firestore:rules,functions', '--non-interactive'])
