/**
 * MCP Write Tools — iAprende
 * Firestore write operations exposed as MCP tools (with validation)
 */
import { db } from '../../firebaseAdmin.js'
import type { Tool } from '@modelcontextprotocol/sdk/types.js'

export const WRITE_TOOLS: Tool[] = [
  {
    name: 'submit_grade',
    description: 'Write a grade (0-100) back to a student response. Also accepts optional feedback string.',
    inputSchema: {
      type: 'object',
      properties: {
        respuesta_id: { type: 'string', description: 'Firestore respuesta document ID' },
        calificacion: { type: 'number', description: 'Grade from 0 to 100' },
        feedback: { type: 'string', description: 'Optional written feedback for the student' },
      },
      required: ['respuesta_id', 'calificacion'],
    },
  },
  {
    name: 'create_course',
    description: 'Create a new draft course in Firestore',
    inputSchema: {
      type: 'object',
      properties: {
        titulo: { type: 'string', description: 'Course title' },
        descripcion: { type: 'string', description: 'Course description' },
        maestro_id: { type: 'string', description: 'Instructor user ID' },
      },
      required: ['titulo', 'descripcion', 'maestro_id'],
    },
  },
  {
    name: 'add_bloque_to_course',
    description: 'Append a content block to an existing course',
    inputSchema: {
      type: 'object',
      properties: {
        curso_id: { type: 'string', description: 'Target course document ID' },
        tipo: { type: 'string', enum: ['texto', 'cuestionario', 'simulador', 'imagen', 'carrusel'] },
        contenido: { type: 'object', description: 'Block content object (type-dependent structure)' },
      },
      required: ['curso_id', 'tipo', 'contenido'],
    },
  },
  {
    name: 'enroll_student',
    description: 'Enroll a student into a group',
    inputSchema: {
      type: 'object',
      properties: {
        grupo_id: { type: 'string', description: 'Group document ID' },
        alumno_id: { type: 'string', description: 'Student user document ID' },
      },
      required: ['grupo_id', 'alumno_id'],
    },
  },
]

export async function handleWriteTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case 'submit_grade': {
      const { respuesta_id, calificacion, feedback } = args as {
        respuesta_id: string
        calificacion: number
        feedback?: string
      }
      if (calificacion < 0 || calificacion > 100) throw new Error('calificacion must be 0-100')

      const update: Record<string, unknown> = { calificacion }
      if (feedback) update.feedback_maestro = feedback

      await db.collection('respuestas').doc(respuesta_id).update(update)
      return JSON.stringify({ success: true, respuesta_id, calificacion })
    }

    case 'create_course': {
      const { titulo, descripcion, maestro_id } = args as {
        titulo: string
        descripcion: string
        maestro_id: string
      }
      const ref = await db.collection('cursos').add({
        titulo,
        descripcion,
        maestro_id,
        publicado: false,
        created_at: new Date().toISOString(),
        generado_por_ia: false,
      })
      return JSON.stringify({ success: true, curso_id: ref.id })
    }

    case 'add_bloque_to_course': {
      const { curso_id, tipo, contenido } = args as {
        curso_id: string
        tipo: string
        contenido: Record<string, unknown>
      }
      // Determine next order number
      const existingSnap = await db.collection('bloques').where('curso_id', '==', curso_id).count().get()
      const orden = existingSnap.data().count + 1

      const ref = await db.collection('bloques').add({
        curso_id,
        tipo,
        contenido,
        orden,
        created_at: new Date().toISOString(),
      })
      return JSON.stringify({ success: true, bloque_id: ref.id, orden })
    }

    case 'enroll_student': {
      const { grupo_id, alumno_id } = args as { grupo_id: string; alumno_id: string }
      const docId = `${grupo_id}_${alumno_id}`
      await db.collection('grupo_alumnos').doc(docId).set({
        grupo_id,
        alumno_id,
        fecha_ingreso: new Date().toISOString(),
      })
      return JSON.stringify({ success: true, grupo_id, alumno_id })
    }

    default:
      throw new Error(`Unknown write tool: ${name}`)
  }
}
