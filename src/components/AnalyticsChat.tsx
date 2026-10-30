import { authenticatedFetch } from '../lib/http'
/**
 * SP3 — Analytics Chat para Maestros
 *
 * Panel colapsable en el Dashboard. El maestro escribe una pregunta en NL
 * y Claude responde usando datos reales de sus grupos.
 */
import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Loader2, BrainCircuit, ChevronDown, ChevronUp } from 'lucide-react'

const AI_CLAUDE_URL = import.meta.env.VITE_AI_CLAUDE_URL || ''

interface Message {
  role: 'user' | 'assistant'
  text: string
}

const SUGGESTIONS = [
  '¿Quién tiene el promedio más bajo?',
  '¿Cuántas evaluaciones están pendientes de calificar?',
  '¿Qué alumno ha entregado más evaluaciones?',
  '¿Cuál es el promedio general de mis grupos?',
]

interface Props {
  maestroId: string
}

export function AnalyticsChat({ maestroId }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!AI_CLAUDE_URL) return null

  const sendQuery = async (query: string) => {
    if (!query.trim() || loading) return
    const userMsg: Message = { role: 'user', text: query.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await authenticatedFetch(`${AI_CLAUDE_URL}/queryClassDataFn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), maestroId }),
      })
      const data = await res.json()
      const answer = data.answer || 'No pude obtener una respuesta.'
      setMessages(prev => [...prev, { role: 'assistant', text: answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error al conectar con el asistente. Intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-graphite/5 overflow-hidden">
      {/* Header (toggle) */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full p-5 flex items-center justify-between hover:bg-cream/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cobalt/10 rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-cobalt" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-graphite text-sm">Consulta tus datos con IA</h3>
            <p className="text-xs text-graphite/40">Pregunta en español sobre tu clase</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-graphite/30" /> : <ChevronDown className="w-4 h-4 text-graphite/30" />}
      </button>

      {open && (
        <div className="border-t border-graphite/5">
          {/* Suggestions */}
          {messages.length === 0 && (
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs text-graphite/40 mb-2">Sugerencias:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendQuery(s)}
                    className="text-xs px-2.5 py-1.5 rounded-full bg-cobalt/8 text-cobalt hover:bg-cobalt/15 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="px-4 py-3 space-y-3 max-h-60 overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-cobalt text-white'
                      : 'bg-cream text-graphite'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-cream px-3 py-2 rounded-xl flex items-center gap-2 text-sm text-graphite/50">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Analizando datos…
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-graphite/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendQuery(input)}
              placeholder="Escribe tu pregunta…"
              className="flex-1 px-3 py-2 rounded-xl bg-cream border border-graphite/8 text-sm text-graphite placeholder:text-graphite/30 focus:outline-none focus:ring-2 focus:ring-cobalt/30"
            />
            <button
              onClick={() => sendQuery(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-cobalt text-white rounded-xl flex items-center justify-center hover:bg-cobalt/90 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
