import { authenticatedFetch } from '../lib/http'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useAuth } from '../context/AuthContext'
import { CheckCircle2, ChevronLeft, ChevronRight, ArrowRight, Code2, Type, Languages, Loader2 } from 'lucide-react'
import type { Bloque, ProgresoAlumno } from '../types'
import { TutorWidget } from '../components/TutorWidget'
import { TLDRWidget } from '../components/TLDRWidget'
import { AdaptiveResult } from '../components/AdaptiveResult'
import { ImagenConCallouts } from '../components/ImagenConCallouts'
import { AI_CLAUDE_URL } from '../lib/ai'
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

type TranslationLevel = 'same' | 'simpler' | 'basic'

const DEFAULT_PROGRESO = (userId: string, cursoId: string): ProgresoAlumno => ({
    userId, cursoId, bloques_completados: [], bitacora: [], compromisos_encuadre: {},
    rol_construido: '', contexto_construido: '', prompt_maestro: '',
    calificacion_formativa: 0, calificacion_sumativa: 0, respuestas_diagnostica: {},
    auditoria_etica: [], compromisos_72h: {}, updated_at: '',
})

// ── Student Course List ──
export function CursosAlumno() {
    const { user } = useAuth()
    const { bloques, grupoAlumnos, getCursosDeAlumno } = useStore()

    const misGrupoIds = grupoAlumnos.filter((ga) => ga.alumno_id === user?.id).map((ga) => ga.grupo_id)
    const misCursos = user ? getCursosDeAlumno(user.id) : []

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="font-serif text-3xl text-graphite">Mis Cursos</h1>
                <p className="text-graphite/50 text-sm mt-1">
                    Inscrito en {misGrupoIds.length} grupo{misGrupoIds.length !== 1 ? 's' : ''} · {misCursos.length} curso{misCursos.length !== 1 ? 's' : ''} disponible{misCursos.length !== 1 ? 's' : ''}
                </p>
            </div>

            {misCursos.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-graphite/5">
                    <p className="text-graphite/30 text-sm font-mono">No hay cursos asignados a tus grupos.</p>
                    <p className="text-graphite/20 text-xs mt-1">
                        {misGrupoIds.length === 0
                            ? 'Primero solicita acceso a un grupo desde "Mis Grupos".'
                            : 'Tu maestro aún no ha asignado cursos a tu grupo.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {misCursos.map((curso) => {
                        const bloqueCount = bloques.filter((b) => b.curso_id === curso.id).length
                        return (
                            <Link
                                key={curso.id}
                                to={`/app/curso/${curso.id}`}
                                className="bg-white rounded-2xl shadow-soft border border-graphite/5 overflow-hidden hover:shadow-soft-lg transition-all group"
                            >
                                <div className="h-32 bg-gradient-to-br from-cobalt/10 to-mint/30 flex items-center justify-center">
                                    <span className="text-4xl opacity-30">📚</span>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-medium text-graphite group-hover:text-orange transition-colors">{curso.titulo}</h3>
                                    <p className="text-sm text-graphite/50 mt-1 line-clamp-2">{curso.descripcion}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs text-graphite/30 font-mono">{bloqueCount} bloques</span>
                                        <span className="text-xs text-orange flex items-center gap-1 font-medium">
                                            Continuar <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// ── Student Course Viewer (sequential) ──
export function CursoViewer({ cursoId }: { cursoId: string }) {
    const { cursos, bloques, respuestas, submitRespuesta, loadProgresoAlumno, upsertProgresoAlumno } = useStore()
    const { user } = useAuth()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set())
    const [quizAnswers, setQuizAnswers] = useState<Record<string, Record<string, number | string>>>({})
    const [progreso, setProgreso] = useState<ProgresoAlumno | null>(null)

    // Font scale: 0.85 / 1 / 1.2 / 1.4
    const SCALES = [0.85, 1, 1.2, 1.4]
    const SCALE_LABELS = ['XS', 'S', 'M', 'L']
    const [scaleIdx, setScaleIdx] = useState<number>(() => {
        const saved = localStorage.getItem('iaprende-font-scale')
        return saved ? Math.max(0, Math.min(SCALES.length - 1, parseInt(saved))) : 1
    })

    useEffect(() => {
        document.documentElement.style.setProperty('--student-font-scale', String(SCALES[scaleIdx]))
        localStorage.setItem('iaprende-font-scale', String(scaleIdx))
    }, [scaleIdx])

    // Load student progress
    useEffect(() => {
        if (!user || !cursoId) return
        loadProgresoAlumno(user.id, cursoId).then(p => {
            const loaded = p ?? DEFAULT_PROGRESO(user.id, cursoId)
            setProgreso(loaded)
            if (loaded.bloques_completados.length > 0) {
                setCompletedBlocks(new Set(loaded.bloques_completados))
            }
        })
    }, [user?.id, cursoId])

    const handleProgresoUpdate = async (field: keyof ProgresoAlumno, value: unknown) => {
        if (!user) return
        const base = progreso ?? DEFAULT_PROGRESO(user.id, cursoId)
        const updated: ProgresoAlumno = { ...base, [field]: value, updated_at: new Date().toISOString() }
        setProgreso(updated)
        await upsertProgresoAlumno(updated)
    }

    const curso = cursos.find((c) => c.id === cursoId)
    const cursoBloques = bloques.filter((b) => b.curso_id === cursoId).sort((a, b) => a.orden - b.orden)

    if (!curso) return <div className="text-graphite/40 font-mono text-sm">Curso no encontrado</div>

    const currentBlock = cursoBloques[currentIndex]
    const isCompleted = currentBlock ? completedBlocks.has(currentBlock.id) : false

    const markComplete = async () => {
        if (!currentBlock) return
        const next = new Set(completedBlocks).add(currentBlock.id)
        setCompletedBlocks(next)
        await handleProgresoUpdate('bloques_completados', [...next])
    }

    const handleQuizSubmit = (bloqueId: string) => {
        submitRespuesta({
            bloque_id: bloqueId,
            alumno_id: user?.id || '',
            respuestas: quizAnswers[bloqueId] || {},
            calificacion: null,
        })
        markComplete()
    }

    const goNext = () => setCurrentIndex((i) => Math.min(cursoBloques.length - 1, i + 1))
    const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1))

    // Non-interactive block types that auto-advance
    const autoCompleteTypes = new Set(['portada', 'infografia', 'mapa_ecosistema', 'resumen_personal'])

    return (
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {/* Progress bar */}
            <div className="bg-white rounded-2xl shadow-soft border border-graphite/5 p-4">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="font-serif text-base md:text-xl text-graphite flex-1 pr-2 truncate">{curso.titulo}</h1>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-cream rounded-xl p-1 border border-graphite/8">
                            <Type className="w-3.5 h-3.5 text-graphite/30 ml-1" />
                            {SCALE_LABELS.map((label, i) => (
                                <button
                                    key={label}
                                    onClick={() => setScaleIdx(i)}
                                    title={`Tamaño ${label}`}
                                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                                        scaleIdx === i
                                            ? 'bg-orange text-white shadow-sm'
                                            : 'text-graphite/40 hover:text-graphite hover:bg-white'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <span className="text-xs text-graphite/40 font-mono">{currentIndex + 1}/{cursoBloques.length}</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    {cursoBloques.map((b, i) => (
                        <button
                            key={b.id}
                            onClick={() => { if (i <= currentIndex || completedBlocks.has(b.id)) setCurrentIndex(i) }}
                            disabled={i > currentIndex && !completedBlocks.has(b.id)}
                            className={`flex-1 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-orange'
                                    : completedBlocks.has(b.id) ? 'bg-green-400'
                                        : i < currentIndex ? 'bg-cobalt/30'
                                            : 'bg-graphite/10'
                                }`}
                            title={`Bloque ${i + 1}: ${b.tipo}`}
                        />
                    ))}
                </div>
            </div>

            {/* Current block */}
            {currentBlock && (
                <div className={`bg-white rounded-2xl shadow-soft border border-graphite/5 overflow-hidden ${currentBlock.tipo === 'portada' ? 'p-0' : ''}`}>
                    <StudentBlockView
                        bloque={currentBlock}
                        quizAnswers={quizAnswers[currentBlock.id] ?? (respuestas
                            .filter(r => r.bloque_id === currentBlock.id && r.alumno_id === user?.id)
                            .sort((a, b) => b.enviado_at.localeCompare(a.enviado_at))[0]?.respuestas as Record<string, number | string>) ?? {}}
                        onQuizAnswer={(qId, answer) => {
                            setQuizAnswers((prev) => ({
                                ...prev,
                                [currentBlock.id]: { ...(prev[currentBlock.id] || {}), [qId]: answer },
                            }))
                        }}
                        onQuizSubmit={() => handleQuizSubmit(currentBlock.id)}
                        isCompleted={isCompleted}
                        courseTitle={curso.titulo}
                        onContinue={goNext}
                        progreso={progreso}
                        onProgresoUpdate={handleProgresoUpdate}
                    />
                </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between gap-2">
                <button onClick={goPrev} disabled={currentIndex === 0} className="btn-secondary gap-2 disabled:opacity-30">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                </button>

                {currentBlock && !autoCompleteTypes.has(currentBlock.tipo) && currentBlock.tipo !== 'cuestionario' && !isCompleted && (
                    <button onClick={markComplete} className="btn-ghost text-sm text-green-600 gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Marcar como visto</span>
                    </button>
                )}

                {currentIndex < cursoBloques.length - 1 ? (
                    <button onClick={() => { markComplete(); goNext() }} className="btn-primary gap-2">
                        <span className="hidden sm:inline">Siguiente</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="hidden sm:inline">Fin del curso</span>
                    </div>
                )}
            </div>

            {/* AI Tutor — only for text blocks */}
            {currentBlock && (currentBlock.tipo === 'texto' || currentBlock.tipo === 'simulador') && (
                <TutorWidget
                    blockContent={(currentBlock.contenido as any)?.html ?? JSON.stringify(currentBlock.contenido)}
                    courseTitle={curso.titulo}
                />
            )}
        </div>
    )
}

// ── Carousel sub-component ──
function CarouselBlock({ imagenes }: { imagenes: { url: string; caption: string }[] }) {
    const [idx, setIdx] = useState(0)
    const img = imagenes[idx]
    if (!img) return null
    return (
        <div className="relative">
            <img src={img.url} alt={img.caption} className="w-full h-80 object-cover rounded-xl" />
            <p className="text-center text-sm text-graphite/60 mt-3">{img.caption}</p>
            {imagenes.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-4">
                    <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="btn-ghost p-2 disabled:opacity-20">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-mono text-graphite/40">{idx + 1} / {imagenes.length}</span>
                    <button onClick={() => setIdx((i) => Math.min(imagenes.length - 1, i + 1))} disabled={idx === imagenes.length - 1} className="btn-ghost p-2 disabled:opacity-20">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    )
}

// ── SP7: Text block with optional AI simplification ──
function TextoBlock({ html }: { html: string }) {
    const [level, setLevel] = useState<TranslationLevel>('same')
    const [cache, setCache] = useState<Partial<Record<TranslationLevel, string>>>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const displayHtml = cache[level] ?? html

    const handleLevelChange = async (next: TranslationLevel) => {
        setLevel(next)
        setError(null)
        if (next === 'same' || cache[next] || !AI_CLAUDE_URL) return
        setLoading(true)
        try {
            const res = await authenticatedFetch(`${AI_CLAUDE_URL}/translateBlockFn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ htmlContent: html, level: next }),
            })
            if (!res.ok) throw new Error(`Error ${res.status}`)
            const data = await res.json()
            setCache(prev => ({ ...prev, [next]: data.html }))
        } catch {
            setError('No se pudo simplificar el contenido')
            setLevel('same')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 md:p-6 student-content">
            {AI_CLAUDE_URL && (
                <div className="flex items-center gap-2 mb-4">
                    <Languages className="w-4 h-4 text-graphite/30 flex-shrink-0" />
                    <div className="flex items-center gap-1 bg-cream rounded-xl p-1 border border-graphite/8">
                        {([
                            ['same', 'Original'],
                            ['simpler', 'Simplificado'],
                            ['basic', 'Básico'],
                        ] as [TranslationLevel, string][]).map(([val, label]) => (
                            <button
                                key={val}
                                onClick={() => handleLevelChange(val)}
                                disabled={loading}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                    level === val
                                        ? 'bg-cobalt text-white shadow-sm'
                                        : 'text-graphite/40 hover:text-graphite hover:bg-white'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    {loading && <Loader2 className="w-3.5 h-3.5 text-cobalt animate-spin" />}
                    {error && <span className="text-xs text-red-500">{error}</span>}
                </div>
            )}
            <div
                className="prose prose-sm max-w-none text-graphite prose-headings:font-serif prose-headings:text-graphite prose-a:text-orange prose-strong:text-graphite"
                dangerouslySetInnerHTML={{ __html: displayHtml }}
            />
            <TLDRWidget htmlContent={html} />
        </div>
    )
}

// ── Student Block View ──
export function StudentBlockView({
    bloque, quizAnswers, onQuizAnswer, onQuizSubmit, isCompleted, courseTitle, onContinue, progreso, onProgresoUpdate,
}: {
    bloque: Bloque
    quizAnswers: Record<string, number | string>
    onQuizAnswer: (qId: string, answer: number | string) => void
    onQuizSubmit: () => void
    isCompleted: boolean
    courseTitle: string
    onContinue: () => void
    progreso: ProgresoAlumno | null
    onProgresoUpdate: (field: keyof ProgresoAlumno, value: unknown) => void
}) {
    const c = bloque.contenido as any

    // ── New block types ──────────────────────────────────────────────
    if (bloque.tipo === 'portada') return <BloquePortada contenido={c} progreso={progreso} />
    if (bloque.tipo === 'infografia') return <BloqueInfografia contenido={c} />
    if (bloque.tipo === 'tarjetas_flip') return <BloqueTarjetasFlip contenido={c} />
    if (bloque.tipo === 'comparador') return <BloqueComparador contenido={c} />
    if (bloque.tipo === 'checklist') return <BloqueChecklist contenido={c} progreso={progreso} onProgresoUpdate={onProgresoUpdate} />
    if (bloque.tipo === 'campo_libre') return <BloqueCampoLibre contenido={c} progreso={progreso} onProgresoUpdate={onProgresoUpdate} />
    if (bloque.tipo === 'tabla_editable') return <BloqueTablaEditable contenido={c} progreso={progreso} onProgresoUpdate={onProgresoUpdate} />
    if (bloque.tipo === 'caso_etico') return <BloqueCasoEtico contenido={c} bloqueId={bloque.id} />
    if (bloque.tipo === 'simulador_prompt') return <BloqueSimuladorPrompt contenido={c} progreso={progreso} onProgresoUpdate={onProgresoUpdate} />
    if (bloque.tipo === 'resumen_personal') return <BloqueResumenPersonal contenido={c} progreso={progreso} />
    if (bloque.tipo === 'mapa_ecosistema') return <BloqueMapa contenido={c} />

    // ── Original block types ─────────────────────────────────────────
    if (bloque.tipo === 'imagen') return <div className="p-4 md:p-6"><ImagenConCallouts url={c.url || ''} alt={c.alt || ''} caption={c.caption} cuadros={c.cuadros || []} layout={c.layout || 'completa'} /></div>

    if (bloque.tipo === 'texto') return <TextoBlock html={c.html || ''} />

    if (bloque.tipo === 'carrusel') {
        return (
            <div className="p-4 md:p-6 student-content">
                <CarouselBlock imagenes={c.imagenes || []} />
            </div>
        )
    }

    if (bloque.tipo === 'cuestionario') {
        const preguntas: any[] = c.preguntas || []
        let score: number | null = null
        if (isCompleted) {
            const mcq = preguntas.filter((p) => p.tipo === 'opcion_multiple')
            const total = mcq.reduce((s, p) => s + (p.puntos || 0), 0)
            const earned = mcq.reduce((s, p) => s + (quizAnswers[p.id] === p.correcta ? (p.puntos || 0) : 0), 0)
            score = total > 0 ? Math.round((earned / total) * 100) : null
        }

        return (
            <div className="p-4 md:p-6 student-content">
                <h3 className="font-serif text-xl text-graphite mb-2">{c.titulo || 'Cuestionario'}</h3>
                {c.subtitulo && <p className="text-sm text-graphite/50 mb-5">{c.subtitulo}</p>}
                <div className="space-y-6">
                    {preguntas.map((preg, i) => (
                        <div key={preg.id} className="space-y-3">
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-mono text-graphite/30 mt-0.5">{i + 1}.</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-graphite">{preg.texto}</p>
                                    {preg.puntos > 0 && <span className="text-xs text-orange font-mono">{preg.puntos} pts</span>}
                                </div>
                            </div>
                            {preg.tipo === 'opcion_multiple' ? (
                                <div className="space-y-2 ml-5">
                                    {(preg.opciones || []).map((opt: string, oi: number) => (
                                        <button
                                            key={oi}
                                            onClick={() => !isCompleted && onQuizAnswer(preg.id, oi)}
                                            disabled={isCompleted}
                                            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${quizAnswers[preg.id] === oi
                                                    ? isCompleted
                                                        ? oi === preg.correcta
                                                            ? 'border-green-400 bg-green-50 text-green-700'
                                                            : 'border-red-300 bg-red-50 text-red-600'
                                                        : 'border-orange bg-orange/5 text-graphite'
                                                    : isCompleted && oi === preg.correcta
                                                        ? 'border-green-400 bg-green-50 text-green-700'
                                                        : 'border-graphite/10 bg-white text-graphite/60 hover:border-orange/30'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <textarea
                                    value={(quizAnswers[preg.id] as string) || ''}
                                    onChange={(e) => !isCompleted && onQuizAnswer(preg.id, e.target.value)}
                                    disabled={isCompleted}
                                    className="w-full ml-5 px-4 py-3 rounded-xl bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none disabled:opacity-50"
                                    rows={3}
                                    placeholder="Escribe tu respuesta..."
                                />
                            )}
                        </div>
                    ))}
                </div>

                {!isCompleted && (
                    <button onClick={onQuizSubmit} className="btn-primary mt-6 gap-2">
                        Enviar respuestas <ArrowRight className="w-4 h-4" />
                    </button>
                )}

                {isCompleted && (
                    <div className="mt-6">
                        {score !== null ? <AdaptiveResult
                            score={score}
                            courseTitle={courseTitle}
                            quizTitle={c.titulo || 'Cuestionario'}
                            onContinue={onContinue}
                            alumnoId={progreso?.userId}
                            cursoId={bloque.curso_id}
                        /> : <p className="text-sm text-graphite/60">Respuestas enviadas. La calificación de preguntas abiertas queda pendiente de revisión del instructor.</p>}
                    </div>
                )}
            </div>
        )
    }

    if (bloque.tipo === 'simulador') {
        return (
            <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-5 h-5 text-purple-500" />
                    <h3 className="font-serif text-lg text-graphite">{c.titulo || 'Simulador'}</h3>
                </div>
                {c.instrucciones && (
                    <p className="text-sm text-graphite/50 mb-4 bg-cobalt/5 rounded-xl px-4 py-3">{c.instrucciones}</p>
                )}
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
