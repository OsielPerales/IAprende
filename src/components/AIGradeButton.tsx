/**
 * SP1 — Botón "Calificar con IA" para el Gradebook
 *
 * Solo visible cuando la respuesta tiene preguntas abiertas y calificacion === null.
 * Llama al Cloud Function autoGradeRespuestaFn y pre-llena el campo editable.
 * El maestro siempre debe confirmar con Save.
 */
import { useState } from 'react'
import { BrainCircuit, Loader2 } from 'lucide-react'

const AI_CLAUDE_URL = import.meta.env.VITE_AI_CLAUDE_URL || ''

interface AIGradeResult {
  score: number
  feedback: string
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
}

interface Props {
  respuestaId: string
  /** Called when AI returns a suggestion so the parent can prefill the input */
  onSuggestion: (score: number, feedback: string, confidence: AIGradeResult['confidence']) => void
}

const CONFIDENCE_LABEL: Record<AIGradeResult['confidence'], string> = {
  high: '✓ Alta confianza',
  medium: '~ Confianza media',
  low: '⚠ Baja confianza',
}
const CONFIDENCE_COLOR: Record<AIGradeResult['confidence'], string> = {
  high: 'text-green-600',
  medium: 'text-orange',
  low: 'text-red-400',
}

export function AIGradeButton({ respuestaId, onSuggestion }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AIGradeResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!AI_CLAUDE_URL) return null

  const handleGrade = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${AI_CLAUDE_URL}/autoGradeRespuestaFn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respuestaId }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data: AIGradeResult = await res.json()
      setResult(data)
      onSuggestion(data.score, data.feedback, data.confidence)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al calificar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleGrade}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cobalt/10 text-cobalt hover:bg-cobalt/20 transition-colors text-xs font-medium disabled:opacity-50"
        title="Calificar con IA (Claude)"
      >
        {loading
          ? <Loader2 className="w-3 h-3 animate-spin" />
          : <BrainCircuit className="w-3 h-3" />
        }
        {loading ? 'Analizando…' : 'IA'}
      </button>

      {result && (
        <div className="text-xs text-right">
          <span className={`font-medium ${CONFIDENCE_COLOR[result.confidence]}`}>
            {CONFIDENCE_LABEL[result.confidence]}
          </span>
          {result.reasoning && (
            <div className="text-graphite/40 max-w-[180px] truncate" title={result.reasoning}>
              {result.reasoning}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-xs text-red-400">{error}</div>
      )}
    </div>
  )
}
