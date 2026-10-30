/**
 * MCP Resources — iAprende
 * URI-addressable read-only data snapshots
 */
import { db } from '../../firebaseAdmin.js'
import type { Resource } from '@modelcontextprotocol/sdk/types.js'

export const PLATFORM_RESOURCES: Resource[] = [
  {
    uri: 'iaprende://platform/stats',
    name: 'Platform Statistics',
    description: 'Live platform-wide statistics: user counts, courses, groups, responses',
    mimeType: 'application/json',
  },
  {
    uri: 'iaprende://respuestas/pending',
    name: 'Pending Grades',
    description: 'All ungraded student submissions across the platform',
    mimeType: 'application/json',
  },
]

export async function readResource(uri: string): Promise<string> {
  const url = new URL(uri)

  if (uri === 'iaprende://platform/stats') {
    const [u, c, g, r] = await Promise.all([
      db.collection('usuarios').count().get(),
      db.collection('cursos').count().get(),
      db.collection('grupos').count().get(),
      db.collection('respuestas').count().get(),
    ])
    return JSON.stringify({
      usuarios: u.data().count,
      cursos: c.data().count,
      grupos: g.data().count,
      respuestas: r.data().count,
      timestamp: new Date().toISOString(),
    }, null, 2)
  }

  if (uri === 'iaprende://respuestas/pending') {
    const snap = await db.collection('respuestas').where('calificacion', '==', null).get()
    const pending = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
    return JSON.stringify(pending.map(r => ({
      id: r.id,
      alumno_id: r.alumno_id,
      bloque_id: r.bloque_id,
      enviado_at: r.enviado_at,
    })), null, 2)
  }

  // Dynamic resources: iaprende://curso/{id}, iaprende://grupo/{id}/performance, iaprende://alumno/{id}/profile
  if (url.host === 'curso') {
    const cursoId = url.pathname.replace(/^\//, '')
    const [cursoSnap, bloquesSnap] = await Promise.all([
      db.collection('cursos').doc(cursoId).get(),
      db.collection('bloques').where('curso_id', '==', cursoId).orderBy('orden').get(),
    ])
    return JSON.stringify({
      ...cursoSnap.data(),
      id: cursoId,
      bloques: bloquesSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    }, null, 2)
  }

  if (url.host === 'grupo') {
    const parts = url.pathname.split('/').filter(Boolean)
    const grupoId = parts[0]
    const gaSnap = await db.collection('grupo_alumnos').where('grupo_id', '==', grupoId).get()
    const alumnoIds = gaSnap.docs.map(d => (d.data() as any).alumno_id as string)
    const rosters = await Promise.all(alumnoIds.map(async (id) => {
      const [uSnap, rSnap] = await Promise.all([
        db.collection('usuarios').doc(id).get(),
        db.collection('respuestas').where('alumno_id', '==', id).get(),
      ])
      const u = uSnap.data() as any
      const resps = rSnap.docs.map(d => d.data() as any)
      const cal = resps.filter((r: any) => r.calificacion != null)
      return {
        id,
        nombre: `${u?.nombre} ${u?.apellido}`,
        promedio: cal.length ? Math.round(cal.reduce((s: number, r: any) => s + r.calificacion, 0) / cal.length) : null,
        entregas: resps.length,
      }
    }))
    return JSON.stringify({ grupo_id: grupoId, alumnos: rosters }, null, 2)
  }

  if (url.host === 'alumno') {
    const alumnoId = url.pathname.split('/').filter(Boolean)[0]
    const [uSnap, rSnap, analyticsSnap] = await Promise.all([
      db.collection('usuarios').doc(alumnoId).get(),
      db.collection('respuestas').where('alumno_id', '==', alumnoId).get(),
      db.collection('alumno_analytics').doc(alumnoId).get(),
    ])
    const u = uSnap.data() as any
    const resps = rSnap.docs.map(d => d.data() as any)
    const cal = resps.filter((r: any) => r.calificacion != null)
    return JSON.stringify({
      id: alumnoId,
      nombre: `${u?.nombre} ${u?.apellido}`,
      email: u?.email,
      promedioGeneral: cal.length ? Math.round(cal.reduce((s: number, r: any) => s + r.calificacion, 0) / cal.length) : null,
      totalEntregas: resps.length,
      analytics: analyticsSnap.exists ? analyticsSnap.data() : null,
    }, null, 2)
  }

  throw new Error(`Unknown resource URI: ${uri}`)
}
