/** Authenticated HTTP APIs; scheduled jobs use their managed service identity. */
import { onRequest } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { handleAiProxy } from './proxy/aiProxy.js'
import { autoGradeRespuesta } from './ai/autoGrade.js'
import { generateCourseFromTopic } from './ai/courseGenerator.js'
import { queryClassData } from './ai/analyticsQuery.js'
import { detectKnowledgeGaps } from './ai/knowledgeGaps.js'
import { getPersonalizedLearningPath } from './ai/learningPath.js'
import { translateBlock, type SimplifyLevel } from './ai/contentTranslation.js'
import { executePrompt, evaluatePrompt } from './ai/promptSimulator.js'
import { runDailyDigest } from './scheduled/dailyDigest.js'
import { handleMcpHttp } from './mcp/mcpHttpFunction.js'
import { protectedPost, requireStaff, requireSelfOrStaff, instructorId, text, documentId, number, HttpError } from './security/http.js'

const options = { timeoutSeconds: 60, secrets: ['ANTHROPIC_API_KEY'], maxInstances: 5 }
export const aiProxy = onRequest(options, handleAiProxy)
export const autoGradeRespuestaFn = onRequest(options, protectedPost(async (body, who, spend) => {
  requireStaff(who)
  const id = documentId(body, 'respuestaId'), rubric = text(body, 'rubric', 4000, true)
  await spend()
  return autoGradeRespuesta(id, rubric)
}))
export const generateCourseFromTopicFn = onRequest({ ...options, timeoutSeconds: 120, memory: '512MiB' }, protectedPost(async (body, who, spend) => {
  const maestro = instructorId(who, body.maestroId)
  const topic = text(body, 'topic', 1000), context = text(body, 'industryContext', 4000)
  const count = number(body, 'numBloques', 1, 12, 4)
  if (!Number.isInteger(count)) throw new HttpError(400, 'numBloques debe ser entero.')
  await spend()
  return generateCourseFromTopic(topic, context, maestro, count)
}))
export const queryClassDataFn = onRequest(options, protectedPost(async (body, who, spend) => {
  const maestro = instructorId(who, body.maestroId), query = text(body, 'query', 2000)
  await spend()
  return queryClassData(query, maestro)
}))
export const detectKnowledgeGapsFn = onRequest(options, protectedPost(async (body, who, spend) => {
  const id = documentId(body, 'alumnoId')
  requireSelfOrStaff(who, id)
  await spend()
  return detectKnowledgeGaps(id)
}))
export const getPersonalizedLearningPathFn = onRequest(options, protectedPost(async (body, who, spend) => {
  const id = documentId(body, 'alumnoId'), curso = documentId(body, 'cursoId')
  requireSelfOrStaff(who, id)
  const score = number(body, 'recentScore', 0, 100), course = text(body, 'courseTitle', 500), quiz = text(body, 'quizTitle', 500)
  await spend()
  return getPersonalizedLearningPath(id, curso, score, course, quiz)
}))
export const translateBlockFn = onRequest(options, protectedPost(async (body, _who, spend) => {
  const id = documentId(body, 'bloqueId'), language = text(body, 'targetLanguage', 80, true) || 'es'
  const level = body.simplifyLevel ?? 'simpler'
  if (!['same', 'simpler', 'basic'].includes(level as string)) throw new HttpError(400, 'simplifyLevel inválido.')
  await spend()
  return translateBlock(id, language, level as SimplifyLevel)
}))
export const evaluatePromptFn = onRequest(options, protectedPost(async (body, _who, spend) => {
  const prompt = text(body, 'prompt', 12000), rubric = text(body, 'rubrica', 4000, true)
  await spend()
  return evaluatePrompt(prompt, rubric)
}))
export const executePromptFn = onRequest(options, protectedPost(async (body, _who, spend) => {
  const prompt = text(body, 'prompt', 12000)
  await spend()
  return executePrompt(prompt)
}))
export const dailyDigestFn = onSchedule({
  schedule: '0 7 * * *', timeZone: 'America/Mexico_City', timeoutSeconds: 300,
  secrets: ['ANTHROPIC_API_KEY'], maxInstances: 1,
}, async () => { await runDailyDigest() })
export const mcpServer = onRequest({ ...options, timeoutSeconds: 540, memory: '512MiB' }, handleMcpHttp)
