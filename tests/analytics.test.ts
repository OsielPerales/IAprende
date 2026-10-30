import { beforeEach, expect, it, vi } from 'vitest'
const fake = vi.hoisted(() => ({ collection: vi.fn(), message: vi.fn() }))
vi.mock('../functions/src/firebaseAdmin.js', () => ({ db: { collection: fake.collection } }))
vi.mock('../functions/src/ai/anthropicClient.js', () => ({ getAnthropic: () => ({ messages: { create: fake.message } }) }))
import { queryClassData } from '../functions/src/ai/analyticsQuery.js'
import { evaluatePrompt, executePrompt } from '../functions/src/ai/promptSimulator.js'
const snapshot = (items: any[]) => ({ docs: items.map((data, n) => ({ id: data.id ?? String(n), data: () => data })), empty: !items.length })
beforeEach(() => { vi.clearAllMocks(); fake.message.mockResolvedValue({ content: [{ type: 'text', text: 'Respuesta' }] }) })
it('empty group roster returns a useful result without an invalid empty in query or AI charge', async () => {
  fake.collection.mockImplementation((name: string) => ({
    where: () => ({ get: async () => snapshot(name === 'grupos' ? [{ id: 'g', nombre: 'Grupo' }] : []) }),
  }))
  expect((await queryClassData('Promedio', 't')).answer).toContain('no tienen alumnos')
  expect(fake.message).not.toHaveBeenCalled()
})
it('class analysis includes all groups and students beyond the first ten', async () => {
  fake.collection.mockImplementation((name: string) => ({
    where: (_field: string, _op: string, values: any) => ({ get: async () => {
      if (name === 'grupos') return snapshot(Array.from({ length: 35 }, (_, n) => ({ id: `g${n}` })))
      if (name === 'grupo_alumnos') return snapshot(values.map((g: string) => ({ alumno_id: `a${g.slice(1)}` })))
      return snapshot(values.map((id: string) => ({ alumno_id: id, calificacion: 80 })))
    } }),
    doc: () => ({ get: async () => ({ exists: true, data: () => ({ nombre: 'Alumno', apellido: '' }) }) }),
  }))
  await queryClassData('Promedio', 't')
  const message = fake.message.mock.calls[0][0].messages[0].content
  expect(message).toContain('a34')
  expect(message).toContain('"totalEntregas": 35')
})
it('simulator validates model evaluation output rather than trusting the tool cast', async () => {
  fake.message.mockResolvedValueOnce({ content: [{ type: 'tool_use', input: { score: 6, feedback: 'Invalid' } }] })
  await expect(evaluatePrompt('Prompt', '')).rejects.toThrow('Invalid evaluation')
  fake.message.mockResolvedValueOnce({ content: [{ type: 'tool_use', input: { score: 4, feedback: 'Bien' } }] })
  expect(await evaluatePrompt('Prompt', '')).toEqual({ score: 4, feedback: 'Bien' })
})
it('simulator execution returns the response field required by the UI', async () => {
  expect(await executePrompt('Redacta')).toEqual({ response: 'Respuesta' })
})

import { runDailyDigest } from '../functions/src/scheduled/dailyDigest.js'
it('digest includes more than ten groups/students and creates a daily notification', async () => {
  const create = vi.fn().mockResolvedValue(undefined)
  fake.collection.mockImplementation((name: string) => ({
    where: (_field: string, _op: string, values: any) => ({ get: async () => {
      if (name === 'usuarios') return snapshot([{ id: 't', nombre: 'Instructor' }])
      if (name === 'grupos') return snapshot(Array.from({ length: 35 }, (_, n) => ({ id: `g${n}` })))
      if (name === 'grupo_alumnos') return snapshot(values.map((g: string) => ({ alumno_id: `a${g.slice(1)}` })))
      return snapshot(values.map((id: string) => ({ alumno_id: id, calificacion: null, enviado_at: new Date().toISOString() })))
    } }),
    doc: () => ({ get: async () => ({ exists: false }), create }),
  }))
  await runDailyDigest()
  expect(fake.message.mock.calls[0][0].messages[0].content).toContain('Evaluaciones pendientes de calificar: 35')
  expect(create).toHaveBeenCalledWith(expect.objectContaining({ destinatario_id: 't', leida: false }))
})
it('digest retry leaves an existing notification and its read state unchanged', async () => {
  const create = vi.fn()
  fake.collection.mockImplementation((name: string) => ({
    where: () => ({ get: async () => snapshot(name === 'usuarios' ? [{ id: 't', nombre: 'Instructor' }]
      : name === 'grupos' ? [{ id: 'g' }]
      : name === 'grupo_alumnos' ? [{ alumno_id: 'a' }]
      : [{ alumno_id: 'a', calificacion: null, enviado_at: new Date().toISOString() }]) }),
    doc: () => ({ get: async () => ({ exists: true }), create }),
  }))
  await runDailyDigest()
  expect(fake.message).not.toHaveBeenCalled()
  expect(create).not.toHaveBeenCalled()
})
