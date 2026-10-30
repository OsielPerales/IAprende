/**
 * SP2 — Generador de Cursos desde Lenguaje Natural
 *
 * Recibe una descripción del tema y genera una estructura completa de curso
 * con bloques (texto + cuestionario) lista para insertar en Firestore.
 */
import { db } from '../firebaseAdmin.js'
import { FieldValue } from 'firebase-admin/firestore'
import { getAnthropic } from './anthropicClient.js'

interface GeneratedBloque {
  tipo: 'texto' | 'cuestionario'
  contenido: Record<string, unknown>
}

interface GeneratedCourse {
  titulo: string
  descripcion: string
  bloques: GeneratedBloque[]
}

export async function generateCourseFromTopic(
  topic: string,
  industryContext: string,
  maestroId: string,
  numBloques = 4
): Promise<{ cursoId: string; titulo: string; bloquesCount: number }> {

  const message = await getAnthropic().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    tools: [{
      name: 'course_structure',
      description: 'Devuelve la estructura completa del curso generado',
      input_schema: {
        type: 'object' as const,
        properties: {
          titulo: { type: 'string', description: 'Título del curso (máx 60 caracteres)' },
          descripcion: { type: 'string', description: 'Descripción del curso (1-2 oraciones)' },
          bloques: {
            type: 'array',
            description: `Array de ${numBloques} bloques de contenido`,
            items: {
              type: 'object',
              properties: {
                tipo: { type: 'string', enum: ['texto', 'cuestionario'] },
                contenido: {
                  type: 'object',
                  description: 'Para texto: {html: string}. Para cuestionario: {titulo: string, preguntas: [{id,texto,tipo,opciones?,correcta?,puntos}]}',
                },
              },
              required: ['tipo', 'contenido'],
            },
          },
        },
        required: ['titulo', 'descripcion', 'bloques'],
      },
    }],
    tool_choice: { type: 'any' },
    messages: [{
      role: 'user',
      content: `Eres un experto en diseño instruccional para capacitación industrial en México.

Genera un curso completo sobre el siguiente tema:
Tema: "${topic}"
Contexto industrial: "${industryContext}"
Número de bloques: ${numBloques}

Estructura esperada:
- ${numBloques - 1} bloque(s) de tipo "texto" con contenido HTML formateado (usa <h2>, <p>, <ul>, <strong>)
- 1 bloque de tipo "cuestionario" al final con 3 preguntas de opción múltiple + 1 pregunta abierta (puntos deben sumar 100)

El contenido debe ser práctico, orientado al trabajador de piso, con ejemplos reales del contexto industrial.`,
    }],
  })

  const toolUse = message.content.find(c => c.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') throw new Error('Claude no generó estructura de curso')

  const generated = toolUse.input as GeneratedCourse

  // Write to Firestore atomically
  const batch = db.batch()

  const cursoRef = db.collection('cursos').doc()
  batch.set(cursoRef, {
    titulo: generated.titulo,
    descripcion: generated.descripcion,
    maestro_id: maestroId,
    publicado: false,
    created_at: new Date().toISOString(),
    generado_por_ia: true,
  })

  generated.bloques.forEach((bloque, index) => {
    const bloqueRef = db.collection('bloques').doc()
    batch.set(bloqueRef, {
      curso_id: cursoRef.id,
      orden: index + 1,
      tipo: bloque.tipo,
      contenido: bloque.contenido,
      created_at: new Date().toISOString(),
    })
  })

  await batch.commit()

  return {
    cursoId: cursoRef.id,
    titulo: generated.titulo,
    bloquesCount: generated.bloques.length,
  }
}
