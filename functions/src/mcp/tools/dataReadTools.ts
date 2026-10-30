/**
 * MCP Data Read Tools — iAprende
 * Read-only Firestore queries exposed as MCP tools
 */
import { db } from '../../firebaseAdmin.js'
import type { Tool } from '@modelcontextprotocol/sdk/types.js'

export const DATA_READ_TOOLS: Tool[] = [
  {
    name: 'get_platform_stats',
    description: 'Get overall iAprende platform statistics: user counts, course counts, groups, responses',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_group_roster',
    description: 'Get all students in a group with their grades and average score',
    inputSchema: {
      type: 'object',
      properties: {
        grupo_id: { type: 'string', description: 'Firestore group document ID' },
      },
      required: ['grupo_id'],
    },
  },
  {
    name: 'get_student_performance',
    description: 'Get full performance profile of a student: all quiz responses, scores, average',
    inputSchema: {
      type: 'object',
      properties: {
        alumno_id: { type: 'string', description: 'Firestore user document ID of the student' },
      },
      required: ['alumno_id'],
    },
  },
  {
    name: 'get_course_analytics',
    description: 'Get submission rate and score distribution for all quiz blocks in a course',
    inputSchema: {
      type: 'object',
      properties: {
        curso_id: { type: 'string', description: 'Firestore course document ID' },
      },
      required: ['curso_id'],
    },
  },
  {
    name: 'list_pending_grades',
    description: 'List all student responses that have no grade (calificacion === null)',
    inputSchema: {
      type: 'object',
      properties: {
        grupo_id: { type: 'string', description: 'Optional: filter by group ID' },
      },
      required: [],
    },
  },
  {
    name: 'get_course_structure',
    description: 'Get all blocks (bloques) of a course in order, with their content',
    inputSchema: {
      type: 'object',
      properties: {
        curso_id: { type: 'string', description: 'Firestore course document ID' },
      },
      required: ['curso_id'],
    },
  },
]

export async function handleDataReadTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case 'get_platform_stats': {
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
      }, null, 2)
    }

    case 'get_group_roster': {
      const { grupo_id } = args as { grupo_id: string }
      const gaSnap = await db.collection('grupo_alumnos').where('grupo_id', '==', grupo_id).get()
      const alumnoIds = gaSnap.docs.map(d => (d.data() as any).alumno_id as string)

      const rosters = await Promise.all(alumnoIds.map(async (id) => {
        const [uSnap, rSnap] = await Promise.all([
          db.collection('usuarios').doc(id).get(),
          db.collection('respuestas').where('alumno_id', '==', id).get(),
        ])
        const u = uSnap.data() as any
        const resps = rSnap.docs.map(d => d.data() as any)
        const cal = resps.filter(r => r.calificacion != null)
        return {
          id,
          nombre: `${u?.nombre} ${u?.apellido}`,
          email: u?.email,
          entregas: resps.length,
          promedio: cal.length ? Math.round(cal.reduce((s: number, r: any) => s + r.calificacion, 0) / cal.length) : null,
          pendientes: resps.filter(r => r.calificacion == null).length,
        }
      }))
      return JSON.stringify(rosters, null, 2)
    }

    case 'get_student_performance': {
      const { alumno_id } = args as { alumno_id: string }
      const [uSnap, rSnap] = await Promise.all([
        db.collection('usuarios').doc(alumno_id).get(),
        db.collection('respuestas').where('alumno_id', '==', alumno_id).get(),
      ])
      const u = uSnap.data() as any
      const resps = rSnap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) })) as any[]
      const cal = resps.filter(r => r.calificacion != null)
      return JSON.stringify({
        alumno: { id: alumno_id, nombre: `${u?.nombre} ${u?.apellido}`, email: u?.email },
        totalEntregas: resps.length,
        promedioGeneral: cal.length ? Math.round(cal.reduce((s: number, r: any) => s + r.calificacion, 0) / cal.length) : null,
        pendientesCalificar: resps.filter(r => r.calificacion == null).length,
        historial: resps.map(r => ({ bloque_id: r.bloque_id, calificacion: r.calificacion, enviado_at: r.enviado_at })),
      }, null, 2)
    }

    case 'get_course_analytics': {
      const { curso_id } = args as { curso_id: string }
      const bloquesSnap = await db.collection('bloques')
        .where('curso_id', '==', curso_id)
        .where('tipo', '==', 'cuestionario')
        .get()

      const analytics = await Promise.all(bloquesSnap.docs.map(async (b) => {
        const rSnap = await db.collection('respuestas').where('bloque_id', '==', b.id).get()
        const resps = rSnap.docs.map(d => d.data() as any)
        const cal = resps.filter(r => r.calificacion != null)
        const content = b.data().contenido as any
        return {
          bloque_id: b.id,
          titulo: content?.titulo ?? 'Quiz',
          entregas: resps.length,
          promedio: cal.length ? Math.round(cal.reduce((s: number, r: any) => s + r.calificacion, 0) / cal.length) : null,
          pendientes: resps.filter(r => r.calificacion == null).length,
        }
      }))
      return JSON.stringify(analytics, null, 2)
    }

    case 'list_pending_grades': {
      const { grupo_id } = args as { grupo_id?: string }
      let query = db.collection('respuestas').where('calificacion', '==', null)
      const snap = await query.get()

      let pending = snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) })) as any[]

      if (grupo_id) {
        const gaSnap = await db.collection('grupo_alumnos').where('grupo_id', '==', grupo_id).get()
        const alumnoIds = new Set(gaSnap.docs.map(d => (d.data() as any).alumno_id as string))
        pending = pending.filter(r => alumnoIds.has(r.alumno_id))
      }

      return JSON.stringify(pending.map(r => ({
        id: r.id,
        alumno_id: r.alumno_id,
        bloque_id: r.bloque_id,
        enviado_at: r.enviado_at,
      })), null, 2)
    }

    case 'get_course_structure': {
      const { curso_id } = args as { curso_id: string }
      const [cursoSnap, bloquesSnap] = await Promise.all([
        db.collection('cursos').doc(curso_id).get(),
        db.collection('bloques').where('curso_id', '==', curso_id).orderBy('orden').get(),
      ])
      const curso = cursoSnap.data() as any
      const bloques = bloquesSnap.docs.map(d => ({
        id: d.id,
        orden: d.data().orden,
        tipo: d.data().tipo,
        // Omit full contenido to save tokens
        hasContent: !!d.data().contenido,
      }))
      return JSON.stringify({ curso: { id: curso_id, titulo: curso?.titulo, descripcion: curso?.descripcion }, bloques }, null, 2)
    }

    default:
      throw new Error(`Unknown data read tool: ${name}`)
  }
}
