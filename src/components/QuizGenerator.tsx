import { useState } from 'react'
import { Sparkles, Loader2, CheckCircle2, RefreshCw, X } from 'lucide-react'
import { generateQuiz, isDemoAI } from '../lib/ai'

interface Props {
    blockContent: string
    courseTitle: string
    onInsert: (quiz: { titulo: string; preguntas: unknown[] }) => void
    onClose: () => void
}

export function QuizGenerator({ blockContent, courseTitle, onInsert, onClose }: Props) {
    const [loading, setLoading] = useState(false)
    const [quiz, setQuiz] = useState<{ titulo: string; preguntas: unknown[] } | null>(null)
    const [error, setError] = useState('')
    const [numQ, setNumQ] = useState(4)

    const handleGenerate = async () => {
        setLoading(true)
        setError('')
        setQuiz(null)
        try {
            const result = await generateQuiz(blockContent, courseTitle, numQ)
            setQuiz(result)
        } catch {
            setError('Error al generar el quiz. Revisa tu conexión o API key.')
        } finally {
            setLoading(false)
        }
    }

    const preguntas = (quiz?.preguntas as any[]) || []

    return (
        <div className="bg-gradient-to-br from-orange/5 to-cobalt/5 border-2 border-orange/20 rounded-2xl p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-orange/10 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-orange" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-graphite">Generador de Quiz IA</h3>
                        <p className="text-xs text-graphite/40">
                            {isDemoAI ? 'Modo demo — IA simulada' : 'GPT-4o analizará el contenido'}
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="text-graphite/30 hover:text-graphite transition-colors p-1">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {!quiz && !loading && (
                <div className="space-y-4">
                    <div className="bg-white/80 rounded-xl p-4 border border-graphite/5">
                        <p className="text-sm text-graphite/60 leading-relaxed">
                            La IA analizará el texto de este bloque y generará preguntas de evaluación con opciones y respuestas correctas marcadas. Solo revisa y ajusta antes de guardar.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-graphite/60 whitespace-nowrap">Número de preguntas:</label>
                        <div className="flex gap-1">
                            {[2, 3, 4, 5, 6].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setNumQ(n)}
                                    className={`w-9 h-9 rounded-xl text-sm font-mono transition-all ${numQ === n
                                            ? 'bg-orange text-white shadow-[0_4px_14px_rgba(224,122,95,0.3)]'
                                            : 'bg-white border border-graphite/10 text-graphite/60 hover:border-orange/30'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        className="btn-primary w-full justify-center gap-2 py-3"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generar Quiz con IA
                    </button>
                    {error && (
                        <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm">{error}</div>
                    )}
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                    <div className="w-12 h-12 bg-orange/10 rounded-2xl flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-orange animate-spin" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-graphite">Analizando contenido...</p>
                        <p className="text-xs text-graphite/40 mt-1">La IA está generando tu quiz</p>
                    </div>
                </div>
            )}

            {quiz && (
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-green-200 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <h4 className="text-sm font-semibold text-graphite">{quiz.titulo}</h4>
                        </div>
                        <div className="space-y-2.5">
                            {preguntas.map((p: any, i: number) => (
                                <div key={p.id} className="text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-graphite/30 font-mono text-xs mt-0.5">{i + 1}.</span>
                                        <div className="flex-1">
                                            <p className="text-graphite font-medium leading-snug">{p.texto}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${p.tipo === 'abierta'
                                                        ? 'bg-cobalt/10 text-cobalt'
                                                        : 'bg-orange/10 text-orange'
                                                    }`}>
                                                    {p.tipo === 'abierta' ? 'Abierta' : 'Opción múltiple'}
                                                </span>
                                                <span className="text-xs text-graphite/30 font-mono">{p.puntos} pts</span>
                                                {p.tipo === 'opcion_multiple' && p.opciones && (
                                                    <span className="text-xs text-green-600">
                                                        ✓ Respuesta marcada
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-graphite/40 text-center">
                        Puedes editar las preguntas después de insertar el bloque
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleGenerate}
                            className="btn-secondary flex items-center gap-2 flex-1 justify-center"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Regenerar
                        </button>
                        <button
                            onClick={() => { onInsert(quiz); onClose() }}
                            className="btn-primary flex items-center gap-2 flex-1 justify-center"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Insertar quiz
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
