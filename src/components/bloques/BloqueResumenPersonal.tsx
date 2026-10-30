import { Copy, CheckCircle2, User } from 'lucide-react'
import { useState } from 'react'
import type { ProgresoAlumno } from '../../types'

interface ContenidoResumenPersonal {
    titulo: string
    descripcion?: string
}

interface Props {
    contenido: ContenidoResumenPersonal
    progreso?: ProgresoAlumno | null
    isEditor?: boolean
}

export function BloqueResumenPersonal({ contenido: c, progreso, isEditor }: Props) {
    const [copied, setCopied] = useState(false)

    const hasData = progreso && (progreso.rol_construido || progreso.contexto_construido || progreso.prompt_maestro)

    const fullText = progreso
        ? `MI PROMPT MAESTRO\n${'─'.repeat(40)}\n\nROL:\n${progreso.rol_construido || '(no completado)'}\n\nCONTEXTO:\n${progreso.contexto_construido || '(no completado)'}\n\nPROMPT MAESTRO COMPLETO:\n${progreso.prompt_maestro || '(no guardado)'}`
        : ''

    const handleCopy = () => {
        if (!fullText) return
        navigator.clipboard.writeText(fullText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-cobalt" />
                <h3 className="font-serif text-xl text-graphite">{c.titulo}</h3>
            </div>
            {c.descripcion && <p className="text-sm text-graphite/50 mb-5">{c.descripcion}</p>}

            {isEditor || !hasData ? (
                <div className="bg-cream border-2 border-dashed border-graphite/15 rounded-2xl p-8 text-center">
                    <User className="w-8 h-8 text-graphite/20 mx-auto mb-3" />
                    <p className="text-sm text-graphite/40">
                        {isEditor
                            ? 'Este bloque mostrará el resumen personalizado del alumno basado en su progreso durante el curso.'
                            : 'Completa los bloques de ROL, CONTEXTO y el Simulador de Prompt para ver tu resumen aquí.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* ROL */}
                    {progreso.rol_construido && (
                        <div className="rounded-xl overflow-hidden border-2 border-cobalt/20">
                            <div className="bg-cobalt px-4 py-2 flex items-center gap-2">
                                <span className="text-white text-xs font-bold">ROL</span>
                                <span className="text-white/60 text-xs">Tu identidad asignada a la IA</span>
                            </div>
                            <div className="bg-cobalt/5 px-4 py-3">
                                <p className="text-sm text-graphite leading-relaxed">{progreso.rol_construido}</p>
                            </div>
                        </div>
                    )}

                    {/* CONTEXTO */}
                    {progreso.contexto_construido && (
                        <div className="rounded-xl overflow-hidden border-2 border-green-300/40">
                            <div className="bg-green-600 px-4 py-2 flex items-center gap-2">
                                <span className="text-white text-xs font-bold">CONTEXTO</span>
                                <span className="text-white/60 text-xs">Tu mesa de trabajo</span>
                            </div>
                            <div className="bg-green-50 px-4 py-3">
                                <p className="text-sm text-graphite leading-relaxed">{progreso.contexto_construido}</p>
                            </div>
                        </div>
                    )}

                    {/* Prompt Maestro completo */}
                    {progreso.prompt_maestro ? (
                        <div className="rounded-xl overflow-hidden border-2 border-orange/20">
                            <div className="bg-orange px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-xs font-bold">PROMPT MAESTRO COMPLETO</span>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs transition-colors"
                                >
                                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Copiado' : 'Copiar'}
                                </button>
                            </div>
                            <div className="bg-orange/5 px-4 py-3 max-h-48 overflow-y-auto">
                                <pre className="text-xs text-graphite font-mono whitespace-pre-wrap leading-relaxed">
                                    {progreso.prompt_maestro}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-orange/5 border border-orange/20 rounded-xl p-4 text-center">
                            <p className="text-sm text-orange/70">Aún no has guardado tu Prompt Maestro completo. Regresa al Simulador de Prompt para ensamblarlo.</p>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'ROL', done: !!progreso.rol_construido },
                            { label: 'CONTEXTO', done: !!progreso.contexto_construido },
                            { label: 'Prompt', done: !!progreso.prompt_maestro },
                        ].map(({ label, done }) => (
                            <div key={label} className={`rounded-xl p-3 text-center border-2 ${done ? 'border-green-300 bg-green-50' : 'border-graphite/10 bg-cream'}`}>
                                <p className={`text-lg mb-0.5 ${done ? '' : 'opacity-30'}`}>{done ? '✓' : '○'}</p>
                                <p className={`text-xs font-medium ${done ? 'text-green-700' : 'text-graphite/40'}`}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
