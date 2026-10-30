/**
 * aiProxy — Migración del proxy OpenAI → Claude API
 *
 * Acepta requests en formato OpenAI (messages[], model, temperature, max_tokens, response_format?)
 * y los traduce a Claude, devolviendo la respuesta en formato OpenAI para que
 * el frontend no necesite cambios en las funciones existentes.
 */
import Anthropic from '@anthropic-ai/sdk'

let anthropic: Anthropic;
const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001'

function getAnthropic() {
  if (!anthropic) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return anthropic;
}

function cors(res: any) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export async function handleAiProxy(req: any, res: any) {
  cors(res)
  if (req.method === 'OPTIONS') { res.status(204).send(''); return }
  if (req.method !== 'POST') { res.status(405).send('Method Not Allowed'); return }

  try {
    const { messages = [], max_tokens = 1000 } = req.body as {
      messages: { role: string; content: string }[]
      max_tokens?: number
    }

    // Separate system from user/assistant messages
    const system = messages.find(m => m.role === 'system')?.content
    const userMsgs = messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const response = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens,
      ...(system ? { system } : {}),
      messages: userMsgs,
    })

    // Return in OpenAI-compatible format — frontend stays unchanged
    const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
    res.json({ choices: [{ message: { content: text } }] })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[aiProxy]', msg)
    res.status(500).json({ error: msg })
  }
}
