import { pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'
export function validateProduction(env) {
  const errors = []
  for (const key of ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_APP_ID']) {
    if (!env[key] || /PLACEHOLDER|example|^demo-/i.test(env[key])) errors.push(`${key} falta o contiene un marcador de prueba`)
  }
  if (env.VITE_APP_ENV !== 'production') errors.push('VITE_APP_ENV debe ser production')
  if (/dev|staging|test|review/i.test(env.VITE_FIREBASE_PROJECT_ID || '')) errors.push('El proyecto Firebase parece de desarrollo')
  if (env.VITE_USE_EMULATORS === 'true') errors.push('Los emuladores deben estar deshabilitados')
  for (const key of ['VITE_AI_CLAUDE_URL', 'VITE_AI_PROXY_URL']) {
    if (!env[key]?.startsWith('https://') || /localhost|127\.0\.0\.1|demo|example/i.test(env[key])) errors.push(`${key} requiere una URL HTTPS real`)
  }
  return errors
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errors = validateProduction({ ...loadEnv('production', process.cwd(), ''), ...process.env })
  if (errors.length) { console.error('Publicación detenida:\n- ' + errors.join('\n- ')); process.exitCode = 1 }
  else console.log('Configuración de producción validada. Falta la validación funcional del entorno.')
}
