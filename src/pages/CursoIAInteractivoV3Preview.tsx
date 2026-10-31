import { useMemo, useState } from 'react'
import type { Bloque, ProgresoAlumno } from '../types'
import { bloquesIAInteractivoV3, cursoIAInteractivoV3, mapaDidacticoIAInteractivoV3 } from '../store/cursoIAInteractivoV3'
import { BloquePortada } from '../components/bloques/BloquePortada'
import { BloqueInfografia } from '../components/bloques/BloqueInfografia'
import { BloqueTarjetasFlip } from '../components/bloques/BloqueTarjetasFlip'
import { BloqueComparador } from '../components/bloques/BloqueComparador'
import { BloqueChecklist } from '../components/bloques/BloqueChecklist'
import { BloqueCampoLibre } from '../components/bloques/BloqueCampoLibre'
import { BloqueTablaEditable } from '../components/bloques/BloqueTablaEditable'
import { BloqueSimuladorPrompt } from '../components/bloques/BloqueSimuladorPrompt'
import { BloqueCasoEtico } from '../components/bloques/BloqueCasoEtico'
import { BloqueResumenPersonal } from '../components/bloques/BloqueResumenPersonal'
import { BloqueMapa } from '../components/bloques/BloqueMapa'

/**
 * Vista previa local, exclusivamente para maestro/admin. No conecta con
 * escritura de Firestore y no envía respuestas a servicios de IA.
 * El progreso de esta vista vive solo en estado React.
 */
const emptyProgreso: ProgresoAlumno = {
    userId: 'preview',
    cursoId: cursoIAInteractivoV3.id,
    bloques_completados: [],
    bitacora: [],
    compromisos_encuadre: {},
    rol_construido: '',
    contexto_construido: '',
    prompt_maestro: '',
    calificacion_formativa: 0,
    calificacion_sumativa: 0,
    respuestas_diagnostica: {},
    auditoria_etica: [],
    compromisos_72h: {},
    updated_at: '',
}

function QuizPreview({ bloque }: { bloque: Bloque }) {
    const c = bloque.contenido as any
    const [respuestas, setRespuestas] = useState<Record<string, string | number>>({})
    const [verificado, setVerificado] = useState(false)
    return (
        <section className="p-5 md:p-7 space-y-5">
            <div>
                <h2 className="font-serif text-2xl text-cobalt">{c.titulo}</h2>
                <p className="text-sm text-graphite/60 mt-2">{c.subtitulo}</p>
                <p className="text-xs text-orange mt-2">Solo vista previa: no se guardan respuestas ni calificaciones.</p>
            </div>
            {(c.preguntas ?? []).map((p: any) => (
                <div className="space-y-2" key={p.id}>
                    <p className="font-medium text-sm text-graphite">{p.texto}</p>
                    {p.tipo === 'opcion_multiple'
                        ? (p.opciones ?? []).map((op: string, i: number) => (
                            <button
                                key={i}
                                type="button"
                                className={`block w-full text-left rounded-xl border px-4 py-3 text-sm ${respuestas[p.id] === i ? 'border-orange bg-orange/10' : 'border-graphite/10 bg-cream'}`}
                                onClick={() => { setRespuestas(s => ({ ...s, [p.id]: i })); setVerificado(false) }}
                            >
                                {op}
                            </button>
                        ))
                        : <textarea rows={3} className="w-full p-3 border rounded-xl bg-cream text-sm" placeholder="Escribe tu respuesta para revisar el diseño del instrumento" value={String(respuestas[p.id] ?? '')} onChange={e => { setRespuestas(s => ({ ...s, [p.id]: e.target.value })); setVerificado(false) }} />}
                    {verificado && p.tipo === 'opcion_multiple' && (
                        <p className="text-sm" role="status">{respuestas[p.id] === p.correcta ? '✓ Correcta' : `Respuesta esperada: ${p.opciones[p.correcta]}`}</p>
                    )}
                </div>
            ))}
            <button type="button" onClick={() => setVerificado(true)} className="btn-secondary">Revisar respuestas localmente</button>
        </section>
    )
}

function BloquePreview({ bloque, progreso, onProgresoUpdate }: {
    bloque: Bloque
    progreso: ProgresoAlumno
    onProgresoUpdate: (field: keyof ProgresoAlumno, value: unknown) => void
}) {
    const c = bloque.contenido as any
    switch (bloque.tipo) {
        case 'portada': return <BloquePortada contenido={c} progreso={progreso} />
        case 'texto': return <div className="p-5 md:p-7 prose max-w-none student-content" dangerouslySetInnerHTML={{ __html: c.html || '' }} />
        case 'infografia': return <BloqueInfografia contenido={c} />
        case 'tarjetas_flip': return <BloqueTarjetasFlip contenido={c} />
        case 'comparador': return <BloqueComparador contenido={c} />
        case 'checklist': return <BloqueChecklist contenido={c} progreso={progreso} onProgresoUpdate={onProgresoUpdate} />
        case 'campo_libre': return <BloqueCampoLibre contenido={c} progreso={progreso} onProgresoUpdate={onProgresoUpdate} />
        case 'tabla_editable': return <BloqueTablaEditable contenido={c} progreso={progreso} onProgresoUpdate={onProgresoUpdate} />
        case 'simulador_prompt': return (
            <div>
                <div className="mx-5 mt-5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
                    Simulador bloqueado en la vista previa para no ejecutar servicios remotos ni generar calificaciones demo. En DEV se verificará su integración.
                </div>
                <BloqueSimuladorPrompt contenido={c} progreso={progreso} isEditor />
            </div>
        )
        case 'caso_etico': return (
            <div>
                <div className="mx-5 mt-5 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">En esta vista no se envían reflexiones a Firestore.</div>
                <BloqueCasoEtico contenido={c} bloqueId={bloque.id} isEditor />
            </div>
        )
        case 'resumen_personal': return <BloqueResumenPersonal contenido={c} progreso={progreso} />
        case 'mapa_ecosistema': return <BloqueMapa contenido={c} />
        case 'cuestionario': return <QuizPreview key={bloque.id} bloque={bloque} />
        case 'simulador': return (
            <div className="p-5">
                <h2 className="font-serif text-2xl text-cobalt">{c.titulo}</h2>
                <p className="text-sm text-graphite/60 my-3">{c.instrucciones}</p>
                <iframe title={c.titulo} srcDoc={c.html} sandbox="allow-scripts" className="w-full rounded-xl border border-graphite/10 bg-white" style={{ height: c.altura_px || 380 }} />
            </div>
        )
        default: return <div className="p-6 text-graphite/60">Bloque no disponible en esta vista previa.</div>
    }
}

export function CursoIAInteractivoV3Preview() {
    const [indice, setIndice] = useState(0)
    const [progreso, setProgreso] = useState<ProgresoAlumno>(emptyProgreso)
    const bloque = bloquesIAInteractivoV3[indice]
    const meta = mapaDidacticoIAInteractivoV3[indice]
    const total = bloquesIAInteractivoV3.length
    const fases = useMemo(() => [...new Set(mapaDidacticoIAInteractivoV3.map(m => m.fase))], [])
    const onProgresoUpdate = (field: keyof ProgresoAlumno, value: unknown) => {
        setProgreso(p => ({ ...p, [field]: value, updated_at: new Date().toISOString() }))
    }

    return (
        <div className="max-w-5xl mx-auto space-y-4 pb-12">
            <header className="rounded-2xl bg-white p-4 md:p-6 border border-graphite/10 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-orange uppercase tracking-wider">iAprende · Laboratorio de cursos · Piloto 3.0</p>
                    <span className="text-xs rounded-full bg-amber-100 text-amber-900 px-3 py-1">Solo vista previa · sin guardado en Firebase</span>
                </div>
                <h1 className="font-serif text-2xl md:text-3xl text-cobalt">{cursoIAInteractivoV3.titulo}</h1>
                <p className="text-sm text-graphite/60">33 bloques · 14 tipos de interacción · 135 min. Verifica la experiencia con las herramientas reales de iAprende antes de cargar el curso.</p>
                <nav className="flex gap-2 flex-wrap" aria-label="Fases del curso">
                    {fases.map(f => {
                        const first = mapaDidacticoIAInteractivoV3.findIndex(m => m.fase === f)
                        return <button type="button" onClick={() => setIndice(first)} key={f} className={`px-3 py-2 rounded-lg text-xs font-medium ${meta.fase === f ? 'bg-cobalt text-white' : 'bg-cream text-cobalt'}`}>{f}</button>
                    })}
                </nav>
                <div className="h-2 rounded-full overflow-hidden bg-graphite/10" aria-label="Progreso del recorrido"><div className="h-full bg-orange transition-all" style={{ width: `${((indice + 1) / total) * 100}%` }} /></div>
                <div className="text-xs text-graphite/50 flex flex-wrap justify-between">
                    <span>Bloque {indice + 1} de {total} · {meta.tipo}</span>
                    <span>Tiempo sugerido: {meta.duracion_min} min</span>
                </div>
            </header>
            <main className="rounded-2xl bg-white border border-graphite/10 shadow-sm overflow-hidden min-h-[280px]">
                <BloquePreview key={bloque.id} bloque={bloque} progreso={progreso} onProgresoUpdate={onProgresoUpdate} />
            </main>
            <footer className="flex gap-3 justify-between">
                <button type="button" className="btn-secondary" onClick={() => setIndice(i => Math.max(0, i - 1))} disabled={indice === 0}>Anterior</button>
                <button type="button" className="btn-primary" onClick={() => setIndice(i => Math.min(total - 1, i + 1))} disabled={indice === total - 1}>Siguiente</button>
            </footer>
        </div>
    )
}
