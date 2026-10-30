import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Star, ArrowRight, RotateCcw, BrainCircuit } from 'lucide-react'
import { getAdaptiveRecommendation, type AdaptiveRecommendation } from '../lib/ai'

interface Props {
    alumnoId?: string
    cursoId?: string
    score: number
    courseTitle: string
    quizTitle: string
    wrongTopics?: string[]
    onContinue?: () => void
    onRetry?: () => void
}

const NIVEL_CONFIG = {
    excelente: {
        icon: Star,
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        border: 'border-green-200',
        iconColor: 'text-green-500',
        badge: 'bg-green-100 text-green-700',
        barColor: 'bg-green-400',
    },
    bueno: {
        icon: TrendingUp,
        bg: 'bg-gradient-to-br from-blue-50 to-cobalt/5',
        border: 'border-cobalt/20',
        iconColor: 'text-cobalt',
        badge: 'bg-cobalt/10 text-cobalt',
        barColor: 'bg-cobalt',
    },
    reforzar: {
        icon: AlertTriangle,
        bg: 'bg-gradient-to-br from-orange/5 to-amber-50',
        border: 'border-orange/20',
        iconColor: 'text-orange',
        badge: 'bg-orange/10 text-orange',
        barColor: 'bg-orange',
    },
    repasar: {
        icon: TrendingDown,
        bg: 'bg-gradient-to-br from-red-50 to-rose-50',
        border: 'border-red-200',
        iconColor: 'text-red-400',
        badge: 'bg-red-50 text-red-600',
        barColor: 'bg-red-400',
    },
}

export function AdaptiveResult({ score, courseTitle, quizTitle, wrongTopics = [], onContinue, onRetry, alumnoId, cursoId }: Props) {
    const [rec, setRec] = useState<AdaptiveRecommendation | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAdaptiveRecommendation(score, courseTitle, quizTitle, wrongTopics, alumnoId, cursoId)
            .then(setRec)
            .finally(() => setLoading(false))
    }, [score, courseTitle, quizTitle, alumnoId, cursoId])

    if (loading) {
        return (
            <div className="flex items-center gap-2 p-4 text-sm text-graphite/50">
                <BrainCircuit className="w-4 h-4 animate-pulse text-cobalt" />
                Analizando tu resultado…
            </div>
        )
    }

    if (!rec) return null

    const conf = NIVEL_CONFIG[rec.nivel]
    const IconComp = conf.icon

    return (
        <div className={`rounded-2xl border p-5 ${conf.bg} ${conf.border} space-y-4`}>
            {/* Score header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/70 ${conf.iconColor}`}>
                        <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${conf.badge}`}>
                            {rec.nivel === 'excelente' ? '🌟 Excelente' :
                                rec.nivel === 'bueno' ? '👍 Buen resultado' :
                                    rec.nivel === 'reforzar' ? '⚡ A reforzar' : '🔄 Repasar'}
                        </span>
                    </div>
                </div>
                <div className="text-3xl font-serif font-bold text-graphite">{score}%</div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${conf.barColor}`}
                    style={{ width: `${score}%` }}
                />
            </div>

            {/* Message */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-graphite">{rec.mensaje}</p>
                <div className="flex items-start gap-2 bg-white/60 rounded-xl p-3">
                    <BrainCircuit className="w-4 h-4 text-cobalt mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-graphite/70">{rec.accion}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {onContinue && (rec.nivel === 'excelente' || rec.nivel === 'bueno') && (
                    <button
                        onClick={onContinue}
                        className="btn-primary gap-2 flex-1"
                    >
                        Continuar
                        <ArrowRight className="w-4 h-4" />
                    </button>
                )}
                {onRetry && (rec.nivel === 'reforzar' || rec.nivel === 'repasar') && (
                    <button
                        onClick={onRetry}
                        className="btn-secondary gap-2 flex-1"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Repasar módulo
                    </button>
                )}
                {onContinue && (
                    <button onClick={onContinue} className="btn-ghost text-sm text-graphite/50 gap-1">
                        {rec.nivel === 'excelente' || rec.nivel === 'bueno' ? '' : 'Continuar de todas formas'}
                        {(rec.nivel === 'reforzar' || rec.nivel === 'repasar') && <ArrowRight className="w-3 h-3" />}
                    </button>
                )}
            </div>
        </div>
    )
}
