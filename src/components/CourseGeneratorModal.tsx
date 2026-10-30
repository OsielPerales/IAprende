/**
 * SP2 — Modal de Generación de Cursos desde Lenguaje Natural
 *
 * El maestro describe el tema y el contexto industrial.
 * Claude genera la estructura completa del curso y lo guarda en Firestore.
 * Al terminar navega al editor del nuevo curso.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wand2, X, Loader2, Sparkles } from 'lucide-react'

const AI_CLAUDE_URL = import.meta.env.VITE_AI_CLAUDE_URL || ''

interface Props {
  maestroId: string
  onClose: () => void
}

export function CourseGeneratorModal({ maestroId, onClose }: Props) {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [context, setContext] = useState('')
  const [numBloques, setNumBloques] = useState(4)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${AI_CLAUDE_URL}/generateCourseFromTopicFn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          industryContext: context.trim() || 'capacitación industrial general',
          maestroId,
          numBloques,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Error ${res.status}`)
      }
      const { cursoId } = await res.json()
      onClose()
      navigate(`/maestro/curso/${cursoId}/editar`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al generar el curso')
    } finally {
      setLoading(false)
    }
  }

  if (!AI_CLAUDE_URL) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-cobalt/10 rounded-xl flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-cobalt" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-graphite">Generar curso con IA</h2>
              <p className="text-xs text-graphite/40">Claude creará la estructura completa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-graphite/5 rounded-lg">
            <X className="w-5 h-5 text-graphite/40" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-graphite mb-1.5">
              Tema del curso <span className="text-orange">*</span>
            </label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Ej: Seguridad en el manejo de productos químicos peligrosos…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-graphite/10 bg-cream text-sm text-graphite placeholder:text-graphite/30 focus:outline-none focus:ring-2 focus:ring-cobalt/30 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite mb-1.5">
              Contexto industrial
            </label>
            <input
              type="text"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Ej: planta de manufactura de plásticos, turno nocturno…"
              className="w-full px-3 py-2.5 rounded-xl border border-graphite/10 bg-cream text-sm text-graphite placeholder:text-graphite/30 focus:outline-none focus:ring-2 focus:ring-cobalt/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite mb-1.5">
              Número de módulos
            </label>
            <select
              value={numBloques}
              onChange={e => setNumBloques(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-graphite/10 bg-cream text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-cobalt/30"
            >
              {[3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} módulos ({n - 1} de contenido + 1 quiz)</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 rounded-xl text-sm text-red-600">{error}</div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-graphite/10 text-graphite/60 text-sm hover:bg-graphite/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="flex-1 py-2.5 rounded-xl bg-cobalt text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-cobalt/90 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generar curso
              </>
            )}
          </button>
        </div>

        {loading && (
          <p className="text-xs text-center text-graphite/40">
            Claude está diseñando tu curso… esto tarda ~30 segundos
          </p>
        )}
      </div>
    </div>
  )
}
