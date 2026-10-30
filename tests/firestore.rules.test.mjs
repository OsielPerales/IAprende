import { readFile } from 'node:fs/promises'
import { after, before, beforeEach, test } from 'node:test'
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { doc, setDoc, updateDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore'
if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Use npm run test:rules; production is never a test target.')
let env
const profile = (id, rol = 'alumno') => ({ id, rol, email: `${id}@example.test`, nombre: id, apellido: '', created_at: '2026-10-30' })
const user = uid => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'password' } }).firestore()
before(async () => { env = await initializeTestEnvironment({ projectId: 'demo-iaprende', firestore: { rules: await readFile('firestore.rules', 'utf8') } }) })
after(async () => { await env?.cleanup() })
beforeEach(async () => {
  await env.clearFirestore()
  await env.withSecurityRulesDisabled(async ctx => {
    for (const [id, role] of [['a', 'alumno'], ['b', 'alumno'], ['t', 'maestro'], ['admin', 'admin']]) await setDoc(doc(ctx.firestore(), 'usuarios', id), profile(id, role))
    await setDoc(doc(ctx.firestore(), 'notificaciones', 'n'), { destinatario_id: 'a', leida: false, cuerpo: 'Privado' })
    await setDoc(doc(ctx.firestore(), 'respuestas', 'r'), { alumno_id: 'a', calificacion: null, respuestas: {}, bloque_id: 'b', enviado_at: '2026-10-30' })
    await setDoc(doc(ctx.firestore(), 'alumno_analytics', 'a'), { summary: 'Privado' })
  })
})
test('registration cannot create admin or teacher, normal pupil succeeds', async () => {
  const db = user('new')
  await assertFails(setDoc(doc(db, 'usuarios', 'new'), profile('new', 'admin')))
  await assertFails(setDoc(doc(db, 'usuarios', 'new'), profile('new', 'maestro')))
  await assertSucceeds(setDoc(doc(db, 'usuarios', 'new'), profile('new')))
})
test('self profile edit preserves role, ID and email; admin may promote', async () => {
  const db = user('a')
  await assertSucceeds(updateDoc(doc(db, 'usuarios', 'a'), { nombre: 'Ana' }))
  for (const change of [{ rol: 'admin' }, { rol: 'maestro' }, { id: 'b' }, { email: 'other@test' }]) await assertFails(updateDoc(doc(db, 'usuarios', 'a'), change))
  await assertSucceeds(updateDoc(doc(user('admin'), 'usuarios', 'a'), { rol: 'maestro' }))
})
test('pupil queries work only for personal grades and requests', async () => {
  const db = user('a')
  await assertFails(getDocs(collection(db, 'respuestas')))
  await assertSucceeds(getDocs(query(collection(db, 'respuestas'), where('alumno_id', '==', 'a'))))
  await assertFails(getDoc(doc(user('b'), 'respuestas', 'r')))
  await assertSucceeds(getDoc(doc(user('t'), 'respuestas', 'r')))
  await assertFails(getDocs(collection(db, 'solicitudes_inscripcion')))
  await assertSucceeds(getDocs(query(collection(db, 'solicitudes_inscripcion'), where('alumno_id', '==', 'a'))))
})
test('notification read marking changes only leida and preserves body', async () => {
  await assertSucceeds(updateDoc(doc(user('a'), 'notificaciones', 'n'), { leida: true }))
  await assertFails(updateDoc(doc(user('a'), 'notificaciones', 'n'), { cuerpo: 'changed' }))
  await assertFails(updateDoc(doc(user('b'), 'notificaciones', 'n'), { leida: true }))
  await assertSucceeds(getDocs(query(collection(user('a'), 'notificaciones'), where('destinatario_id', '==', 'a'))))
})
test('analytics and AI quotas cannot be written from the client', async () => {
  await assertSucceeds(getDoc(doc(user('a'), 'alumno_analytics', 'a')))
  await assertFails(getDoc(doc(user('b'), 'alumno_analytics', 'a')))
  await assertSucceeds(getDoc(doc(user('b'), 'alumno_analytics', 'b'))) // absent personal document is readable
  await assertFails(setDoc(doc(user('admin'), 'alumno_analytics', 'a'), { summary: 'forged' }))
  await assertFails(setDoc(doc(user('a'), 'ai_usage', 'a'), { dayCount: 0 }))
})
test('pupil cannot self-grade or impersonate another author', async () => {
  const db = user('a'), base = { alumno_id: 'a', bloque_id: 'b', respuestas: {}, calificacion: null, enviado_at: '2026' }
  await assertSucceeds(setDoc(doc(db, 'respuestas', 'new'), base))
  await assertFails(setDoc(doc(db, 'respuestas', 'forged'), { ...base, calificacion: 100 }))
  await assertFails(setDoc(doc(db, 'respuestas', 'forged'), { ...base, alumno_id: 'b' }))
  await assertFails(updateDoc(doc(db, 'respuestas', 'r'), { calificacion: 100 }))
  await assertSucceeds(updateDoc(doc(user('t'), 'respuestas', 'r'), { calificacion: 80, feedback_maestro: 'Bien' }))
  await assertFails(updateDoc(doc(user('t'), 'respuestas', 'r'), { calificacion: 101 }))
})
test('progress ownership and course are immutable', async () => {
  const ref = doc(user('a'), 'progreso_alumno', 'a_c')
  await assertSucceeds(getDoc(ref)) // first visit must load a missing progress document
  await assertSucceeds(setDoc(ref, { userId: 'a', cursoId: 'c', bloques_completados: [] }))
  await assertSucceeds(updateDoc(ref, { bloques_completados: ['b'] }))
  await assertFails(updateDoc(ref, { userId: 'b' }))
  await assertFails(updateDoc(ref, { cursoId: 'other' }))
})
test('ethical responses preserve authorship across updates', async () => {
  const ref = doc(user('a'), 'caso_etico_respuestas', 'block_a')
  await assertSucceeds(setDoc(ref, { userId: 'a', bloque_id: 'block', respuestas: ['Respuesta'], created_at: '2026' }))
  await assertSucceeds(updateDoc(ref, { respuestas: ['Actualizada'] }))
  await assertFails(updateDoc(doc(user('b'), 'caso_etico_respuestas', 'block_a'), { respuestas: ['Falsa'] }))
  await assertFails(updateDoc(ref, { userId: 'b' }))
})
test('enrollment requires pending state; only staff decides; no reassignment', async () => {
  const ref = doc(user('a'), 'solicitudes_inscripcion', 'g_a')
  const base = { grupo_id: 'g', alumno_id: 'a', estado: 'pendiente', updated_at: '2026' }
  await assertFails(setDoc(ref, { ...base, estado: 'aprobada' }))
  await assertSucceeds(setDoc(ref, base))
  await assertFails(updateDoc(ref, { estado: 'aprobada' }))
  await assertFails(updateDoc(doc(user('t'), 'solicitudes_inscripcion', 'g_a'), { estado: 'aprobada', alumno_id: 'b' }))
  await assertSucceeds(updateDoc(doc(user('t'), 'solicitudes_inscripcion', 'g_a'), { estado: 'rechazada' }))
  await assertSucceeds(updateDoc(ref, { estado: 'pendiente', mensaje: 'Otra vez' }))
})
test('anonymous and signed-out clients cannot read data', async () => {
  await assertFails(getDocs(collection(env.unauthenticatedContext().firestore(), 'cursos')))
  const db = env.authenticatedContext('anon', { firebase: { sign_in_provider: 'anonymous' } }).firestore()
  await assertFails(getDocs(collection(db, 'cursos')))
})
