import { beforeEach, describe, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({
  verifyIdToken: vi.fn(), profile: vi.fn(), runTransaction: vi.fn(),
  autoGrade: vi.fn(), course: vi.fn(), query: vi.fn(), gaps: vi.fn(), path: vi.fn(), translate: vi.fn(), evaluate: vi.fn(), execute: vi.fn(),
  createMcp: vi.fn(),
}))
vi.mock('../functions/src/firebaseAdmin.js', () => ({ auth: { verifyIdToken: mocks.verifyIdToken }, db: {
  collection: () => ({ doc: () => ({ get: mocks.profile }) }), runTransaction: mocks.runTransaction,
} }))
vi.mock('firebase-functions/v2/https', () => ({ onRequest: (_opts: unknown, work: unknown) => work }))
vi.mock('firebase-functions/v2/scheduler', () => ({ onSchedule: (_opts: unknown, work: unknown) => work }))
vi.mock('../functions/src/ai/autoGrade.js', () => ({ autoGradeRespuesta: mocks.autoGrade }))
vi.mock('../functions/src/ai/courseGenerator.js', () => ({ generateCourseFromTopic: mocks.course }))
vi.mock('../functions/src/ai/analyticsQuery.js', () => ({ queryClassData: mocks.query }))
vi.mock('../functions/src/ai/knowledgeGaps.js', () => ({ detectKnowledgeGaps: mocks.gaps }))
vi.mock('../functions/src/ai/learningPath.js', () => ({ getPersonalizedLearningPath: mocks.path }))
vi.mock('../functions/src/ai/contentTranslation.js', () => ({ translateBlock: mocks.translate }))
vi.mock('../functions/src/ai/promptSimulator.js', () => ({ evaluatePrompt: mocks.evaluate, executePrompt: mocks.execute }))
vi.mock('../functions/src/mcp/server.js', () => ({ createMcpServer: mocks.createMcp }))
import * as api from '../functions/src/index.js'
import { protectedPost, nextQuota, HttpError } from '../functions/src/security/http.js'

async function call(handler: any, body: unknown = {}, token?: string, method = 'POST') {
  const res: any = { statusCode: 200, headers: {}, set(k: string, v: string) { this.headers[k] = v; return this },
    status(n: number) { this.statusCode = n; return this }, json(value: unknown) { this.body = value; this.headersSent = true }, send(value: unknown) { this.body = value } }
  await handler({ method, body, headers: token ? { authorization: `Bearer ${token}` } : {} }, res)
  return res
}
const validBodies: Record<string, unknown> = {
  aiProxy: { messages: [{ role: 'user', content: 'Ejercicio' }] }, autoGradeRespuestaFn: { respuestaId: 'r' },
  generateCourseFromTopicFn: { topic: 'Curso', industryContext: 'Taller' }, queryClassDataFn: { query: 'Promedio' },
  detectKnowledgeGapsFn: { alumnoId: 'u' }, getPersonalizedLearningPathFn: { alumnoId: 'u', cursoId: 'c', recentScore: 80, courseTitle: 'Curso', quizTitle: 'Quiz' },
  translateBlockFn: { bloqueId: 'b' }, evaluatePromptFn: { prompt: 'Evalúa' }, executePromptFn: { prompt: 'Redacta' }, mcpServer: { jsonrpc: '2.0', method: 'tools/list', id: 1 },
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.verifyIdToken.mockResolvedValue({ uid: 'u', firebase: { sign_in_provider: 'password' } })
  mocks.profile.mockResolvedValue({ exists: true, data: () => ({ rol: 'alumno' }) })
  mocks.runTransaction.mockResolvedValue(undefined)
  mocks.gaps.mockResolvedValue({ summary: 'OK' })
  mocks.evaluate.mockResolvedValue({ score: 4, feedback: 'OK' })
  mocks.execute.mockResolvedValue({ response: 'OK' })
})
describe('HTTP identity boundary', () => {
  for (const [name, body] of Object.entries(validBodies)) {
    it(`${name} rejects missing credentials before tools/providers`, async () => {
      expect((await call((api as any)[name], body)).statusCode).toBe(401)
      expect(mocks.runTransaction).not.toHaveBeenCalled()
      expect(mocks.createMcp).not.toHaveBeenCalled()
    })
  }
  it('rejects invalid, revoked and anonymous tokens', async () => {
    mocks.verifyIdToken.mockRejectedValueOnce(new Error('expired'))
    expect((await call(api.executePromptFn, { prompt: 'Hola' }, 'bad')).statusCode).toBe(401)
    mocks.verifyIdToken.mockResolvedValueOnce({ uid: 'u', firebase: { sign_in_provider: 'anonymous' } })
    expect((await call(api.executePromptFn, { prompt: 'Hola' }, 'anon')).statusCode).toBe(403)
    expect(mocks.verifyIdToken).toHaveBeenCalledWith('bad', true)
  })
  it('rejects missing profile and unknown roles', async () => {
    mocks.profile.mockResolvedValueOnce({ exists: false, data: () => undefined })
    expect((await call(api.executePromptFn, { prompt: 'Hola' }, 'ok')).statusCode).toBe(403)
    mocks.profile.mockResolvedValueOnce({ exists: true, data: () => ({ rol: 'owner' }) })
    expect((await call(api.executePromptFn, { prompt: 'Hola' }, 'ok')).statusCode).toBe(403)
  })
  it('blocks pupil grading, course generation and platform MCP', async () => {
    for (const name of ['autoGradeRespuestaFn', 'generateCourseFromTopicFn', 'queryClassDataFn', 'mcpServer']) {
      expect((await call((api as any)[name], validBodies[name], 'ok')).statusCode).toBe(403)
    }
    expect(mocks.autoGrade).not.toHaveBeenCalled()
    expect(mocks.createMcp).not.toHaveBeenCalled()
  })
  it('blocks pupil analytics for another pupil', async () => {
    expect((await call(api.detectKnowledgeGapsFn, { alumnoId: 'other' }, 'ok')).statusCode).toBe(403)
    expect(mocks.gaps).not.toHaveBeenCalled()
  })
  it('accepts personal analytics and consumes server quota', async () => {
    const res = await call(api.detectKnowledgeGapsFn, { alumnoId: 'u' }, 'ok')
    expect(res.statusCode).toBe(200)
    expect(mocks.gaps).toHaveBeenCalledWith('u')
    expect(mocks.runTransaction).toHaveBeenCalledOnce()
  })
  it('derives instructor identity, rejects impersonation', async () => {
    mocks.profile.mockResolvedValue({ exists: true, data: () => ({ rol: 'maestro' }) })
    expect((await call(api.queryClassDataFn, { query: 'Promedio', maestroId: 'other' }, 'ok')).statusCode).toBe(403)
    await call(api.queryClassDataFn, { query: 'Promedio' }, 'ok')
    expect(mocks.query).toHaveBeenCalledWith('Promedio', 'u')
  })
  it('requires POST, allows preflight with Authorization', async () => {
    expect((await call(api.executePromptFn, {}, undefined, 'GET')).statusCode).toBe(405)
    const res = await call(api.executePromptFn, {}, undefined, 'OPTIONS')
    expect(res.statusCode).toBe(204)
    expect(res.headers['Access-Control-Allow-Headers']).toContain('Authorization')
  })
  it('rejects oversized body and invalid IDs, scores, messages and token budget', async () => {
    for (const [handler, body, code] of [
      [api.executePromptFn, { prompt: 'x'.repeat(66000) }, 413],
      [api.translateBlockFn, { bloqueId: '../b' }, 400],
      [api.getPersonalizedLearningPathFn, { ...(validBodies.getPersonalizedLearningPathFn as object), recentScore: 101 }, 400],
      [api.aiProxy, { messages: [{ role: 'tool', content: 'bad' }] }, 400],
      [api.aiProxy, { ...(validBodies.aiProxy as object), max_tokens: 1000000 }, 400],
      [api.evaluatePromptFn, { prompt: '' }, 400],
    ] as const) expect((await call(handler, body, 'ok')).statusCode).toBe(code)
    expect(mocks.runTransaction).not.toHaveBeenCalled()
  })
  it('returns safe errors and stops when quota is exceeded', async () => {
    mocks.runTransaction.mockRejectedValueOnce(new HttpError(429, 'Límite'))
    const res = await call(api.executePromptFn, { prompt: 'Hola' }, 'ok')
    expect(res.statusCode).toBe(429)
    expect(mocks.execute).not.toHaveBeenCalled()
    const work = protectedPost(async () => { throw new Error('secret-sensitive-token') }, {
      authenticate: async () => ({ uid: 'u', role: 'alumno' }), consumeQuota: async () => {},
    })
    expect((await call(work, {})).body.error).not.toContain('secret-sensitive-token')
  })
  it('implements both simulator endpoint contracts', async () => {
    expect((await call(api.evaluatePromptFn, { prompt: 'Evalúa' }, 'ok')).body).toEqual({ score: 4, feedback: 'OK' })
    expect((await call(api.executePromptFn, { prompt: 'Redacta' }, 'ok')).body).toEqual({ response: 'OK' })
  })
})
it('quotas enforce minute/day caps and reset at correct boundaries', () => {
  const now = Date.UTC(2026, 9, 30, 10, 0)
  const first = nextQuota(undefined, now)
  expect(first.minuteCount).toBe(1)
  expect(() => nextQuota({ ...first, minuteCount: 20 }, now)).toThrow(HttpError)
  expect(() => nextQuota({ ...first, dayCount: 200 }, now + 60000)).toThrow(HttpError)
  expect(nextQuota({ ...first, minuteCount: 20 }, now + 60000).minuteCount).toBe(1)
  expect(nextQuota({ ...first, dayCount: 200 }, now + 86400000).dayCount).toBe(1)
})
