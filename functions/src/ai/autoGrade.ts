/**
 * SP1 — Auto-Calificación de Respuestas Abiertas
 *
 * Califica preguntas abiertas con Claude y devuelve score + feedback + confidence.
 * Si confidence === 'high' el maestro puede aceptar directo; si 'medium'/'low'
 * se muestra la sugerencia para que el maestro la confirme.
 */
import { db } from '../firebaseAdmin.js'
import { getAnthropic } from './anthropicClient.js'

export interface AutoGradeResult {
  score: number
  feedback: string
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
}

export async function autoGradeRespuesta(
  respuestaId: string,
  rubric?: string
): Promise<AutoGradeResult> {
  const respDoc = await db.collection('respuestas').doc(respuestaId).get()
  if (!respDoc.exists) throw new Error(`Respuesta ${respuestaId} no encontrada`)

  const respuesta = respDoc.data()!
  const bloqueDoc = await db.collection('bloques').doc(respuesta.bloque_id).get()
  const preguntas = ((bloqueDoc.data()?.contenido as Record<string, unknown>)?.preguntas as any[]) ?? []

  const openItems = preguntas
    .filter((p: any) => p.tipo === 'abierta')
    .map((p: any) => ({
      pregunta: p.texto as string,
      respuestaAlumno: String(respuesta.respuestas[p.id] ?? ''),
      puntos: (p.puntos as number) ?? 0,
    }))

  if (openItems.length === 0) throw new Error('No hay preguntas abiertas en esta entrega')

  const questionsBlock = openItems
    .map((q, i) => `Pregunta ${i + 1} (vale ${q.puntos} puntos):\n${q.pregunta}\n\nRespuesta del alumno:\n${q.respuestaAlumno}`)
    .join('\n\n---\n\n')

  const totalPuntos = openItems.reduce((s, q) => s + q.puntos, 0)

  const message = await getAnthropic().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    tools: [{
      name: 'grading_result',
      description: 'Devuelve el resultado de la calificación estructurado',
      input_schema: {
        type: 'object' as const,
        properties: {
          score: {
            type: 'number',
            description: `Calificación final de 0 a 100 (proporcional a los ${totalPuntos} puntos disponibles)`,
          },
          feedback: {
            type: 'string',
            description: 'Retroalimentación constructiva en español, máx 120 palabras, dirigida al alumno',
          },
          confidence: {
            type: 'string',
            enum: ['high', 'medium', 'low'],
            description: 'high=respuesta clara y evaluable, medium=ambigua pero evaluable, low=muy incompleta o fuera de tema',
          },
          reasoning: {
            type: 'string',
            description: 'Justificación breve de la calificación para el maestro (máx 60 palabras)',
          },
        },
        required: ['score', 'feedback', 'confidence', 'reasoning'],
      },
    }],
    tool_choice: { type: 'any' },
    messages: [{
      role: 'user',
      content: `Eres un evaluador experto en capacitación industrial. Califica las siguientes respuestas abiertas de un trabajador.

${rubric ? `Rúbrica del maestro: ${rubric}\n\n` : ''}Criterios generales: comprensión del concepto, aplicación práctica en contexto laboral, claridad y completitud.

${questionsBlock}`,
    }],
  })

  const toolUse = message.content.find(c => c.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') throw new Error('Claude no devolvió resultado estructurado')

  return toolUse.input as AutoGradeResult
}
