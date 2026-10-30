/**
 * SP7 — Traducción y Simplificación de Contenido
 *
 * Simplifica HTML de un bloque de texto a lenguaje más accesible
 * o lo traduce a otro idioma, preservando vocabulario técnico clave.
 */
import { db } from '../firebaseAdmin.js'
import { getAnthropic } from './anthropicClient.js'

export type SimplifyLevel = 'same' | 'simpler' | 'basic'

export async function translateBlock(
  bloqueId: string,
  targetLanguage: string = 'es',
  simplifyLevel: SimplifyLevel = 'simpler'
): Promise<{ html: string; note: string }> {

  const bloqueDoc = await db.collection('bloques').doc(bloqueId).get()
  if (!bloqueDoc.exists) throw new Error(`Bloque ${bloqueId} no encontrado`)

  const contenido = bloqueDoc.data()?.contenido as Record<string, unknown>
  const originalHtml = (contenido?.html as string) ?? ''

  if (!originalHtml) throw new Error('Este bloque no tiene contenido de texto')

  const simplifyInstructions: Record<SimplifyLevel, string> = {
    same: 'Mantén el mismo nivel de complejidad, solo traduce si es necesario.',
    simpler: 'Simplifica el lenguaje a nivel de secundaria/preparatoria. Usa oraciones cortas. Preserva términos técnicos industriales clave con una explicación breve entre paréntesis.',
    basic: 'Simplifica al máximo. Usa palabras del habla cotidiana del trabajador de planta. Rompe el contenido en pasos muy cortos. Solo conserva los términos técnicos absolutamente esenciales.',
  }

  const message = await getAnthropic().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    system: `Eres un especialista en comunicación industrial accesible. Adaptas contenido de capacitación para hacerlo comprensible para todos los niveles educativos.`,
    messages: [{
      role: 'user',
      content: `Adapta el siguiente contenido HTML de capacitación industrial.

Idioma destino: ${targetLanguage === 'es' ? 'Español (mismo idioma, solo simplificar)' : targetLanguage}
Nivel de simplificación: ${simplifyInstructions[simplifyLevel]}

Devuelve SOLO el HTML adaptado, sin explicaciones adicionales. Mantén las etiquetas HTML (<h2>, <p>, <ul>, <li>, <strong>) pero adapta el texto interior.

HTML original:
${originalHtml.substring(0, 3000)}`,
    }],
  })

  const html = message.content[0]?.type === 'text' ? message.content[0].text : originalHtml
  const note = simplifyLevel === 'basic'
    ? 'Versión simplificada para lectura fácil'
    : simplifyLevel === 'simpler'
      ? 'Versión adaptada con lenguaje más claro'
      : 'Contenido traducido'

  return { html, note }
}
