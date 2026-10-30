import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useAuth } from '../context/AuthContext'
import {
    ChevronLeft, ChevronRight, Users, FileText, Image as ImageIcon,
    ClipboardList, Code2, BookOpen, Lightbulb, BarChart2,
    CheckCircle2, Clock, PenLine, Save, AlertCircle,
    Play, Pause, RotateCcw, ArrowLeft, RefreshCw, Edit2, Timer,
} from 'lucide-react'
import type { Bloque } from '../types'
import { BloquePortada } from '../components/bloques/BloquePortada'
import { BloqueInfografia } from '../components/bloques/BloqueInfografia'
import { BloqueTarjetasFlip } from '../components/bloques/BloqueTarjetasFlip'
import { BloqueComparador } from '../components/bloques/BloqueComparador'
import { BloqueChecklist } from '../components/bloques/BloqueChecklist'
import { BloqueCampoLibre } from '../components/bloques/BloqueCampoLibre'
import { BloqueTablaEditable } from '../components/bloques/BloqueTablaEditable'
import { BloqueCasoEtico } from '../components/bloques/BloqueCasoEtico'
import { BloqueSimuladorPrompt } from '../components/bloques/BloqueSimuladorPrompt'
import { BloqueResumenPersonal } from '../components/bloques/BloqueResumenPersonal'
import { BloqueMapa } from '../components/bloques/BloqueMapa'

// ─── localStorage key helpers ────────────────────────────────────────────────
const nombreKey = (id: string) => `bloque-nombre-${id}`
const notaKey = (id: string) => `notas-maestro-${id}`

function getNombre(bloque: Bloque, index: number): string {
    return localStorage.getItem(nombreKey(bloque.id)) || defaultLabel(bloque, index)
}

function defaultLabel(bloque: Bloque, index: number): string {
    switch (bloque.tipo) {
        case 'texto': return `Texto #${index + 1}`
        case 'carrusel': return `Carrusel #${index + 1}`
        case 'cuestionario': return `Quiz #${index + 1}`
        case 'simulador': return `Simulador #${index + 1}`
        case 'imagen': return `Imagen #${index + 1}`
        case 'portada': return `Portada #${index + 1}`
        case 'comparador': return `Comparador #${index + 1}`
        case 'infografia': return `Infografía #${index + 1}`
        case 'tarjetas_flip': return `Tarjetas #${index + 1}`
        case 'tabla_editable': return `Tabla #${index + 1}`
        case 'checklist': return `Checklist #${index + 1}`
        case 'campo_libre': return `Campo libre #${index + 1}`
        case 'simulador_prompt': return `Sim. IA #${index + 1}`
        case 'caso_etico': return `Caso ético #${index + 1}`
        case 'mapa_ecosistema': return `Mapa #${index + 1}`
        case 'resumen_personal': return `Resumen #${index + 1}`
        default: return `Bloque #${index + 1}`
    }
}

// ─── Brief content summary for sidebar ──────────────────────────────────────
function blockSummary(bloque: Bloque): string | null {
    const c = bloque.contenido as any
    switch (bloque.tipo) {
        case 'carrusel': {
            const n = (c.imagenes || []).length
            return n ? `${n} diapositiva${n !== 1 ? 's' : ''}` : null
        }
        case 'cuestionario': {
            const n = (c.preguntas || []).length
            return n ? `${n} pregunta${n !== 1 ? 's' : ''}` : null
        }
        case 'tarjetas_flip': {
            const n = (c.tarjetas || []).length
            return n ? `${n} tarjeta${n !== 1 ? 's' : ''}` : null
        }
        case 'tabla_editable':
            return c.titulo || null
        case 'checklist': {
            const n = (c.items || []).length
            return n ? `${n} elemento${n !== 1 ? 's' : ''}` : null
        }
        case 'simulador':
        case 'simulador_prompt':
            return c.titulo || null
        case 'portada':
            return c.subtitulo || null
        default:
            return null
    }
}

// ─── Hint suggestions per block type ────────────────────────────────────────
const HINTS: Record<string, { title: string; body: string }[]> = {
    texto: [
        { title: '💬 Pregunta de debate', body: '¿Cómo creen que este concepto impacta directamente en su rol diario?' },
        { title: '🔍 Dato complementario', body: 'Menciona un caso de empresa local que haya implementado esto con éxito en los últimos 2 años.' },
        { title: '✏️ Actividad rápida', body: 'Pide a cada alumno que escriba en una hoja una palabra que representa este tema para ellos.' },
        { title: '🔗 Conexión con tema anterior', body: 'Recuérdale al grupo cómo este bloque se conecta con lo que vieron en la sesión pasada.' },
    ],
    carrusel: [
        { title: '🖼️ Observación guiada', body: 'Identifica 3 diferencias entre la primera y la última imagen del carrusel.' },
        { title: '🏭 Ejemplo local', body: 'Comparte una foto o caso de la planta que ilustre la misma idea de otra forma.' },
    ],
    cuestionario: [
        { title: '⏱️ Tiempo sugerido', body: 'Da 5 minutos individuales, luego 2 minutos para discutir en pares antes de revisar en grupo.' },
        { title: '🎯 Pregunta bonus', body: '¿Qué harían diferente en su trabajo si supieran la respuesta correcta desde el inicio?' },
        { title: '📊 Análisis de errores', body: 'Si más del 50% falla una pregunta, detenerse y revisar el concepto desde otra perspectiva.' },
    ],
    simulador: [
        { title: '🧪 Variación del escenario', body: 'Cambia un parámetro clave y pregunta cómo afectaría el resultado.' },
        { title: '🤝 Trabajo en equipo', body: 'Equipos de 2 llegan a un consenso antes de confirmar la respuesta.' },
    ],
}

// ─── Block type icon helper ──────────────────────────────────────────────────
function BlockTypeIcon({ tipo, className = 'w-4 h-4' }: { tipo: string; className?: string }) {
    switch (tipo) {
        case 'texto': return <FileText className={className} />
        case 'carrusel': return <ImageIcon className={className} />
        case 'cuestionario': return <ClipboardList className={className} />
        case 'simulador': return <Code2 className={className} />
        case 'simulador_prompt': return <Code2 className={className} />
        case 'imagen': return <ImageIcon className={className} />
        case 'portada': return <BookOpen className={className} />
        case 'comparador': return <BarChart2 className={className} />
        case 'infografia': return <ImageIcon className={className} />
        case 'tarjetas_flip': return <ClipboardList className={className} />
        case 'tabla_editable': return <ClipboardList className={className} />
        case 'checklist': return <CheckCircle2 className={className} />
        case 'campo_libre': return <PenLine className={className} />
        case 'caso_etico': return <AlertCircle className={className} />
        case 'mapa_ecosistema': return <Users className={className} />
        case 'resumen_personal': return <BookOpen className={className} />
        default: return <FileText className={className} />
    }
}

const TYPE_COLOR: Record<string, string> = {
    texto: 'text-cobalt bg-cobalt/10',
    carrusel: 'text-mint-dark bg-mint/20',
    cuestionario: 'text-orange bg-orange/10',
    simulador: 'text-purple-600 bg-purple-50',
    simulador_prompt: 'text-purple-600 bg-purple-50',
    imagen: 'text-mint-dark bg-mint/20',
    portada: 'text-cobalt bg-cobalt/10',
    comparador: 'text-indigo-600 bg-indigo-50',
    infografia: 'text-teal-600 bg-teal-50',
    tarjetas_flip: 'text-pink-600 bg-pink-50',
    tabla_editable: 'text-orange bg-orange/10',
    checklist: 'text-green-600 bg-green-50',
    campo_libre: 'text-cobalt bg-cobalt/10',
    caso_etico: 'text-amber-600 bg-amber-50',
    mapa_ecosistema: 'text-teal-600 bg-teal-50',
    resumen_personal: 'text-cobalt bg-cobalt/10',
}

// ─── Format seconds ──────────────────────────────────────────────────────────
function fmt(s: number): string {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

// ─── Dual Timer widget ────────────────────────────────────────────────────────
function TimerWidget({
    blockKey,
    limitMins,
    onLimitChange,
    onNextBlock,
    hasNext,
}: {
    blockKey: string
    limitMins: number
    onLimitChange: (mins: number) => void
    onNextBlock: () => void
    hasNext: boolean
}) {
    const [sessionSecs, setSessionSecs] = useState(0)
    const [sessionRunning, setSessionRunning] = useState(false)
    const [blockSecs, setBlockSecs] = useState(0)
    const [blockRunning, setBlockRunning] = useState(false)
    const prevBlockKey = useRef(blockKey)

    // Limit editor state
    const [editingLimit, setEditingLimit] = useState(false)
    const [limitDraft, setLimitDraft] = useState('')
    const limitInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (prevBlockKey.current !== blockKey) {
            prevBlockKey.current = blockKey
            setBlockSecs(0)
            setEditingLimit(false)
        }
    }, [blockKey])

    useEffect(() => {
        if (editingLimit) limitInputRef.current?.focus()
    }, [editingLimit])

    useEffect(() => {
        if (!sessionRunning) return
        const id = setInterval(() => setSessionSecs((s) => s + 1), 1000)
        return () => clearInterval(id)
    }, [sessionRunning])

    useEffect(() => {
        if (!blockRunning) return
        const id = setInterval(() => setBlockSecs((s) => s + 1), 1000)
        return () => clearInterval(id)
    }, [blockRunning])

    const toggleSession = () => setSessionRunning((r) => !r)
    const resetSession = () => { setSessionSecs(0); setSessionRunning(false) }
    const toggleBlock = () => setBlockRunning((r) => !r)
    const resetBlock = () => setBlockSecs(0)
    const handleNext = () => { setBlockSecs(0); onNextBlock() }

    const commitLimit = () => {
        const v = parseInt(limitDraft)
        onLimitChange(isNaN(v) || v <= 0 ? 0 : v)
        setEditingLimit(false)
    }

    // Derived limit values
    const limitSecs = limitMins * 60
    const exceeded = limitSecs > 0 && blockSecs > limitSecs
    const nearLimit = limitSecs > 0 && !exceeded && blockSecs >= limitSecs * 0.8
    const overSecs = exceeded ? blockSecs - limitSecs : 0
    const pct = limitSecs > 0 ? Math.min((blockSecs / limitSecs) * 100, 100) : 0

    // Timer colour
    const blockColor = exceeded
        ? 'text-red-500'
        : nearLimit
            ? 'text-orange'
            : limitSecs === 0 && blockSecs > 1200
                ? 'text-red-500'
                : limitSecs === 0 && blockSecs > 600
                    ? 'text-orange'
                    : 'text-graphite'

    return (
        <div className={`flex-shrink-0 border-t bg-cream/40 px-4 py-3 space-y-3 transition-colors ${exceeded ? 'border-red-200 bg-red-50/40' : 'border-graphite/8'}`}>

            {/* ── Block timer ── */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-graphite/40 uppercase tracking-wider font-mono">Este bloque</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={toggleBlock}
                            className={`p-1 rounded-md transition-colors ${blockRunning ? 'bg-orange/10 text-orange' : 'hover:bg-graphite/5 text-graphite/40 hover:text-graphite'}`}
                            title={blockRunning ? 'Pausar' : 'Iniciar'}
                        >
                            {blockRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                            onClick={resetBlock}
                            className="p-1 rounded-md hover:bg-graphite/5 text-graphite/30 hover:text-graphite transition-colors"
                            title="Reiniciar"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Big clock */}
                <div className={`font-mono text-2xl font-bold tracking-tight text-center transition-colors ${blockColor}`}>
                    {fmt(blockSecs)}
                </div>

                {/* Progress bar (only when limit is set) */}
                {limitSecs > 0 && (
                    <div className="space-y-1">
                        <div className="h-1.5 bg-graphite/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${exceeded ? 'bg-red-500' : nearLimit ? 'bg-orange' : 'bg-green-500'}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-graphite/30">{fmt(blockSecs)}</span>
                            <span className={exceeded ? 'text-red-400' : nearLimit ? 'text-orange/60' : 'text-graphite/25'}>
                                {fmt(limitSecs)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Exceeded alert */}
                {exceeded && (
                    <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-100 rounded-xl border border-red-200">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        <span className="text-[11px] font-mono font-semibold text-red-600">
                            +{fmt(overSecs)} sobre el límite
                        </span>
                    </div>
                )}

                {/* Near-limit warning */}
                {nearLimit && (
                    <p className="text-[10px] text-center font-mono text-orange/80">
                        ⏳ Quedan {fmt(limitSecs - blockSecs)} — considera avanzar
                    </p>
                )}

                {/* Fallback warnings when no limit is set */}
                {limitSecs === 0 && blockSecs > 600 && (
                    <p className={`text-[10px] text-center font-mono ${blockSecs > 1200 ? 'text-red-400' : 'text-orange/70'}`}>
                        {blockSecs > 1200 ? '⚠️ más de 20 min' : '⏳ más de 10 min — considera avanzar'}
                    </p>
                )}

                {/* ── Time limit editor ── */}
                <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-graphite/30">
                        <Timer className="w-3 h-3" />
                        <span className="font-mono">Límite:</span>
                    </div>
                    {editingLimit ? (
                        <div className="flex items-center gap-1">
                            <input
                                ref={limitInputRef}
                                type="number"
                                min="0"
                                value={limitDraft}
                                onChange={(e) => setLimitDraft(e.target.value)}
                                onBlur={commitLimit}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') commitLimit()
                                    if (e.key === 'Escape') setEditingLimit(false)
                                }}
                                className="w-14 text-xs px-1.5 py-0.5 rounded-lg border border-orange/40 bg-white focus:outline-none focus:ring-1 focus:ring-orange/40 font-mono text-center"
                                placeholder="min"
                            />
                            <span className="text-[10px] text-graphite/30 font-mono">min</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setLimitDraft(limitMins > 0 ? String(limitMins) : ''); setEditingLimit(true) }}
                            className={`text-[10px] font-mono transition-colors hover:text-orange ${limitMins > 0 ? 'text-graphite/50 font-semibold' : 'text-graphite/25'}`}
                        >
                            {limitMins > 0 ? `${limitMins} min` : '— fijar'}
                        </button>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-graphite/8" />

            {/* ── Session timer ── */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-graphite/40 uppercase tracking-wider font-mono">Sesión total</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={toggleSession}
                            className={`p-1 rounded-md transition-colors ${sessionRunning ? 'bg-cobalt/10 text-cobalt' : 'hover:bg-graphite/5 text-graphite/40 hover:text-graphite'}`}
                            title={sessionRunning ? 'Pausar sesión' : 'Iniciar sesión'}
                        >
                            {sessionRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                            onClick={resetSession}
                            className="p-1 rounded-md hover:bg-graphite/5 text-graphite/30 hover:text-graphite transition-colors"
                            title="Reiniciar sesión"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
                <div className="font-mono text-base font-semibold text-graphite/50 tracking-tight text-center">
                    {fmt(sessionSecs)}
                </div>
            </div>

            {/* Quick next button */}
            {hasNext && (
                <button
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange/10 text-orange text-xs font-medium hover:bg-orange/20 transition-colors"
                >
                    Siguiente bloque
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    )
}

// ─── Inline block name editor (in sidebar) ──────────────────────────────────
function BlockNameEditor({ bloque, index }: { bloque: Bloque; index: number }) {
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(() => getNombre(bloque, index))
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editing) inputRef.current?.focus()
    }, [editing])

    const commit = () => {
        const trimmed = value.trim()
        const final = trimmed || defaultLabel(bloque, index)
        setValue(final)
        localStorage.setItem(nombreKey(bloque.id), final)
        setEditing(false)
    }

    if (editing) {
        return (
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') commit()
                    if (e.key === 'Escape') { setValue(getNombre(bloque, index)); setEditing(false) }
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-xs px-1.5 py-0.5 rounded-md bg-white border border-orange/40 text-graphite focus:outline-none focus:ring-1 focus:ring-orange/50"
                style={{ minWidth: 0 }}
            />
        )
    }

    return (
        <div className="flex items-center gap-1 min-w-0 group/name">
            <span className="text-xs font-medium truncate">{value}</span>
            <button
                onClick={(e) => { e.stopPropagation(); setEditing(true) }}
                className="opacity-0 group-hover/name:opacity-100 p-0.5 text-graphite/30 hover:text-orange transition-all flex-shrink-0"
                title="Renombrar"
            >
                <Edit2 className="w-2.5 h-2.5" />
            </button>
        </div>
    )
}

// ─── Read-only block renderer (teacher view) ─────────────────────────────────
function BlockReadOnly({ bloque }: { bloque: Bloque }) {
    const c = bloque.contenido as any
    const [carouselIdx, setCarouselIdx] = useState(0)

    // ── Dedicated components (shared with student view) ──
    if (bloque.tipo === 'portada') return <BloquePortada contenido={c} progreso={null} />
    if (bloque.tipo === 'infografia') return <BloqueInfografia contenido={c} />
    if (bloque.tipo === 'tarjetas_flip') return <BloqueTarjetasFlip contenido={c} />
    if (bloque.tipo === 'comparador') return <BloqueComparador contenido={c} />
    if (bloque.tipo === 'checklist') return <BloqueChecklist contenido={c} progreso={null} />
    if (bloque.tipo === 'campo_libre') return <BloqueCampoLibre contenido={c} progreso={null} />
    if (bloque.tipo === 'tabla_editable') return <BloqueTablaEditable contenido={c} progreso={null} />
    if (bloque.tipo === 'caso_etico') return <BloqueCasoEtico contenido={c} bloqueId={bloque.id} />
    if (bloque.tipo === 'simulador_prompt') return <BloqueSimuladorPrompt contenido={c} progreso={null} />
    if (bloque.tipo === 'resumen_personal') return <BloqueResumenPersonal contenido={c} progreso={null} />
    if (bloque.tipo === 'mapa_ecosistema') return <BloqueMapa contenido={c} />

    // ── Classic types ────────────────────────────────────────────────
    if (bloque.tipo === 'texto') {
        return (
            <div
                className="prose prose-sm max-w-none text-graphite prose-headings:font-serif prose-headings:text-graphite prose-a:text-orange prose-strong:text-graphite"
                dangerouslySetInnerHTML={{ __html: c.html || '' }}
            />
        )
    }

    if (bloque.tipo === 'carrusel') {
        const imagenes = c.imagenes || []
        const img = imagenes[carouselIdx]
        return (
            <div>
                {img && (
                    <div className="relative">
                        <img src={img.url} alt={img.caption} className="w-full h-72 object-cover rounded-xl" />
                        <p className="text-center text-sm text-graphite/60 mt-3">{img.caption}</p>
                    </div>
                )}
                {imagenes.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <button onClick={() => setCarouselIdx(Math.max(0, carouselIdx - 1))} disabled={carouselIdx === 0} className="btn-ghost p-2 disabled:opacity-20">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-xs font-mono text-graphite/40">{carouselIdx + 1} / {imagenes.length}</span>
                        <button onClick={() => setCarouselIdx(Math.min(imagenes.length - 1, carouselIdx + 1))} disabled={carouselIdx === imagenes.length - 1} className="btn-ghost p-2 disabled:opacity-20">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        )
    }

    if (bloque.tipo === 'cuestionario') {
        const preguntas = c.preguntas || []
        return (
            <div className="space-y-5">
                <h3 className="font-serif text-xl text-graphite">{c.titulo || 'Cuestionario'}</h3>
                {preguntas.map((preg: any, i: number) => (
                    <div key={preg.id} className="space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="text-xs font-mono text-graphite/30 mt-0.5">{i + 1}.</span>
                            <div>
                                <p className="text-sm font-medium text-graphite">{preg.texto}</p>
                                <span className="text-xs text-orange font-mono">{preg.puntos} pts</span>
                            </div>
                        </div>
                        {preg.tipo === 'opcion_multiple' && (
                            <div className="space-y-1.5 ml-5">
                                {(preg.opciones || []).map((opt: string, oi: number) => (
                                    <div key={oi} className={`px-4 py-2.5 rounded-xl border text-sm ${oi === preg.correcta ? 'border-green-300 bg-green-50 text-green-700 font-medium' : 'border-graphite/10 bg-white text-graphite/60'}`}>
                                        {oi === preg.correcta && <span className="mr-1.5">✓</span>}
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                        {preg.tipo === 'abierta' && (
                            <div className="ml-5 px-4 py-3 rounded-xl bg-cream border border-graphite/10 text-sm text-graphite/40 italic">
                                Respuesta abierta — sin calificación automática
                            </div>
                        )}
                    </div>
                ))}
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Vista del maestro — las respuestas correctas están visibles
                </div>
            </div>
        )
    }

    if (bloque.tipo === 'simulador') {
        return (
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-5 h-5 text-purple-500" />
                    <h3 className="font-serif text-lg text-graphite">{c.titulo || 'Simulador'}</h3>
                </div>
                {c.instrucciones && <p className="text-sm text-graphite/50 mb-4 bg-cobalt/5 rounded-xl px-4 py-3">{c.instrucciones}</p>}
                <iframe
                    srcDoc={c.html || ''}
                    sandbox="allow-scripts"
                    className="w-full border border-graphite/10 rounded-xl"
                    style={{ height: `${c.altura_px || 350}px` }}
                    title={c.titulo || 'Simulador'}
                />
            </div>
        )
    }

    return null
}

// ─── Live Results Panel ───────────────────────────────────────────────────────
function LiveResultsPanel({ bloque, grupoId }: { bloque: Bloque; grupoId: string | null }) {
    const { grupos, grupoAlumnos, usuarios, respuestas } = useStore()
    const [tick, setTick] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 3000)
        return () => clearInterval(id)
    }, [])

    if (!grupoId) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-center gap-2 text-graphite/30">
                <Users className="w-8 h-8" />
                <p className="text-sm">Selecciona un grupo activo para ver resultados en vivo</p>
            </div>
        )
    }

    const grupo = grupos.find((g) => g.id === grupoId)
    const alumnoIds = grupoAlumnos.filter((ga) => ga.grupo_id === grupoId).map((ga) => ga.alumno_id)
    const alumnos = usuarios.filter((u) => alumnoIds.includes(u.id))
    const c = bloque.contenido as any

    const alumnoData = alumnos.map((alumno) => {
        const resp = respuestas.find((r) => r.bloque_id === bloque.id && r.alumno_id === alumno.id)
        let nota: number | null = resp?.calificacion ?? null
        if (resp && nota === null && bloque.tipo === 'cuestionario') {
            const preguntas = c.preguntas || []
            let puntos = 0; let total = 0
            preguntas.forEach((p: any) => {
                total += p.puntos || 0
                if (p.tipo === 'opcion_multiple' && resp.respuestas[p.id] === p.correcta) puntos += p.puntos || 0
            })
            const hasOpen = preguntas.some((p: any) => p.tipo === 'abierta')
            nota = !hasOpen && total > 0 ? Math.round((puntos / total) * 100) : null
        }
        return { alumno, resp, nota }
    })

    const submitted = alumnoData.filter((a) => a.resp).length
    const withNota = alumnoData.filter((a) => a.nota !== null)
    const avg = withNota.length ? Math.round(withNota.reduce((s, a) => s + a.nota!, 0) / withNota.length) : null
    const pct = alumnos.length > 0 ? Math.round((submitted / alumnos.length) * 100) : 0

    if (bloque.tipo !== 'cuestionario') {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-graphite">{grupo?.nombre}</span>
                    <span className="flex items-center gap-1 text-green-500">
                        <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} /> En vivo
                    </span>
                </div>
                <div className="p-4 bg-cream rounded-xl text-center">
                    <p className="text-sm text-graphite/50">Este bloque no tiene examen.</p>
                    <p className="text-xs text-graphite/30 mt-1">Los resultados aparecen para bloques tipo cuestionario.</p>
                </div>
                {alumnos.map((alumno) => (
                    <div key={alumno.id} className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-graphite/5">
                        <div className="w-7 h-7 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt text-xs font-bold">{alumno.nombre[0]}</div>
                        <span className="text-sm text-graphite">{alumno.nombre} {alumno.apellido}</span>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-graphite">{grupo?.nombre}</span>
                <span className="flex items-center gap-1 text-xs text-green-500">
                    <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                    En vivo ({tick > 0 ? 'actualizado' : 'activo'})
                </span>
            </div>
            <div>
                <div className="flex items-center justify-between text-xs text-graphite/40 mb-1.5">
                    <span>{submitted} de {alumnos.length} respondieron</span>
                    {avg !== null && (
                        <span className={`font-mono font-bold ${avg >= 80 ? 'text-green-600' : avg >= 60 ? 'text-orange' : 'text-red-500'}`}>
                            Promedio: {avg}%
                        </span>
                    )}
                </div>
                <div className="h-2 bg-graphite/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #E07A5F, #F2CC8F)' }} />
                </div>
            </div>
            <div className="space-y-2">
                {alumnoData.map(({ alumno, resp, nota }) => (
                    <div key={alumno.id} className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-graphite/5">
                        <div className="w-7 h-7 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt text-xs font-bold flex-shrink-0">{alumno.nombre[0]}</div>
                        <span className="text-sm text-graphite flex-1 truncate">{alumno.nombre} {alumno.apellido}</span>
                        {!resp ? (
                            <span className="text-xs text-graphite/30 flex items-center gap-1"><Clock className="w-3 h-3" /> Pendiente</span>
                        ) : nota !== null ? (
                            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${nota >= 80 ? 'bg-green-50 text-green-700' : nota >= 60 ? 'bg-orange/10 text-orange' : 'bg-red-50 text-red-600'}`}>{nota}%</span>
                        ) : (
                            <span className="text-xs text-orange flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Entregado</span>
                        )}
                    </div>
                ))}
            </div>
            {alumnos.length === 0 && <p className="text-xs text-graphite/30 text-center py-4">No hay alumnos en este grupo.</p>}
        </div>
    )
}

// ─── Teacher Notes Panel ──────────────────────────────────────────────────────
function NotesPanel({ bloqueId }: { bloqueId: string }) {
    const [text, setText] = useState(() => localStorage.getItem(notaKey(bloqueId)) || '')
    const [saved, setSaved] = useState(true)

    const save = useCallback(() => {
        localStorage.setItem(notaKey(bloqueId), text)
        setSaved(true)
    }, [bloqueId, text])

    useEffect(() => { setSaved(false) }, [text])

    return (
        <div className="flex flex-col gap-3 h-full">
            <div className="flex items-center justify-between">
                <span className="text-xs text-graphite/40">Notas privadas — solo las ves tú</span>
                {!saved ? (
                    <button onClick={save} className="flex items-center gap-1 text-xs text-orange hover:text-orange/70 transition-colors">
                        <Save className="w-3 h-3" /> Guardar
                    </button>
                ) : text.length > 0 ? (
                    <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Guardado</span>
                ) : null}
            </div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={save}
                rows={14}
                placeholder="Escribe aquí tus notas: ideas, anécdotas, puntos a destacar, preguntas que quieres hacer al grupo..."
                className="flex-1 w-full px-4 py-3 rounded-xl bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none placeholder:text-graphite/25 leading-relaxed"
            />
        </div>
    )
}

// ─── Examples / Hints Panel ───────────────────────────────────────────────────
function HintsPanel({ tipo }: { tipo: string }) {
    const [expanded, setExpanded] = useState<string | null>(null)
    const hints = HINTS[tipo] || HINTS['texto']

    return (
        <div className="space-y-2">
            <p className="text-xs text-graphite/40 mb-3">Sugerencias y ejemplos adicionales para enriquecer la sesión</p>
            {hints.map((h) => (
                <div key={h.title} className="rounded-xl border border-graphite/8 bg-white overflow-hidden">
                    <button
                        onClick={() => setExpanded(expanded === h.title ? null : h.title)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-cream/50 transition-colors"
                    >
                        <span className="text-sm font-medium text-graphite">{h.title}</span>
                        <ChevronRight className={`w-4 h-4 text-graphite/30 transition-transform ${expanded === h.title ? 'rotate-90' : ''}`} />
                    </button>
                    {expanded === h.title && (
                        <div className="px-4 pb-4 text-sm text-graphite/70 leading-relaxed border-t border-graphite/5 pt-3 bg-cream/30">
                            {h.body}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// ─── Main ImpartirCurso ───────────────────────────────────────────────────────
export function ImpartirCurso({ cursoId }: { cursoId: string }) {
    const { user } = useAuth()
    const { cursos, bloques, grupos, grupoAlumnos } = useStore()

    const curso = cursos.find((c) => c.id === cursoId)
    const cursoBloques = bloques.filter((b) => b.curso_id === cursoId).sort((a, b) => a.orden - b.orden)

    const [currentIndex, setCurrentIndex] = useState(0)
    const [activeTab, setActiveTab] = useState<'notas' | 'ejemplos' | 'resultados'>('notas')
    const [activeGrupoId, setActiveGrupoId] = useState<string | null>(null)
    const activeBlockRef = useRef<HTMLButtonElement>(null)

    // Block time limits — loaded from localStorage, keyed by block id
    const [blockLimits, setBlockLimits] = useState<Record<string, number>>(() => {
        const limits: Record<string, number> = {}
        bloques.filter((b) => b.curso_id === cursoId).forEach((b) => {
            const v = localStorage.getItem(`block-tiempo-${b.id}`)
            if (v) limits[b.id] = parseInt(v)
        })
        return limits
    })

    const handleLimitChange = useCallback((blockId: string, mins: number) => {
        setBlockLimits((prev) => {
            const next = { ...prev }
            if (mins > 0) {
                next[blockId] = mins
                localStorage.setItem(`block-tiempo-${blockId}`, String(mins))
            } else {
                delete next[blockId]
                localStorage.removeItem(`block-tiempo-${blockId}`)
            }
            return next
        })
    }, [])

    // Auto-scroll active block into view in sidebar
    useEffect(() => {
        activeBlockRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, [currentIndex])

    const misGrupos = grupos.filter((g) => user?.rol === 'admin' || g.maestro_id === user?.id)

    useEffect(() => {
        if (misGrupos.length > 0 && !activeGrupoId) setActiveGrupoId(misGrupos[0].id)
    }, [misGrupos.length])

    if (!curso) return <div className="flex items-center justify-center h-64 text-graphite/40 font-mono text-sm">Curso no encontrado</div>

    if (cursoBloques.length === 0) {
        return (
            <div className="max-w-3xl mx-auto text-center py-20 space-y-4">
                <BookOpen className="w-10 h-10 text-graphite/20 mx-auto" />
                <h2 className="font-serif text-2xl text-graphite">El curso no tiene bloques</h2>
                <p className="text-graphite/40 text-sm">Agrega contenido desde el editor antes de impartir.</p>
                <Link to={`/maestro/curso/${cursoId}/editar`} className="btn-primary inline-flex gap-2 mt-2">Ir al editor</Link>
            </div>
        )
    }

    const currentBlock = cursoBloques[currentIndex]
    const nextBlock = cursoBloques[currentIndex + 1]

    const tabMap = [
        { key: 'notas' as const, label: 'Notas', icon: PenLine },
        { key: 'ejemplos' as const, label: 'Ejemplos', icon: Lightbulb },
        { key: 'resultados' as const, label: 'Resultados', icon: BarChart2 },
    ]

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">

            {/* ── Top bar ── */}
            <div className="flex-shrink-0 bg-white border-b border-graphite/8 px-4 py-2.5 flex items-center gap-3">
                <Link to="/maestro/cursos" className="flex items-center gap-1.5 text-sm text-graphite/50 hover:text-graphite transition-colors flex-shrink-0">
                    <ArrowLeft className="w-4 h-4" /> Cursos
                </Link>
                <div className="w-px h-5 bg-graphite/10 flex-shrink-0" />

                {/* Breadcrumb with names */}
                <div className="flex-1 flex items-center gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
                    {cursoBloques.map((b, i) => {
                        const isActive = i === currentIndex
                        const color = TYPE_COLOR[b.tipo] || 'text-graphite bg-graphite/10'
                        const nombre = getNombre(b, i)
                        return (
                            <button
                                key={b.id}
                                onClick={() => setCurrentIndex(i)}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive ? color : 'text-graphite/30 hover:text-graphite/60 hover:bg-cream'}`}
                                title={nombre}
                            >
                                <BlockTypeIcon tipo={b.tipo} className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="max-w-[90px] truncate">{nombre}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Group selector */}
                <div className="flex-shrink-0 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-graphite/30" />
                    <select
                        value={activeGrupoId || ''}
                        onChange={(e) => setActiveGrupoId(e.target.value || null)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-cream border border-graphite/10 text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 cursor-pointer"
                    >
                        <option value="">Sin grupo</option>
                        {misGrupos.map((g) => {
                            const count = grupoAlumnos.filter((ga) => ga.grupo_id === g.id).length
                            return <option key={g.id} value={g.id}>{g.nombre} ({count})</option>
                        })}
                    </select>
                </div>

                {/* Counter */}
                <span className="flex-shrink-0 text-xs font-mono text-graphite/30 bg-cream px-2.5 py-1.5 rounded-lg">
                    {currentIndex + 1} / {cursoBloques.length}
                </span>
            </div>

            {/* ── 3-column layout ── */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT: Block index sidebar */}
                <aside className="w-52 flex-shrink-0 bg-white border-r border-graphite/8 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                        <p className="text-[10px] text-graphite/30 font-mono px-2 py-1.5 uppercase tracking-wider truncate">{curso.titulo}</p>
                        {cursoBloques.map((b, i) => {
                            const color = TYPE_COLOR[b.tipo] || 'text-graphite bg-graphite/10'
                            const isActive = i === currentIndex
                            const isNext = i === currentIndex + 1
                            const info = blockSummary(b)
                            const limit = blockLimits[b.id]
                            return (
                                <button
                                    key={b.id}
                                    ref={isActive ? activeBlockRef : null}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all group ${isActive ? 'bg-orange/8 shadow-sm' : isNext ? 'bg-cobalt/5 text-graphite/60 hover:bg-cream' : 'text-graphite/50 hover:bg-cream hover:text-graphite'}`}
                                >
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? color : isNext ? 'bg-cobalt/10 text-cobalt/50' : 'bg-graphite/5 text-graphite/25 group-hover:bg-graphite/10'}`}>
                                        <BlockTypeIcon tipo={b.tipo} className="w-3 h-3" />
                                    </div>
                                    <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                                        <BlockNameEditor bloque={b} index={i} />
                                        <p className="text-[10px] text-graphite/25 font-mono truncate">
                                            #{i + 1}
                                            {isNext && <span className="ml-1 text-cobalt/50">siguiente</span>}
                                            {info && <span className="ml-1 text-graphite/35">· {info}</span>}
                                        </p>
                                        {limit > 0 && (
                                            <p className="text-[9px] font-mono text-graphite/30 flex items-center gap-0.5 mt-0.5">
                                                <Clock className="w-2.5 h-2.5 inline" /> {limit} min
                                            </p>
                                        )}
                                    </div>
                                    {isActive && <Play className="w-2.5 h-2.5 text-orange flex-shrink-0" />}
                                </button>
                            )
                        })}
                    </div>

                    {/* Timer widget pinned to bottom of sidebar */}
                    <TimerWidget
                        blockKey={currentBlock.id}
                        limitMins={blockLimits[currentBlock.id] ?? 0}
                        onLimitChange={(mins) => handleLimitChange(currentBlock.id, mins)}
                        onNextBlock={() => {
                            if (currentIndex < cursoBloques.length - 1) setCurrentIndex(currentIndex + 1)
                        }}
                        hasNext={currentIndex < cursoBloques.length - 1}
                    />
                </aside>

                {/* CENTER: Student-view content */}
                <main className="flex-1 overflow-y-auto bg-cream/30">
                    <div className="max-w-2xl mx-auto p-6 space-y-5">
                        {/* Block badge + next preview */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${TYPE_COLOR[currentBlock.tipo] || ''}`}>
                                    <BlockTypeIcon tipo={currentBlock.tipo} className="w-3.5 h-3.5" />
                                    <span>{getNombre(currentBlock, currentIndex)}</span>
                                </div>
                                <span className="text-xs text-graphite/30 font-mono">Bloque {currentIndex + 1} de {cursoBloques.length}</span>
                            </div>
                            {nextBlock && (
                                <div className="flex items-center gap-1.5 text-xs text-graphite/30 bg-cobalt/5 px-2.5 py-1.5 rounded-lg">
                                    <span>Siguiente:</span>
                                    <BlockTypeIcon tipo={nextBlock.tipo} className="w-3 h-3 text-cobalt/40" />
                                    <span className="text-cobalt/50 max-w-[100px] truncate">{getNombre(nextBlock, currentIndex + 1)}</span>
                                </div>
                            )}
                        </div>

                        {/* Block content */}
                        <div className="bg-white rounded-2xl shadow-soft border border-graphite/5 p-6">
                            <BlockReadOnly bloque={currentBlock} />
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-2">
                            <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className="btn-secondary gap-2 disabled:opacity-30">
                                <ChevronLeft className="w-4 h-4" /> Anterior
                            </button>
                            {currentIndex < cursoBloques.length - 1 ? (
                                <button onClick={() => setCurrentIndex(currentIndex + 1)} className="btn-primary gap-2">
                                    Siguiente <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                    <CheckCircle2 className="w-5 h-5" /> Fin del curso
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* RIGHT: Teacher panel */}
                <aside className="w-80 flex-shrink-0 bg-white border-l border-graphite/8 flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-graphite/8 flex-shrink-0">
                        {tabMap.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2 ${activeTab === key ? 'border-orange text-orange' : 'border-transparent text-graphite/40 hover:text-graphite'}`}
                            >
                                <Icon className="w-3.5 h-3.5" /> {label}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {activeTab === 'notas' && <NotesPanel bloqueId={currentBlock.id} />}
                        {activeTab === 'ejemplos' && <HintsPanel tipo={currentBlock.tipo} />}
                        {activeTab === 'resultados' && <LiveResultsPanel bloque={currentBlock} grupoId={activeGrupoId} />}
                    </div>
                </aside>
            </div>
        </div>
    )
}

// ─── Course list page ─────────────────────────────────────────────────────────
export function CursosImpartir() {
    const { user } = useAuth()
    const { cursos, bloques } = useStore()
    const misCursos = user?.rol === 'admin'
        ? cursos
        : cursos.filter((c) => c.maestro_id === user?.id || c.publicado)

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="font-serif text-3xl text-graphite">Impartir Curso</h1>
                <p className="text-graphite/50 text-sm mt-1">Selecciona el curso que vas a impartir hoy</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {misCursos.map((curso) => {
                    const bc = bloques.filter((b) => b.curso_id === curso.id).length
                    return (
                        <Link
                            key={curso.id}
                            to={`/maestro/curso/${curso.id}/impartir`}
                            className="bg-white rounded-2xl shadow-soft border border-graphite/5 overflow-hidden hover:shadow-soft-lg hover:border-orange/20 transition-all group"
                        >
                            <div className="h-28 bg-gradient-to-br from-orange/10 to-cobalt/10 flex items-center justify-center">
                                <Play className="w-10 h-10 text-orange/30 group-hover:text-orange/60 transition-colors" />
                            </div>
                            <div className="p-5">
                                <h3 className="font-medium text-graphite group-hover:text-orange transition-colors">{curso.titulo}</h3>
                                <p className="text-sm text-graphite/50 mt-1 line-clamp-2">{curso.descripcion}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xs text-graphite/30 font-mono">{bc} bloques</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${curso.publicado ? 'bg-green-50 text-green-600' : 'bg-graphite/5 text-graphite/40'}`}>
                                        {curso.publicado ? 'Publicado' : 'Borrador'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
