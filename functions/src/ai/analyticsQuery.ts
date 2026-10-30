/**
 * SP3 — Consultas en Lenguaje Natural sobre la Clase
 *
 * El maestro escribe una pregunta en NL ("¿quién tuvo el promedio más bajo?")
 * y Claude responde usando datos reales de Firestore.
 */
import { db } from '../firebaseAdmin.js'
import { getAnthropic } from './anthropicClient.js'

export async function queryClassData(
  query: string,
  maestroId: string
): Promise<{ answer: string; dataUsed: string[] }> {

  // Fetch maestro's groups
  const gruposSnap = await db.collection('grupos')
    .where('maestro_id', '==', maestroId)
    .get()

  const grupos = gruposSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
  const grupoIds = grupos.map(g => g.id)

  if (grupoIds.length === 0) {
    return { answer: 'Aún no tienes grupos creados.', dataUsed: [] }
  }

  // Fetch students in those groups
  const enrollments = []
  for (let start = 0; start < grupoIds.length; start += 30) {
    const snap = await db.collection('grupo_alumnos').where('grupo_id', 'in', grupoIds.slice(start, start + 30)).get()
    enrollments.push(...snap.docs)
  }
  const alumnoIds = [...new Set(enrollments.map(d => d.data().alumno_id as string))]
  if (!alumnoIds.length) return { answer: 'Tus grupos aún no tienen alumnos inscritos.', dataUsed: ['grupos'] }

  // Fetch student profiles
  const alumnoProfiles: Record<string, any> = {}
  for (const aid of alumnoIds) {
    const snap = await db.collection('usuarios').doc(aid).get()
    if (snap.exists) alumnoProfiles[aid] = snap.data()
  }

  // Fetch responses
  const respuestas: any[] = []
  for (let start = 0; start < alumnoIds.length; start += 30) {
    const snap = await db.collection('respuestas').where('alumno_id', 'in', alumnoIds.slice(start, start + 30)).get()
    respuestas.push(...snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  // Build compact context (avoid token bloat)
  const dataContext = {
    grupos: grupos.map(g => ({ id: g.id, nombre: g.nombre, descripcion: g.descripcion })),
    alumnos: alumnoIds.map(id => {
      const p = alumnoProfiles[id]
      const misResp = respuestas.filter(r => r.alumno_id === id)
      const calificadas = misResp.filter(r => r.calificacion != null)
      const promedio = calificadas.length
        ? Math.round(calificadas.reduce((s: number, r: any) => s + r.calificacion, 0) / calificadas.length)
        : null
      return {
        id,
        nombre: p ? `${p.nombre} ${p.apellido}` : 'Desconocido',
        email: p?.email,
        entregas: misResp.length,
        promedio,
        pendientes: misResp.filter(r => r.calificacion == null).length,
      }
    }),
    resumen: {
      totalEntregas: respuestas.length,
      pendientesCalificar: respuestas.filter(r => r.calificacion == null).length,
      promedioGeneral: (() => {
        const cal = respuestas.filter(r => r.calificacion != null)
        return cal.length ? Math.round(cal.reduce((s: number, r: any) => s + r.calificacion, 0) / cal.length) : null
      })(),
    },
  }

  const message = await getAnthropic().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: `Eres un asistente analítico para instructores de capacitación industrial en iAprende.
Respondes preguntas sobre el desempeño de sus grupos y alumnos en español, de forma concisa y accionable.
Solo tienes acceso a los datos que se te proporcionan.`,
    messages: [{
      role: 'user',
      content: `Datos de mis grupos:
${JSON.stringify(dataContext, null, 2)}

Pregunta: ${query}`,
    }],
  })

  const answer = message.content[0]?.type === 'text' ? message.content[0].text : 'No pude procesar la consulta.'

  return {
    answer,
    dataUsed: ['grupos', 'alumnos', 'respuestas'],
  }
}
