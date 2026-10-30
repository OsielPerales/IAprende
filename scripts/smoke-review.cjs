const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const base = process.env.REVIEW_URL || 'http://127.0.0.1:4173'
let server, browser
;(async () => {
  if (!process.env.REVIEW_URL) {
    server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--mode', 'review', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { stdio: 'ignore' })
    let ready = false
    for (let i = 0; i < 60; i++) {
      try { if ((await fetch(base)).ok) { ready = true; break } } catch {}
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    if (!ready) throw new Error('El servidor de revisión no inició')
  }
  browser = await chromium.launch({ headless: true, ...(process.env.REVIEW_BROWSER_PATH ? { executablePath: process.env.REVIEW_BROWSER_PATH } : {}) })
  const failures = [], external = [], results = []
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  page.on('pageerror', error => failures.push({ page: page.url(), message: error.message, stack: error.stack }))
  page.on('request', request => { if (/firestore\.googleapis|identitytoolkit\.googleapis|securetoken\.googleapis|cloudfunctions\.net|api\.anthropic/.test(request.url())) external.push(request.url()) })
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.getByRole('complementary', { name: 'Controles de revisión visual' }).waitFor()
  const controls = page.getByRole('complementary', { name: 'Controles de revisión visual' })
  for (const [role, path] of [['Alumno', '/app'], ['Maestro', '/maestro'], ['Administrador', '/admin']]) {
    await controls.getByRole('button', { name: role, exact: true }).click()
    await page.waitForURL('**' + path)
    await page.waitForLoadState('networkidle')
    const width = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }))
    if (width.document > width.viewport + 3) failures.push(`${role}: desbordamiento horizontal ${width.document}/${width.viewport}`)
    const prefix = role === 'Alumno' ? '/app' : role === 'Maestro' ? '/maestro' : '/admin'
    for (const target of [prefix + '/cursos', prefix + '/grupos', prefix + '/calificaciones']) {
      await page.goto(base + target, { waitUntil: 'networkidle' })
      if (!page.url().endsWith(target)) failures.push(`${role}: no pudo abrir ${target}`)
      const size = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }))
      if (size.document > size.viewport + 3) failures.push(`${target}: desbordamiento horizontal ${size.document}/${size.viewport}`)
      results.push(`${role}: ${target}`)
    }
  }
  await controls.getByRole('button', { name: 'Maestro', exact: true }).click()
  await page.waitForURL('**/maestro')
  await page.goto(base + '/maestro/cursos', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Generar con IA', exact: true }).click()
  await page.getByRole('dialog', { name: 'Generación con IA' }).waitFor()
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
  results.push('Maestro: generación no habilitada informa al usuario')
  await page.goto(base + '/maestro/curso/c-ia-estrategica/editar', { waitUntil: 'networkidle' })
  if (!(await page.locator('body').innerText()).includes('IA Estratégica')) failures.push('Editor no cargó el curso de ejemplo')
  results.push('Maestro: editor del curso')
  await controls.getByRole('button', { name: 'Alumno', exact: true }).click()
  await page.waitForURL('**/app')
  await page.goto(base + '/app/curso/c-ia-estrategica', { waitUntil: 'networkidle' })
  if (!(await page.locator('body').innerText()).includes('IA Estratégica')) failures.push('Visor no cargó el curso de ejemplo')
  results.push('Alumno: visor del curso')
  if (process.env.REVIEW_SCREENSHOT) await page.screenshot({ path: process.env.REVIEW_SCREENSHOT, fullPage: true })
  if (external.length) failures.push('La revisión intentó contactar un backend real: ' + external.join(', '))
  console.log(JSON.stringify({ viewport: '390x844', results, realBackendRequests: external.length, failures }, null, 2))
  await browser.close()
  if (failures.length) process.exitCode = 1
})().catch(error => { console.error(error); process.exitCode = 1 }).finally(async () => { await browser?.close(); server?.kill() })
