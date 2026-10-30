import { useState } from 'react'
import { Sparkles, Loader2, Code2, RefreshCw, CheckCircle2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { generateSimulator, isDemoAI, type GeneratedSimulator } from '../lib/ai'

interface Props {
    courseTitle: string
    contextContent?: string   // optional text from other blocks
    onInsert: (sim: GeneratedSimulator) => void
    onClose: () => void
}

export function SimulatorGenerator({ courseTitle, contextContent = '', onInsert, onClose }: Props) {
    const [topic, setTopic] = useState('')
    const [loading, setLoading] = useState(false)
    const [sim, setSim] = useState<GeneratedSimulator | null>(null)
    const [error, setError] = useState('')
    const [previewOpen, setPreviewOpen] = useState(true)

    const handleGenerate = async () => {
        if (!topic.trim()) return
        setLoading(true)
        setError('')
        setSim(null)
        try {
            const result = await generateSimulator(topic, contextContent, courseTitle)
            setSim(result)
            setPreviewOpen(true)
        } catch {
            setError('No se pudo generar el simulador. Intenta con un tema más específico.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-soft border border-purple-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-50 to-cobalt/5 border-b border-purple-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Code2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-graphite">Generador de Simuladores IA</h3>
                        <p className="text-xs text-graphite/40">
                            {isDemoAI ? 'Modo demo — simulador interactivo de ejemplo' : 'IA generará un simulador HTML completo'}
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="p-1.5 text-graphite/30 hover:text-graphite rounded-lg hover:bg-graphite/5 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-5 space-y-4">
                {/* Topic input */}
                {!sim && !loading && (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1.5">
                                ¿Sobre qué tema quieres el simulador?
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                className="w-full px-4 py-3 rounded-xl bg-cream border border-graphite/10 text-graphite text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
                                placeholder='Ej: "Toma de decisiones ante alarmas", "Lectura de indicadores CNC", "Protocolo de seguridad"'
                                autoFocus
                            />
                        </div>
                        {contextContent && (
                            <p className="text-xs text-graphite/40 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                                Usará el contenido del curso como contexto adicional
                            </p>
                        )}
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        <div className="flex gap-2">
                            <button
                                onClick={handleGenerate}
                                disabled={!topic.trim()}
                                className="btn-primary gap-2 disabled:opacity-40 disabled:cursor-not-allowed flex-1"
                            >
                                <Sparkles className="w-4 h-4" />
                                Generar Simulador IA
                            </button>
                        </div>

                        {/* Examples */}
                        <div>
                            <p className="text-xs text-graphite/30 mb-2">Sugerencias rápidas:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    'Diagnóstico de fallas industriales',
                                    'Protocolos de seguridad',
                                    'Lectura de dashboards de producción',
                                    'Control de calidad paso a paso',
                                    'Toma de decisiones bajo presión',
                                ].map((sugg) => (
                                    <button
                                        key={sugg}
                                        onClick={() => setTopic(sugg)}
                                        className="text-xs px-3 py-1.5 bg-graphite/5 hover:bg-purple-50 text-graphite/60 hover:text-purple-700 rounded-lg border border-graphite/5 hover:border-purple-200 transition-all"
                                    >
                                        {sugg}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                        <div className="text-center">
                            <p className="text-sm font-medium text-graphite">Generando simulador interactivo…</p>
                            <p className="text-xs text-graphite/40 mt-1">
                                {isDemoAI ? 'Cargando demo…' : 'La IA está construyendo el código HTML (~30s)'}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            {['Diseñando escenario', 'Codificando interacciones', 'Añadiendo feedback'].map((step, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.4}s` }}>
                                    {step}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Preview */}
                {sim && !loading && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium text-graphite">{sim.titulo}</span>
                            </div>
                            <button
                                onClick={() => setPreviewOpen(!previewOpen)}
                                className="btn-ghost p-1.5 text-graphite/40"
                            >
                                {previewOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>

                        <p className="text-xs text-graphite/50 bg-cobalt/5 rounded-xl px-3 py-2">{sim.instrucciones}</p>

                        {previewOpen && (
                            <div className="rounded-xl overflow-hidden border border-graphite/10">
                                <div className="bg-graphite/5 px-3 py-1.5 flex items-center gap-2 text-xs text-graphite/40">
                                    <span className="w-2 h-2 rounded-full bg-red-300" />
                                    <span className="w-2 h-2 rounded-full bg-yellow-300" />
                                    <span className="w-2 h-2 rounded-full bg-green-300" />
                                    <span className="ml-2">Vista previa — simulador interactivo</span>
                                </div>
                                <iframe
                                    srcDoc={sim.html}
                                    sandbox="allow-scripts"
                                    className="w-full border-0"
                                    style={{ height: `${sim.altura_px}px` }}
                                    title="Preview del simulador"
                                />
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={() => onInsert(sim)}
                                className="btn-primary gap-2 flex-1"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Insertar en el curso
                            </button>
                            <button
                                onClick={() => { setSim(null) }}
                                className="btn-secondary gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Cambiar tema
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
