/**
 * SP6 — Digest Diario Inteligente para Maestros
 *
 * Cloud Scheduler trigger (diario 7 AM UTC-6).
 * Para cada maestro, genera un resumen personalizado con Claude
 * y lo escribe en la colección `notificaciones`.
 */
import { db } from '../firebaseAdmin.js'
import { getAnthropic } from '../ai/anthropicClient.js'

export async function runDailyDigest(): Promise<void> {
  // Get all maestros
  const maestrosSnap = await db.collection('usuarios')
    .where('rol', '==', 'maestro')
    .get()

  const tasks = maestrosSnap.docs.map(async (maestroDoc) => {
    const maestro = maestroDoc.data() as { nombre: string; email: string }
    const maestroId = maestroDoc.id

    try {
      // Get this maestro's groups
      const gruposSnap = await db.collection('grupos')
        .where('maestro_id', '==', maestroId)
        .get()

      if (gruposSnap.empty) return

      const grupos = gruposSnap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) }))
      const grupoIds = grupos.map(g => g.id)

      // Get students
      const gaSnap = await db.collection('grupo_alumnos')
        .where('grupo_id', 'in', grupoIds.slice(0, 10))
        .get()

      const alumnoIds = [...new Set(gaSnap.docs.map(d => (d.data() as any).alumno_id as string))]

      // Get ungraded responses
      const pendientesSnap = alumnoIds.length > 0
        ? await db.collection('respuestas')
            .where('alumno_id', 'in', alumnoIds.slice(0, 10))
            .where('calificacion', '==', null)
            .get()
        : { docs: [], size: 0 } as any

      const pendientesCount = pendientesSnap.size ?? 0

      // Get recent submissions (last 24h)
      const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const recientesSnap = alumnoIds.length > 0
        ? await db.collection('respuestas')
            .where('alumno_id', 'in', alumnoIds.slice(0, 10))
            .where('enviado_at', '>=', ayer)
            .get()
        : { size: 0 } as any

      const recientesCount = recientesSnap.size ?? 0

      if (pendientesCount === 0 && recientesCount === 0) return

      // Generate digest with Claude
      const message = await getAnthropic().messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `Eres un asistente amigable de la plataforma iAprende. Escribe un mensaje de resumen diario breve y cálido para el instructor ${maestro.nombre}.

Datos:
- Evaluaciones pendientes de calificar: ${pendientesCount}
- Nuevas entregas en las últimas 24h: ${recientesCount}
- Número de grupos: ${grupos.length}
- Total de alumnos: ${alumnoIds.length}

Escribe en 2-3 oraciones. Sé motivador, específico con los números, y sugiere una acción concreta. En español.`,
        }],
      })

      const cuerpo = message.content[0]?.type === 'text' ? message.content[0].text : ''
      if (!cuerpo) return

      await db.collection('notificaciones').add({
        destinatario_id: maestroId,
        tipo: 'digest_diario',
        titulo: '🌅 Tu resumen de hoy',
        cuerpo,
        leida: false,
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.error(`[dailyDigest] Error para maestro ${maestroId}:`, err)
    }
  })

  await Promise.allSettled(tasks)
  console.log(`[dailyDigest] Digest generado para ${maestrosSnap.size} maestros`)
}
