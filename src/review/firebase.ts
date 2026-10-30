/** Local-only adapter for visual review builds. Never an authentication/Rules emulator. */
import { cursoIA, bloquesIA } from '../store/seedCursoIA'
import type { UserRole } from '../types'

type Data = Record<string, any>
type Ref = { path: string; filters?: { field: string; op: string; value: any }[] }
const KEY = 'iaprende-visual-review-v1'
const SESSION = 'iaprende-visual-review-user'
const roles: UserRole[] = ['alumno', 'maestro', 'admin']
export const reviewUsers = roles.map(rol => ({
  id: `demo-${rol}-001`, email: `${rol}@revision.example`, nombre: rol === 'alumno' ? 'Alumno' : rol === 'maestro' ? 'Instructor' : 'Administrador',
  apellido: 'de ejemplo', rol, created_at: '2026-10-30T12:00:00Z',
}))
function initial(): Data {
  const documents: Data = {}
  for (const user of reviewUsers) documents[`usuarios/${user.id}`] = user
  documents[`cursos/${cursoIA.id}`] = cursoIA
  for (const block of bloquesIA) documents[`bloques/${block.id}`] = block
  documents['grupos/grupo-ejemplo'] = { nombre: 'Grupo de revisión', descripcion: 'Datos de ejemplo para revisar desde el celular', maestro_id: 'demo-maestro-001', created_at: '2026-10-30T12:00:00Z' }
  documents['grupo_alumnos/grupo-ejemplo_demo-alumno-001'] = { grupo_id: 'grupo-ejemplo', alumno_id: 'demo-alumno-001', fecha_ingreso: '2026-10-30T12:00:00Z' }
  documents[`curso_grupos/${cursoIA.id}_grupo-ejemplo`] = { curso_id: cursoIA.id, grupo_id: 'grupo-ejemplo', fecha_asignacion: '2026-10-30T12:00:00Z' }
  const quiz = bloquesIA.find(b => b.tipo === 'cuestionario')
  if (quiz) documents['respuestas/entrega-ejemplo'] = { alumno_id: 'demo-alumno-001', bloque_id: quiz.id, respuestas: {}, calificacion: null, enviado_at: '2026-10-30T12:00:00Z' }
  documents['notificaciones/notificacion-ejemplo'] = { destinatario_id: 'demo-maestro-001', titulo: 'Revisión visual disponible', cuerpo: 'Puedes revisar cursos, grupos y entregas con datos de ejemplo.', tipo: 'ejemplo', leida: false, created_at: '2026-10-30T12:00:00Z' }
  return documents
}
function read(): Data {
  try { const value = localStorage.getItem(KEY); if (value) return JSON.parse(value) }
  catch { /* Storage may be unavailable in private browsing. */ }
  return initial()
}
let documents: Data = read()
function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) }
const subscriptions = new Set<() => void>()
const authSubscriptions = new Set<(user: any) => void>()
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(documents)) } catch { /* in-memory review still works */ }
  subscriptions.forEach(receive => receive())
}
const authInstance: { currentUser: any } = { currentUser: null }
function firebaseUser(profile: any) {
  return { uid: profile.id, email: profile.email, displayName: `${profile.nombre} ${profile.apellido}`, getIdToken: async () => { throw new Error('La revisión visual no realiza llamadas reales de IA.') } }
}
try { const uid = sessionStorage.getItem(SESSION); if (uid && documents[`usuarios/${uid}`]) authInstance.currentUser = firebaseUser(documents[`usuarios/${uid}`]) } catch { /* no persistent session */ }
function changeUser(profile: any | null) {
  authInstance.currentUser = profile ? firebaseUser(profile) : null
  try { if (profile) sessionStorage.setItem(SESSION, profile.id); else sessionStorage.removeItem(SESSION) } catch { /* optional */ }
  authSubscriptions.forEach(receive => receive(authInstance.currentUser))
}
export function enterReviewRole(role: UserRole) {
  const profile = reviewUsers.find(u => u.rol === role)
  if (!profile) throw new Error('Rol de revisión inválido')
  changeUser(documents[`usuarios/${profile.id}`] ?? profile)
}
export function resetReview() { documents = initial(); save(); changeUser(null) }
export function initializeApp(_config?: unknown) { return { name: 'VISUAL_REVIEW_ONLY' } }
export function getAuth(_app?: unknown) { return authInstance }
export function getFirestore(_app?: unknown) { return { name: 'VISUAL_REVIEW_ONLY' } }
export function onAuthStateChanged(_auth: unknown, receive: (user: any) => void) {
  authSubscriptions.add(receive); queueMicrotask(() => { if (authSubscriptions.has(receive)) receive(authInstance.currentUser) })
  return () => { authSubscriptions.delete(receive) }
}
export async function signInWithEmailAndPassword(_auth: unknown, email: string, _password: string) {
  const profile = Object.entries(documents).find(([key, value]) => key.startsWith('usuarios/') && value.email === email)?.[1]
  if (!profile) throw new Error('Usa los botones de alumno, maestro o administrador de ejemplo.')
  changeUser(profile); return { user: authInstance.currentUser }
}
export async function createUserWithEmailAndPassword(_auth: unknown, email: string, _password: string) {
  const uid = `review-${crypto.randomUUID()}`
  const user = { id: uid, email, nombre: 'Usuario', apellido: 'de ejemplo', rol: 'alumno', created_at: new Date().toISOString() }
  documents[`usuarios/${uid}`] = user; save(); changeUser(user)
  return { user: authInstance.currentUser }
}
export async function signOut(_auth: unknown) { changeUser(null) }
export class GoogleAuthProvider {}
export async function signInWithPopup() { throw new Error('Google se verifica en el entorno Firebase DEV. Aquí usa una cuenta de ejemplo.') }
export function connectAuthEmulator() { throw new Error('Este adaptador es solo para revisión visual.') }
export function connectFirestoreEmulator() { throw new Error('Este adaptador es solo para revisión visual.') }
export function collection(_db: unknown, path: string): Ref { return { path } }
export function doc(_db: unknown, ...path: string[]): Ref { return { path: path.join('/') } }
export function where(field: string, op: string, value: unknown) { return { field, op, value } }
export function query(ref: Ref, ...filters: any[]): Ref { return { ...ref, filters } }
function snapshot(ref: Ref) {
  if (ref.path.split('/').length % 2 === 0) {
    const value = documents[ref.path]
    return { id: ref.path.split('/').at(-1), exists: () => value !== undefined, data: () => value === undefined ? undefined : clone(value) }
  }
  const found = Object.entries(documents).filter(([key, value]) => key.startsWith(ref.path + '/') && key.split('/').length === ref.path.split('/').length + 1 &&
    (ref.filters ?? []).every(f => f.op === '==' ? value[f.field] === f.value : f.op === 'in' ? f.value.includes(value[f.field]) : false))
  const docs = found.map(([path, value]) => ({ id: path.split('/').at(-1), data: () => clone(value) }))
  return { docs, size: docs.length, empty: docs.length === 0 }
}
export function onSnapshot(ref: Ref, receive: (snapshot: any) => void) {
  const deliver = () => receive(snapshot(ref))
  subscriptions.add(deliver); queueMicrotask(() => { if (subscriptions.has(deliver)) deliver() })
  return () => { subscriptions.delete(deliver) }
}
export async function getDoc(ref: Ref): Promise<any> { return snapshot(ref) }
export async function getDocs(ref: Ref): Promise<any> { return snapshot(ref) }
export async function setDoc(ref: Ref, value: Data, options?: { merge?: boolean }) { documents[ref.path] = clone(options?.merge ? { ...documents[ref.path], ...value } : value); save() }
export async function updateDoc(ref: Ref, value: Data) {
  if (!documents[ref.path]) throw new Error('Registro de ejemplo no encontrado')
  documents[ref.path] = { ...documents[ref.path], ...clone(value) }; save()
}
export async function deleteDoc(ref: Ref) { delete documents[ref.path]; save() }
export async function addDoc(ref: Ref, value: Data) { const id = crypto.randomUUID(); await setDoc({ path: `${ref.path}/${id}` }, value); return { id } }
export function writeBatch(_db: unknown) {
  const updates: (() => void)[] = []
  const batch = {
    set(ref: Ref, value: Data) { updates.push(() => { documents[ref.path] = clone(value) }); return batch },
    update(ref: Ref, value: Data) { updates.push(() => { documents[ref.path] = { ...documents[ref.path], ...clone(value) } }); return batch },
    delete(ref: Ref) { updates.push(() => { delete documents[ref.path] }); return batch },
    async commit() { updates.forEach(write => write()); save() },
  }
  return batch
}
export async function runTransaction(_db: unknown, work: (tx: any) => Promise<any>) {
  const batch = writeBatch(_db)
  const result = await work({ ...batch, get: getDoc })
  await batch.commit(); return result
}
