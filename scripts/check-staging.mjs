/** Credential-free checks: never calls the paid model or writes student data. */
const base = process.env.VITE_AI_CLAUDE_URL
if (!base?.startsWith('https://') || !/dev|staging|test/.test(base)) throw new Error('Define VITE_AI_CLAUDE_URL del proyecto DEV explícitamente.')
for (const name of ['aiProxy', 'autoGradeRespuestaFn', 'generateCourseFromTopicFn', 'queryClassDataFn', 'detectKnowledgeGapsFn', 'getPersonalizedLearningPathFn', 'translateBlockFn', 'evaluatePromptFn', 'executePromptFn', 'mcpServer']) {
  const response = await fetch(base.replace(/\/$/, '') + '/' + name, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
  if (response.status !== 401) throw new Error(`${name}: se esperaba 401 sin sesión, recibido ${response.status}`)
  console.log(`${name}: rechaza solicitudes sin sesión`)
}
