import { authenticatedFetch } from '../../lib/http'
import { useState, useEffect } from 'react'
import { Save, CheckCircle2, Loader2, Zap, Star } from 'lucide-react'
import { AI_CLAUDE_URL } from '../../lib/ai'
import type { ProgresoAlumno } from '../../types'

interface ContenidoSimuladorPrompt {
    titulo: string
    instrucciones?: string
    rubrica_sistema?: string
}

interface Props {
    contenido: ContenidoSimuladorPrompt
    progreso?: ProgresoAlumno | null
    onProgresoUpdate?: (field: keyof ProgresoAlumno, value: unknown) => void
    isEditor?: boolean
}

const SECCIONES = [
    {
        key: 'rol',
        label: 'ROL',
        desc: 'Profesión + Especialidad + Experiencia + Contexto',
        border: 'border-cobalt/40',
        bg: 'bg-cobalt/5',
        badge: 'bg-cobalt',
        placeholder: 'Actúa como un [profesión] con [N] años de experiencia en [especialidad]...',
    },
    {
        key: 'contexto',
        label: 'CONTEXTO',
        desc: 'Empresa, clientes, situación — sin datos personales reales',
        border: 'border-green-400/50',
        bg: 'bg-green-50',
        badge: 'bg-green-600',
        placeholder: 'Mi empresa se llama [nombre ficticio], somos una [tipo de negocio]...',
    },
    {
        key: 'instruccion',
        label: 'INSTRUCCIÓN',
        desc: 'Empieza con un verbo fuerte: Genera, Redacta, Analiza...',
        border: 'border-orange/40',
        bg: 'bg-orange/5',
        badge: 'bg-orange',
        placeholder: 'Genera / Redacta / Analiza / Sintetiza...',
    },
    {
        key: 'restricciones',
        label: 'RESTRICCIONES',
        desc: 'Longitud, tono, exclusiones, idioma',
        border: 'border-red-300/50',
        bg: 'bg-red-50/50',
        badge: 'bg-red-500',
        placeholder: 'No excedas X palabras. Tono [formal/cercano]. Sin [X]. En español de México.',
    },
    {
        key: 'formato',
        label: 'FORMATO',
        desc: 'Lista, tabla, correo, Markdown, JSON...',
        border: 'border-purple-300/50',
        bg: 'bg-purple-50/50',
        badge: 'bg-purple-600',
        placeholder: 'Presenta como [lista numerada / tabla / correo con asunto]...',
    },
] as const

type SectionKey = typeof SECCIONES[number]['key']

interface EvalResult {
    score: number
    feedback: string
    componentes?: Record<string, boolean>
}

export function BloqueSimuladorPrompt({ contenido: c, progreso, onProgresoUpdate, isEditor }: Props) {
    const [secciones, setSecciones] = useState<Record<SectionKey, string>>({
        rol: '',
        contexto: '',
        instruccion: '',
        restricciones: '',
        formato: '',
    })
    const [evaluacion, setEvaluacion] = useState<EvalResult | null>(null)
    const [respuestaIA, setRespuestaIA] = useState<string>('')
    const [loading, setLoading] = useState<'evaluando' | 'ejecutando' | 'guardando' | null>(null)
    const [guardado, setGuardado] = useState(false)

    // Pre-load ROL and CONTEXTO from progreso
    useEffect(() => {
        if (progreso?.rol_construido && !secciones.rol) {
            setSecciones(s => ({ ...s, rol: progreso.rol_construido }))
        }
        if (progreso?.contexto_construido && !secciones.contexto) {
            setSecciones(s => ({ ...s, contexto: progreso.contexto_construido }))
        }
    }, [progreso])

    const assemblePrompt = () =>
        `ROL: ${secciones.rol}\n\nCONTEXTO: ${secciones.contexto}\n\nINSTRUCCIÓN: ${secciones.instruccion}\n\nRESTRICCIONES: ${secciones.restricciones}\n\nFORMATO: ${secciones.formato}`

    const handleEvaluar = async () => {
        setLoading('evaluando')
        setEvaluacion(null)
        try {
            if (AI_CLAUDE_URL) {
                const res = await authenticatedFetch(`${AI_CLAUDE_URL}/evaluatePromptFn`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: assemblePrompt(), rubrica: c.rubrica_sistema }),
                })
                if (res.ok) {
                    const data = await res.json()
                    setEvaluacion(data)
                    setLoading(null)
                    return
                }
            }
            // Demo fallback
            await new Promise(r => setTimeout(r, 900))
            const score = [secciones.rol, secciones.contexto, secciones.instruccion, secciones.restricciones, secciones.formato]
                .filter(s => s.trim().length > 15).length
            setEvaluacion({
                score,
                feedback: score >= 4
                    ? 'Modo demo. Excelente estructura. Todos los componentes están bien definidos. Tu prompt está listo para producir resultados de alta calidad.'
                    : `Modo demo. Tu prompt tiene ${score}/5 componentes. ${score < 3 ? 'Enfócate en completar ROL, CONTEXTO e INSTRUCCIÓN con más detalle.' : 'Refuerza los componentes que faltan para maximizar la precisión.'}`,
            })
        } catch {
            setEvaluacion({ score: 0, feedback: 'Error al evaluar. Revisa la conexión.' })
        }
        setLoading(null)
    }

    const handleEjecutar = async () => {
        setLoading('ejecutando')
        setRespuestaIA('')
        try {
            if (AI_CLAUDE_URL) {
                const res = await authenticatedFetch(`${AI_CLAUDE_URL}/executePromptFn`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: assemblePrompt() }),
                })
                if (res.ok) {
                    const data = await res.json()
                    setRespuestaIA(data.response || data.text || JSON.stringify(data))
                    setLoading(null)
                    return
                }
            }
            // Demo fallback
            await new Promise(r => setTimeout(r, 1200))
            setRespuestaIA(`[Modo Demo — Vista previa de respuesta]\n\nBasado en tu prompt, una respuesta real incluiría:\n\n• Análisis del proceso "${secciones.instruccion.substring(0, 60)}..."\n• Recomendaciones específicas para el contexto descrito\n• Estructura en el formato solicitado\n\nPara obtener una respuesta real, configura VITE_AI_CLAUDE_URL en tu entorno.`)
        } catch {
            setRespuestaIA('Error al ejecutar. Revisa la conexión.')
        }
        setLoading(null)
    }

    const handleGuardar = async () => {
        if (!onProgresoUpdate || isEditor) return
        setLoading('guardando')
        onProgresoUpdate('prompt_maestro', assemblePrompt())
        await new Promise(r => setTimeout(r, 400))
        setGuardado(true)
        setLoading(null)
        setTimeout(() => setGuardado(false), 2500)
    }

    const isEmpty = !secciones.rol.trim() && !secciones.instruccion.trim()

    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange" />
                <h3 className="font-serif text-xl text-graphite">{c.titulo}</h3>
            </div>
            {c.instrucciones && (
                <p className="text-sm text-graphite/50 mb-5">{c.instrucciones}</p>
            )}

            {/* 5-section editor */}
            <div className="space-y-3">
                {SECCIONES.map((sec) => (
                    <div key={sec.key} className={`rounded-xl border-2 ${sec.border} ${sec.bg} overflow-hidden`}>
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-graphite/5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-white text-xs font-bold ${sec.badge}`}>
                                {sec.label}
                            </span>
                            <span className="text-xs text-graphite/40">{sec.desc}</span>
                        </div>
                        <textarea
                            value={secciones[sec.key]}
                            onChange={(e) => setSecciones(s => ({ ...s, [sec.key]: e.target.value }))}
                            disabled={isEditor}
                            placeholder={sec.placeholder}
                            rows={3}
                            className="w-full px-4 py-3 bg-transparent text-sm text-graphite placeholder:text-graphite/25 focus:outline-none resize-none"
                        />
                    </div>
                ))}
            </div>

            {/* Action buttons */}
            {!isEditor && (
                <div className="flex flex-wrap gap-3 mt-5">
                    <button
                        onClick={handleEvaluar}
                        disabled={loading !== null || isEmpty}
                        className="flex items-center gap-2 px-4 py-2.5 bg-cobalt text-white rounded-xl text-sm font-medium hover:bg-cobalt/90 disabled:opacity-40 transition-all"
                    >
                        {loading === 'evaluando' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                        Evaluar mi prompt
                    </button>
                    <button
                        onClick={handleEjecutar}
                        disabled={loading !== null || isEmpty}
                        className="flex items-center gap-2 px-4 py-2.5 bg-orange text-white rounded-xl text-sm font-medium hover:bg-orange-light disabled:opacity-40 transition-all"
                    >
                        {loading === 'ejecutando' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        Ejecutar en IA
                    </button>
                    <button
                        onClick={handleGuardar}
                        disabled={loading !== null || isEmpty}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 transition-all ${
                            guardado ? 'bg-green-100 text-green-700' : 'bg-graphite/10 text-graphite hover:bg-graphite/15'
                        }`}
                    >
                        {loading === 'guardando' ? <Loader2 className="w-4 h-4 animate-spin" /> : guardado ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {guardado ? 'Guardado' : 'Guardar mi prompt'}
                    </button>
                </div>
            )}

            {/* Evaluation result */}
            {evaluacion && (
                <div className="mt-5 p-4 bg-white border-2 border-cobalt/20 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-medium text-graphite">Puntuación:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(n => (
                                <div
                                    key={n}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        n <= evaluacion.score
                                            ? 'bg-orange text-white'
                                            : 'bg-graphite/10 text-graphite/30'
                                    }`}
                                >
                                    {n}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-bold text-orange">{evaluacion.score}/5</span>
                    </div>
                    <p className="text-sm text-graphite/80 leading-relaxed">{evaluacion.feedback}</p>
                    {evaluacion.componentes && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {Object.entries(evaluacion.componentes).map(([k, ok]) => (
                                <span
                                    key={k}
                                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                                >
                                    {ok ? '✓' : '✗'} {k.toUpperCase()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* AI response */}
            {respuestaIA && (
                <div className="mt-4">
                    <p className="text-xs font-semibold text-graphite/40 uppercase tracking-wide mb-2">Respuesta de la IA</p>
                    <div className="bg-cream border border-graphite/10 rounded-xl p-4 text-sm text-graphite whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
                        {respuestaIA}
                    </div>
                </div>
            )}
        </div>
    )
}
