import { auth, db } from '../firebaseAdmin.js'

export type Role = 'alumno' | 'maestro' | 'admin'
export interface Identity { uid: string; role: Role }
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

export async function authenticate(req: any): Promise<Identity> {
  const header = req.get?.('Authorization') ?? req.headers?.authorization
  if (typeof header !== 'string' || !/^Bearer \S+$/.test(header)) throw new HttpError(401, 'Inicia sesión para continuar.')
  let token
  try { token = await auth.verifyIdToken(header.slice(7), true) }
  catch { throw new HttpError(401, 'Sesión inválida o caducada.') }
  if (token.firebase?.sign_in_provider === 'anonymous') throw new HttpError(403, 'Se requiere una cuenta registrada.')
  const profile = await db.collection('usuarios').doc(token.uid).get()
  const role = profile.data()?.rol
  if (!profile.exists || !['alumno', 'maestro', 'admin'].includes(role)) throw new HttpError(403, 'Perfil sin permisos.')
  return { uid: token.uid, role }
}

export function requireStaff(identity: Identity) {
  if (identity.role === 'alumno') throw new HttpError(403, 'Se requiere maestro o administrador.')
}
export function requireAdmin(identity: Identity) {
  if (identity.role !== 'admin') throw new HttpError(403, 'Se requiere administrador.')
}
export function requireSelfOrStaff(identity: Identity, uid: string) {
  if (identity.uid !== uid) requireStaff(identity)
}
export function instructorId(identity: Identity, requested?: unknown): string {
  requireStaff(identity)
  if (requested !== undefined) documentId({ maestroId: requested }, 'maestroId')
  if (requested && requested !== identity.uid && identity.role !== 'admin') throw new HttpError(403, 'No puedes actuar como otro instructor.')
  return requested as string || identity.uid
}

// One persistent quota shared by all HTTP AI endpoints and MCP, across instances.
export function nextQuota(previous: any, now: number) {
  const minute = Math.floor(now / 60_000)
  const day = new Date(now).toISOString().slice(0, 10)
  const minuteCount = previous?.minute === minute ? previous.minuteCount : 0
  const dayCount = previous?.day === day ? previous.dayCount : 0
  if (minuteCount >= 20 || dayCount >= 200) throw new HttpError(429, 'Límite de uso alcanzado. Intenta más tarde.')
  return { minute, day, minuteCount: minuteCount + 1, dayCount: dayCount + 1 }
}
export async function consumeQuota(identity: Identity) {
  const ref = db.collection('ai_usage').doc(identity.uid)
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref)
    tx.set(ref, nextQuota(snap.data(), Date.now()))
  })
}

export function text(body: Record<string, unknown>, key: string, max = 4000, optional = false): string {
  const value = body[key]
  if (optional && value === undefined) return ''
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new HttpError(400, `${key} inválido.`)
  return value
}
export function documentId(body: Record<string, unknown>, key: string) {
  const value = text(body, key, 200)
  if (value.includes('/') || value === '.' || value === '..') throw new HttpError(400, `${key} inválido.`)
  return value
}
export function number(body: Record<string, unknown>, key: string, min: number, max: number, fallback?: number) {
  const value = body[key] ?? fallback
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new HttpError(400, `${key} inválido.`)
  return value
}

interface Dependencies {
  authenticate: typeof authenticate
  consumeQuota: typeof consumeQuota
}
// Validation/authorization happens inside work, before calling the quota callback.
export function protectedPost(
  work: (body: Record<string, unknown>, identity: Identity, spend: () => Promise<void>) => Promise<unknown>,
  deps: Dependencies = { authenticate, consumeQuota },
) {
  return async (req: any, res: any): Promise<void> => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.set('Cache-Control', 'no-store')
    if (req.method === 'OPTIONS') { res.status(204).send(''); return }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Usa POST.' }); return }
    try {
      const identity = await deps.authenticate(req)
      if (req.rawBody?.length > 65536 || Buffer.byteLength(JSON.stringify(req.body) ?? '') > 65536) throw new HttpError(413, 'Solicitud demasiado grande.')
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) throw new HttpError(400, 'Se requiere un objeto JSON.')
      res.json(await work(req.body, identity, () => deps.consumeQuota(identity)))
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 429) res.set('Retry-After', '60')
        res.status(err.status).json({ error: err.message })
      } else {
        // Do not expose provider errors, student input, tokens, or internal IDs.
        console.error('[iaprende-http] operation failed')
        res.status(500).json({ error: 'No se pudo completar la operación.' })
      }
    }
  }
}
