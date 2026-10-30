/**
 * aiProxy — Migración del proxy OpenAI → Claude API
 *
 * Acepta requests en formato OpenAI (messages[], model, temperature, max_tokens, response_format?)
 * y los traduce a Claude, devolviendo la respuesta en formato OpenAI para que
 * el frontend no necesite cambios en las funciones existentes.
 */
import Anthropic from '@anthropic-ai/sdk'
import { protectedPost, HttpError } from '../security/http.js'

let anthropic: Anthropic;
const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001'

function getAnthropic() {
  if (!anthropic) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return anthropic;
}

export const handleAiProxy = protectedPost(async (body, _who, spend) => {
  const { messages, max_tokens = 1000 } = body
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 30 ||
      messages.some(m => !m || !['system', 'user', 'assistant'].includes(m.role) ||
        typeof m.content !== 'string' || !m.content.trim() || m.content.length > 16000)) {
    throw new HttpError(400, 'messages inválido.')
  }
  if (!Number.isInteger(max_tokens) || (max_tokens as number) < 1 || (max_tokens as number) > 4000) throw new HttpError(400, 'max_tokens inválido.')
  const system = messages.filter(m => m.role === 'system').map(m => m.content).join('\n')
  const userMsgs = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
  if (!userMsgs.length || userMsgs[0].role !== 'user') throw new HttpError(400, 'Se requiere un mensaje de usuario.')
  await spend()
  const response = await getAnthropic().messages.create({
    model: CLAUDE_MODEL, max_tokens: max_tokens as number,
    ...(system ? { system } : {}), messages: userMsgs,
  })
  const content = response.content.filter(c => c.type === 'text').map(c => c.text).join('\n')
  return { choices: [{ message: { content } }] }
})
