/**
 * SP4 — Detección de Brechas de Conocimiento
 *
 * Analiza el historial de respuestas de un alumno y detecta conceptos débiles.
 * Escribe el resultado en alumno_analytics/{alumnoId} en Firestore.
 */
import { db } from '../firebaseAdmin.js'
import { getAnthropic } from './anthropicClient.js'

export interface KnowledgeGapReport {
  gaps: string[]
  strengths: string[]
  priorityTopics: string[]
  summary: string
  updatedAt: string
}

export async function detectKnowledgeGaps(alumnoId: string): Promise<KnowledgeGapReport> {
  // Fetch all responses for this student
  const respSnap = await db.collection('respuestas')
    .where('alumno_id', '==', alumnoId)
    .get()

  if (respSnap.empty) {
    const empty: KnowledgeGapReport = {
      gaps: [],
      strengths: [],
      priorityTopics: [],
      summary: 'Aún no has enviado evaluaciones. ¡Completa tu primer quiz para ver tu análisis personalizado!',
      updatedAt: new Date().toISOString(),
    }
    await db.collection('alumno_analytics').doc(alumnoId).set(empty)
    return empty
  }

  const respuestas = respSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]

  // Fetch associated bloques to get question context
  const bloqueIds = [...new Set(respuestas.map(r => r.bloque_id as string))]
  const bloques: Record<string, any> = {}
  for (const bid of bloqueIds) {
    const snap = await db.collection('bloques').doc(bid).get()
    if (snap.exists) bloques[bid] = snap.data()
  }

  // Build performance summary per question
  const performanceData = respuestas.map(r => {
    const bloque = bloques[r.bloque_id]
    const preguntas = bloque?.contenido?.preguntas ?? []
    let correctas = 0
    let total = 0
    const wrongTopics: string[] = []

    preguntas.forEach((p: any) => {
      if (p.tipo === 'opcion_multiple') {
        total++
        if (r.respuestas[p.id] === p.correcta) {
          correctas++
        } else {
          wrongTopics.push(p.texto?.substring(0, 60) ?? 'Pregunta')
        }
      }
    })

    return {
      calificacion: r.calificacion,
      pctCorrectas: total > 0 ? Math.round((correctas / total) * 100) : null,
      wrongTopics,
    }
  })

  const message = await getAnthropic().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    tools: [{
      name: 'knowledge_gaps',
      description: 'Devuelve el análisis de brechas de conocimiento',
      input_schema: {
        type: 'object' as const,
        properties: {
          gaps: {
            type: 'array',
            items: { type: 'string' },
            description: '3-5 áreas o conceptos donde el alumno muestra dificultades (frases cortas)',
          },
          strengths: {
            type: 'array',
            items: { type: 'string' },
            description: '2-3 áreas donde el alumno tiene buen desempeño',
          },
          priorityTopics: {
            type: 'array',
            items: { type: 'string' },
            description: 'Temas prioritarios a estudiar esta semana, en orden de importancia',
          },
          summary: {
            type: 'string',
            description: 'Resumen motivador personalizado en español, máx 80 palabras, dirigido al alumno',
          },
        },
        required: ['gaps', 'strengths', 'priorityTopics', 'summary'],
      },
    }],
    tool_choice: { type: 'any' },
    messages: [{
      role: 'user',
      content: `Analiza el desempeño de este alumno en capacitación industrial y detecta sus brechas de conocimiento.

Historial de evaluaciones:
${JSON.stringify(performanceData, null, 2)}

Genera un análisis constructivo que ayude al alumno a mejorar. Si el desempeño es bueno, reconócelo y sugiere mantener el ritmo.`,
    }],
  })

  const toolUse = message.content.find(c => c.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') throw new Error('Claude no generó el análisis')

  const report: KnowledgeGapReport = {
    ...(toolUse.input as Omit<KnowledgeGapReport, 'updatedAt'>),
    updatedAt: new Date().toISOString(),
  }

  // Persist to Firestore
  await db.collection('alumno_analytics').doc(alumnoId).set(report)

  return report
}
