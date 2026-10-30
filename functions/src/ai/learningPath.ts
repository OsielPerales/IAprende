/**
 * SP5 — Ruta de Aprendizaje Adaptativa Real (Claude)
 *
 * Reemplaza la lógica determinista de getAdaptiveRecommendation con una
 * recomendación real de Claude basada en el historial completo del alumno.
 */
import { db } from '../firebaseAdmin.js'
import { getAnthropic } from './anthropicClient.js'

export interface LearningPathResult {
  nivel: 'excelente' | 'bueno' | 'reforzar' | 'repasar'
  mensaje: string
  accion: string
  siguienteTema?: string
}

export async function getPersonalizedLearningPath(
  alumnoId: string,
  cursoId: string,
  recentScore: number,
  courseTitle: string,
  quizTitle: string
): Promise<LearningPathResult> {

  // Fetch student's full response history
  const respSnap = await db.collection('respuestas')
    .where('alumno_id', '==', alumnoId)
    .get()

  const historial = respSnap.docs
    .map(d => d.data())
    .map(r => ({
      calificacion: r.calificacion,
      enviado_at: r.enviado_at,
    }))

  // Fetch course blocks to understand what comes next
  const bloquesSnap = await db.collection('bloques')
    .where('curso_id', '==', cursoId)
    .orderBy('orden')
    .get()

  const bloques = bloquesSnap.docs.map(d => ({
    tipo: d.data().tipo,
    orden: d.data().orden,
  }))

  const totalEntregas = historial.length
  const promedioGeneral = historial.filter(h => h.calificacion != null).length > 0
    ? Math.round(
        historial.filter(h => h.calificacion != null)
          .reduce((s, h) => s + (h.calificacion ?? 0), 0)
        / historial.filter(h => h.calificacion != null).length
      )
    : null

  const message = await getAnthropic().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    tools: [{
      name: 'learning_recommendation',
      description: 'Devuelve la recomendación de aprendizaje personalizada',
      input_schema: {
        type: 'object' as const,
        properties: {
          nivel: {
            type: 'string',
            enum: ['excelente', 'bueno', 'reforzar', 'repasar'],
            description: 'Nivel de desempeño: excelente(≥90), bueno(70-89), reforzar(50-69), repasar(<50)',
          },
          mensaje: {
            type: 'string',
            description: 'Mensaje motivador personalizado en español, máx 60 palabras',
          },
          accion: {
            type: 'string',
            description: 'Acción concreta recomendada, específica para este alumno y su historial',
          },
          siguienteTema: {
            type: 'string',
            description: 'Si aplica, sugerencia del siguiente módulo o tema a estudiar',
          },
        },
        required: ['nivel', 'mensaje', 'accion'],
      },
    }],
    tool_choice: { type: 'any' },
    messages: [{
      role: 'user',
      content: `Eres un tutor de capacitación industrial. Genera una recomendación de aprendizaje personalizada.

Alumno:
- Calificación reciente en "${quizTitle}" (curso "${courseTitle}"): ${recentScore}%
- Total de evaluaciones completadas: ${totalEntregas}
- Promedio general: ${promedioGeneral !== null ? promedioGeneral + '%' : 'Sin datos'}
- Módulos del curso: ${bloques.length} bloques

Genera una recomendación genuinamente personalizada — considera el patrón de desempeño, no solo la nota más reciente.`,
    }],
  })

  const toolUse = message.content.find(c => c.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    // Fallback determinista si Claude falla
    return recentScore >= 90
      ? { nivel: 'excelente', mensaje: `¡Excelente resultado (${recentScore}%) en "${quizTitle}"!`, accion: 'Continúa al siguiente módulo.' }
      : recentScore >= 70
        ? { nivel: 'bueno', mensaje: `Buen resultado (${recentScore}%).`, accion: 'Repasa los puntos débiles antes de continuar.' }
        : recentScore >= 50
          ? { nivel: 'reforzar', mensaje: `Obtuviste ${recentScore}%. Conviene reforzar.`, accion: 'Vuelve a leer el módulo y consulta al tutor IA.' }
          : { nivel: 'repasar', mensaje: `Obtuviste ${recentScore}%. Necesitas repasar.`, accion: 'Regresa al inicio del módulo.' }
  }

  return toolUse.input as LearningPathResult
}
