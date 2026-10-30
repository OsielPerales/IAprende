/**
 * SP4 — Tarjeta de Brechas de Conocimiento para el Dashboard del Alumno
 *
 * Lee de alumno_analytics/{alumnoId} en Firestore (vía Zustand store).
 * Muestra gaps, fortalezas y temas prioritarios.
 * También tiene un botón para regenerar el análisis manualmente.
 */
import { useState } from 'react'
import { BrainCircuit, TrendingUp, TrendingDown, Target, RefreshCw, Loader2 } from 'lucide-react'
import type { AlumnoAnalytics } from '../types'

const AI_CLAUDE_URL = import.meta.env.VITE_AI_CLAUDE_URL || ''

interface Props {
  alumnoId: string
  analytics: AlumnoAnalytics | null
  onRefresh: (data: AlumnoAnalytics) => void
}

export function KnowledgeGapCard({ alumnoId, analytics, onRefresh }: Props) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (!AI_CLAUDE_URL || refreshing) return
    setRefreshing(true)
    try {
      const res = await fetch(`${AI_CLAUDE_URL}/detectKnowledgeGapsFn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alumnoId }),
      })
      if (res.ok) {
        const data: AlumnoAnalytics = await res.json()
        onRefresh(data)
      }
    } catch {
      // Silently fail — analytics are non-critical
    } finally {
      setRefreshing(false)
    }
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-soft border border-graphite/5">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="w-5 h-5 text-cobalt" />
          <h3 className="font-medium text-graphite text-sm">Análisis de aprendizaje</h3>
        </div>
        <p className="text-xs text-graphite/40 font-mono">
          Completa tu primera evaluación para ver tu análisis personalizado.
        </p>
        {AI_CLAUDE_URL && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-3 flex items-center gap-1.5 text-xs text-cobalt hover:text-cobalt/70 transition-colors disabled:opacity-50"
          >
            {refreshing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Analizar ahora
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft border border-graphite/5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cobalt/10 rounded-lg flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-cobalt" />
          </div>
          <h3 className="font-medium text-graphite text-sm">Tu análisis de aprendizaje</h3>
        </div>
        {AI_CLAUDE_URL && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 rounded-lg hover:bg-graphite/5 text-graphite/30 hover:text-graphite/60 transition-colors disabled:opacity-50"
            title="Actualizar análisis"
          >
            {refreshing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Summary */}
      <p className="text-xs text-graphite/60 leading-relaxed bg-cobalt/5 rounded-xl p-3">
        {analytics.summary}
      </p>

      <div className="grid grid-cols-1 gap-3">
        {/* Priority topics */}
        {analytics.priorityTopics.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Target className="w-3.5 h-3.5 text-orange" />
              <span className="text-xs font-medium text-graphite">Temas prioritarios</span>
            </div>
            <ul className="space-y-1">
              {analytics.priorityTopics.slice(0, 3).map((t, i) => (
                <li key={i} className="text-xs text-graphite/70 flex items-start gap-1.5">
                  <span className="font-mono text-orange mt-px">{i + 1}.</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {/* Gaps */}
          {analytics.gaps.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs font-medium text-graphite">Áreas de mejora</span>
              </div>
              <ul className="space-y-1">
                {analytics.gaps.slice(0, 3).map((g, i) => (
                  <li key={i} className="text-xs text-graphite/60 flex items-start gap-1">
                    <span className="text-red-300 mt-px">•</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths */}
          {analytics.strengths.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs font-medium text-graphite">Fortalezas</span>
              </div>
              <ul className="space-y-1">
                {analytics.strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-xs text-graphite/60 flex items-start gap-1">
                    <span className="text-green-400 mt-px">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {analytics.updatedAt && (
        <p className="text-[10px] text-graphite/25 font-mono">
          Actualizado: {new Date(analytics.updatedAt).toLocaleDateString('es-MX')}
        </p>
      )}
    </div>
  )
}
