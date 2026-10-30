import { beforeEach, expect, it, vi } from 'vitest'
const fake = vi.hoisted(() => ({ auth: { currentUser: null as any }, listeners: [] as any[], stopped: vi.fn() }))
vi.mock('../src/lib/firebase', () => ({ auth: fake.auth, db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: (_db: unknown, name: string) => ({ kind: 'collection', name }),
  doc: (_db: unknown, name: string, id: string) => ({ kind: 'document', name, id }),
  where: (field: string, op: string, value: string) => ({ field, op, value }),
  query: (source: any, filter: any) => ({ ...source, filter }),
  onSnapshot: (source: any, receive: any) => { fake.listeners.push({ source, receive }); return fake.stopped },
  setDoc: vi.fn(), updateDoc: vi.fn(), deleteDoc: vi.fn(), addDoc: vi.fn(), writeBatch: vi.fn(), getDoc: vi.fn(),
}))
import { useStore } from '../src/store/useStore'
import { authenticatedFetch } from '../src/lib/http'
beforeEach(() => { vi.clearAllMocks(); fake.listeners.length = 0; fake.auth.currentUser = null; vi.unstubAllGlobals() })
it('pupil listeners query personal data, read personal analytics doc and clear cache on logout', () => {
  const stop = useStore.getState().initStoreListeners({ id: 'a', rol: 'alumno' })
  for (const name of ['respuestas', 'solicitudes_inscripcion']) {
    expect(fake.listeners.find(l => l.source.name === name).source.filter).toEqual({ field: 'alumno_id', op: '==', value: 'a' })
  }
  expect(fake.listeners.find(l => l.source.name === 'notificaciones').source.filter.value).toBe('a')
  expect(fake.listeners.find(l => l.source.name === 'alumno_analytics').source).toEqual({ kind: 'document', name: 'alumno_analytics', id: 'a' })
  fake.listeners.find(l => l.source.name === 'respuestas').receive({ docs: [{ id: 'r', data: () => ({ alumno_id: 'a' }) }] })
  expect(useStore.getState().respuestas).toHaveLength(1)
  stop()
  expect(fake.stopped).toHaveBeenCalledTimes(fake.listeners.length)
  expect(useStore.getState().respuestas).toEqual([])
  expect(useStore.getState().usuarios).toEqual([])
})
it('staff keeps institution grade queries, while notifications remain personal', () => {
  const stop = useStore.getState().initStoreListeners({ id: 't', rol: 'maestro' })
  expect(fake.listeners.find(l => l.source.name === 'respuestas').source.filter).toBeUndefined()
  expect(fake.listeners.find(l => l.source.name === 'notificaciones').source.filter.value).toBe('t')
  stop()
})
it('client sends Firebase bearer token and preserves other headers', async () => {
  fake.auth.currentUser = { getIdToken: vi.fn().mockResolvedValue('firebase-test-token') }
  const transport = vi.fn().mockResolvedValue(new Response('{}'))
  vi.stubGlobal('fetch', transport)
  await authenticatedFetch('https://example.test/function', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
  const options = transport.mock.calls[0][1]
  expect(options.headers.get('Authorization')).toBe('Bearer firebase-test-token')
  expect(options.headers.get('Content-Type')).toBe('application/json')
})
it('client refuses unsigned requests and reports server failures without demo fallback', async () => {
  const transport = vi.fn().mockResolvedValue(new Response('{"error":"Límite de uso"}', { status: 429 }))
  vi.stubGlobal('fetch', transport)
  await expect(authenticatedFetch('/function')).rejects.toThrow('Inicia sesión')
  expect(transport).not.toHaveBeenCalled()
  fake.auth.currentUser = { getIdToken: async () => 'token' }
  await expect(authenticatedFetch('/function')).rejects.toThrow('Límite de uso')
})
