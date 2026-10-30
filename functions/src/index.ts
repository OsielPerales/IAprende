/**
 * iAprende — Firebase Cloud Functions
 *
 * Exports all HTTP and scheduled functions.
 * Deploy: firebase deploy --only functions
 */
import { onRequest } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'

import { handleAiProxy } from './proxy/aiProxy.js'
import { autoGradeRespuesta } from './ai/autoGrade.js'
import { generateCourseFromTopic } from './ai/courseGenerator.js'
import { queryClassData } from './ai/analyticsQuery.js'
import { detectKnowledgeGaps } from './ai/knowledgeGaps.js'
import { getPersonalizedLearningPath } from './ai/learningPath.js'
import { translateBlock } from './ai/contentTranslation.js'
import { runDailyDigest } from './scheduled/dailyDigest.js'
import { handleMcpHttp } from './mcp/mcpHttpFunction.js'

// ── Helper: CORS headers + JSON response ──────────────────────────────────────
function cors(res: any) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
}

function handleOptions(req: any, res: any): boolean {
  if (req.method === 'OPTIONS') { cors(res); res.status(204).send(''); return true }
  return false
}

// ── Proxy: migrated OpenAI-compatible proxy → Claude API ─────────────────────
export const aiProxy = onRequest({ timeoutSeconds: 60, memory: '256MiB' }, handleAiProxy)

// ── SP1: Auto-calificación de respuestas abiertas ─────────────────────────────
export const autoGradeRespuestaFn = onRequest({ timeoutSeconds: 60 }, async (req, res) => {
  cors(res); if (handleOptions(req, res)) return
  try {
    const { respuestaId, rubric } = req.body as { respuestaId: string; rubric?: string }
    const result = await autoGradeRespuesta(respuestaId, rubric)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) })
  }
})

// ── SP2: Generación de cursos desde lenguaje natural ─────────────────────────
export const generateCourseFromTopicFn = onRequest({ timeoutSeconds: 120, memory: '512MiB' }, async (req, res) => {
  cors(res); if (handleOptions(req, res)) return
  try {
    const { topic, industryContext, maestroId, numBloques } = req.body as {
      topic: string
      industryContext: string
      maestroId: string
      numBloques?: number
    }
    const result = await generateCourseFromTopic(topic, industryContext, maestroId, numBloques ?? 4)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) })
  }
})

// ── SP3: Consultas NL sobre la clase ─────────────────────────────────────────
export const queryClassDataFn = onRequest({ timeoutSeconds: 60 }, async (req, res) => {
  cors(res); if (handleOptions(req, res)) return
  try {
    const { query, maestroId } = req.body as { query: string; maestroId: string }
    const result = await queryClassData(query, maestroId)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) })
  }
})

// ── SP4: Detección de brechas de conocimiento ─────────────────────────────────
export const detectKnowledgeGapsFn = onRequest({ timeoutSeconds: 60 }, async (req, res) => {
  cors(res); if (handleOptions(req, res)) return
  try {
    const { alumnoId } = req.body as { alumnoId: string }
    const result = await detectKnowledgeGaps(alumnoId)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) })
  }
})

// ── SP5: Ruta de aprendizaje adaptativa ──────────────────────────────────────
export const getPersonalizedLearningPathFn = onRequest({ timeoutSeconds: 60 }, async (req, res) => {
  cors(res); if (handleOptions(req, res)) return
  try {
    const { alumnoId, cursoId, recentScore, courseTitle, quizTitle } = req.body as {
      alumnoId: string
      cursoId: string
      recentScore: number
      courseTitle: string
      quizTitle: string
    }
    const result = await getPersonalizedLearningPath(alumnoId, cursoId, recentScore, courseTitle, quizTitle)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) })
  }
})

// ── SP7: Traducción y simplificación de contenido ────────────────────────────
export const translateBlockFn = onRequest({ timeoutSeconds: 60 }, async (req, res) => {
  cors(res); if (handleOptions(req, res)) return
  try {
    const { bloqueId, targetLanguage, simplifyLevel } = req.body as {
      bloqueId: string
      targetLanguage?: string
      simplifyLevel?: 'same' | 'simpler' | 'basic'
    }
    const result = await translateBlock(bloqueId, targetLanguage ?? 'es', simplifyLevel ?? 'simpler')
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) })
  }
})

// ── SP6: Digest diario (Cloud Scheduler) ─────────────────────────────────────
export const dailyDigestFn = onSchedule({
  schedule: '0 13 * * *', // 7 AM UTC-6 (México Central)
  timeZone: 'America/Mexico_City',
  timeoutSeconds: 300,
}, async () => {
  await runDailyDigest()
})

// ── MCP Server HTTP endpoint ──────────────────────────────────────────────────
export const mcpServer = onRequest({
  timeoutSeconds: 540,
  memory: '512MiB',
}, handleMcpHttp)
