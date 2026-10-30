import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useAuth } from '../context/AuthContext'
import {
    Plus, Eye, EyeOff, Trash2, ArrowRight, GripVertical, FileText, Image,
    ClipboardList, Code2, ChevronUp, ChevronDown, X, Sparkles, Cpu, Play,
    SplitSquareHorizontal, BookMarked, Wand2,
    BookOpen, Columns2, LayoutGrid, Table2, CheckSquare, PenLine, Scale, Map, UserCircle,
} from 'lucide-react'
import type { BloqueType, Bloque, InfoBox, InfoBoxPosition, InfoBoxColor, ImagenLayout } from '../types'
import { ImagenConCallouts, PositionPicker, CalloutColorPicker } from '../components/ImagenConCallouts'
import { QuizGenerator } from '../components/QuizGenerator'
import { SimulatorGenerator } from '../components/SimulatorGenerator'
import { CourseGeneratorModal } from '../components/CourseGeneratorModal'
import { BloquePortada } from '../components/bloques/BloquePortada'
import { BloqueInfografia } from '../components/bloques/BloqueInfografia'
import { BloqueTarjetasFlip } from '../components/bloques/BloqueTarjetasFlip'
import { BloqueComparador } from '../components/bloques/BloqueComparador'
import { BloqueChecklist } from '../components/bloques/BloqueChecklist'
import { BloqueCampoLibre } from '../components/bloques/BloqueCampoLibre'
import { BloqueTablaEditable } from '../components/bloques/BloqueTablaEditable'
import { BloqueSimuladorPrompt } from '../components/bloques/BloqueSimuladorPrompt'
import { BloqueCasoEtico } from '../components/bloques/BloqueCasoEtico'
import { BloqueMapa } from '../components/bloques/BloqueMapa'
import { BloqueResumenPersonal } from '../components/bloques/BloqueResumenPersonal'

export function CursosMaestro() {
    const { user } = useAuth()
    const { cursos, bloques, addCurso, deleteCurso, updateCurso } = useStore()
    const [showNew, setShowNew] = useState(false)
    const [showAIGenerator, setShowAIGenerator] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const misCursos = user?.rol === 'admin'
        ? cursos
        : cursos.filter((c) => c.maestro_id === user?.id || c.publicado)
    const handleCreate = () => {
        if (!newTitle.trim() || !user) return
        addCurso({ titulo: newTitle, descripcion: newDesc, maestro_id: user.id, publicado: false })
        setNewTitle(''); setNewDesc(''); setShowNew(false)
    }
    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl text-graphite">Mis Cursos</h1>
                    <p className="text-graphite/50 text-sm mt-1">{misCursos.length} curso{misCursos.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex gap-2">
                    {/* SP2: AI Course Generator */}
                    <button
                        onClick={() => setShowAIGenerator(true)}
                        className="btn-secondary gap-2"
                        title="Generar curso completo con IA"
                    >
                        <Wand2 className="w-4 h-4" />
                        Generar con IA
                    </button>
                    <button onClick={() => setShowNew(true)} className="btn-primary gap-2">
                        <Plus className="w-4 h-4" />Nuevo Curso
                    </button>
                </div>
            </div>
            {/* SP2: AI Course Generator Modal */}
            {showAIGenerator && user && (
                <CourseGeneratorModal
                    maestroId={user.id}
                    onClose={() => setShowAIGenerator(false)}
                />
            )}

            {showNew && (
                <div className="bg-white rounded-2xl shadow-soft border border-orange/20 p-5">
                    <h3 className="font-medium text-graphite mb-4">Crear nuevo curso</h3>
                    <div className="space-y-3">
                        <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-cream border border-graphite/10 text-graphite text-sm focus:outline-none focus:ring-2 focus:ring-orange/30"
                            placeholder="Titulo del curso" autoFocus />
                        <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-cream border border-graphite/10 text-graphite text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none"
                            rows={2} placeholder="Descripcion breve..." />
                        <div className="flex gap-2">
                            <button onClick={() => setShowNew(false)} className="btn-secondary">Cancelar</button>
                            <button onClick={handleCreate} className="btn-primary">Crear</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="space-y-3">
                {misCursos.map((curso) => {
                    const bloqueCount = bloques.filter((b) => b.curso_id === curso.id).length
                    return (
                        <div key={curso.id} className="bg-white rounded-2xl shadow-soft border border-graphite/5 p-5 hover:shadow-soft-lg transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-medium text-graphite">{curso.titulo}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${curso.publicado ? 'bg-green-50 text-green-600' : 'bg-graphite/5 text-graphite/40'}`}>
                                            {curso.publicado ? 'Publicado' : 'Borrador'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-graphite/50 line-clamp-1">{curso.descripcion}</p>
                                    <p className="text-xs text-graphite/30 font-mono mt-1">{bloqueCount} bloque{bloqueCount !== 1 ? 's' : ''}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button onClick={() => updateCurso(curso.id, { publicado: !curso.publicado })} className="btn-ghost p-2">
                                        {curso.publicado ? <EyeOff className="w-4 h-4 text-graphite/40" /> : <Eye className="w-4 h-4 text-green-500" />}
                                    </button>
                                    <button onClick={() => { if (confirm('Eliminar este curso?')) deleteCurso(curso.id) }} className="btn-ghost p-2">
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                    {user?.rol !== 'admin' && (
                                        <Link to={`/maestro/curso/${curso.id}/impartir`}
                                            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-orange/10 text-orange hover:bg-orange/20 transition-colors font-medium">
                                            <Play className="w-3 h-3" />Impartir
                                        </Link>
                                    )}
                                    <Link to={`/${user?.rol === 'admin' ? 'admin' : 'maestro'}/curso/${curso.id}/editar`}
                                        className="btn-primary gap-1 text-xs px-3 py-2">
                                        Editar<ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const blockTypes: { type: BloqueType; icon: typeof FileText; label: string; color: string }[] = [
    { type: 'texto', icon: FileText, label: 'Texto', color: 'text-cobalt bg-cobalt/10' },
    { type: 'imagen', icon: Image, label: 'Imagen', color: 'text-rose-600 bg-rose-50' },
    { type: 'carrusel', icon: SplitSquareHorizontal, label: 'Carrusel', color: 'text-mint-dark bg-mint/30' },
    { type: 'cuestionario', icon: ClipboardList, label: 'Cuestionario', color: 'text-orange bg-orange/10' },
    { type: 'simulador', icon: Code2, label: 'Simulador HTML', color: 'text-purple-600 bg-purple-50' },
    { type: 'portada', icon: BookOpen, label: 'Portada', color: 'text-cobalt bg-cobalt/10' },
    { type: 'comparador', icon: Columns2, label: 'Comparador', color: 'text-teal-600 bg-teal-50' },
    { type: 'infografia', icon: LayoutGrid, label: 'Infografía', color: 'text-green-600 bg-green-50' },
    { type: 'tarjetas_flip', icon: SplitSquareHorizontal, label: 'Tarjetas Flip', color: 'text-indigo-600 bg-indigo-50' },
    { type: 'tabla_editable', icon: Table2, label: 'Tabla', color: 'text-orange bg-orange/10' },
    { type: 'checklist', icon: CheckSquare, label: 'Checklist', color: 'text-green-600 bg-green-50' },
    { type: 'campo_libre', icon: PenLine, label: 'Campo Libre', color: 'text-cobalt bg-cobalt/10' },
    { type: 'simulador_prompt', icon: Cpu, label: 'Simulador Prompt', color: 'text-purple-600 bg-purple-50' },
    { type: 'caso_etico', icon: Scale, label: 'Caso Ético', color: 'text-purple-600 bg-purple-50' },
    { type: 'mapa_ecosistema', icon: Map, label: 'Mapa Ecosistema', color: 'text-teal-600 bg-teal-50' },
    { type: 'resumen_personal', icon: UserCircle, label: 'Resumen Personal', color: 'text-cobalt bg-cobalt/10' },
]

function defaultContent(tipo: BloqueType): Record<string, unknown> {
    switch (tipo) {
        case 'texto': return { html: '<h2>Nuevo bloque</h2><p>Escribe aqui...</p>' }
        case 'imagen': return { url: '', alt: '', caption: '', layout: 'completa', cuadros: [] }
        case 'carrusel': return { imagenes: [{ url: '', caption: 'Imagen 1' }] }
        case 'cuestionario': return { titulo: 'Nuevo cuestionario', preguntas: [{ id: `q-${Date.now()}`, texto: 'Pregunta de ejemplo', tipo: 'opcion_multiple', opciones: ['Opcion A', 'Opcion B', 'Opcion C', 'Opcion D'], correcta: 0, puntos: 25 }] }
        case 'simulador': return { titulo: 'Nuevo simulador', html: '<!DOCTYPE html><html><body><h1>Hola</h1></body></html>', instrucciones: 'Instrucciones...', altura_px: 350 }
        case 'portada': return { modulo_numero: 1, titulo: 'Nuevo Módulo', subtitulo: 'Descripción del módulo', gradient_from: '#2A4B7C', gradient_to: '#1a3456', icon_color: '#ffffff' }
        case 'comparador': return { titulo: 'Comparador', col_a_titulo: 'Opción A', col_b_titulo: 'Opción B', caracteristicas: ['Característica 1', 'Característica 2', 'Característica 3', 'Característica 4'], soluciones: {} }
        case 'infografia': return { titulo: 'Infografía', descripcion: '', pilares: [{ titulo: 'Pilar 1', descripcion: 'Descripción del pilar', color: 'mint', icono: '📌' }, { titulo: 'Pilar 2', descripcion: 'Descripción del pilar', color: 'lavender', icono: '💡' }, { titulo: 'Pilar 3', descripcion: 'Descripción del pilar', color: 'orange', icono: '🚀' }] }
        case 'tarjetas_flip': return { titulo: 'Tarjetas', descripcion: '', tarjetas: [{ frente: 'Frente', reverso: 'Reverso', color: '#2A4B7C' }, { frente: 'Frente 2', reverso: 'Reverso 2', color: '#E07A5F' }] }
        case 'tabla_editable': return { titulo: 'Tabla de registro', descripcion: '', columnas: 'Proceso,Tiempo/semana,¿Se repite?,Candidato IA', progreso_field: 'bitacora', filas_default: [['', '', 'No', 'No'], ['', '', 'No', 'No']] }
        case 'checklist': return { titulo: 'Lista de verificación', descripcion: '', items: ['Item 1', 'Item 2', 'Item 3'], progreso_field: 'auditoria_etica' }
        case 'campo_libre': return { titulo: 'Campo de escritura', descripcion: '', placeholder: 'Escribe aquí...', template: '', progreso_field: 'rol_construido' }
        case 'simulador_prompt': return { titulo: 'Simulador de Prompt', instrucciones: 'Construye tu prompt maestro usando los 5 componentes.', rubrica_sistema: '' }
        case 'caso_etico': return { titulo: 'Caso Ético', situacion: 'Describe la situación ética aquí...', preguntas: ['¿Cuál es el dilema principal?', '¿Qué harías tú?', '¿Qué valores están en juego?'] }
        case 'mapa_ecosistema': return { titulo: 'Mapa del Ecosistema', descripcion: '', categorias: [{ nombre: 'Categoría 1', color: '#2A4B7C', herramientas: ['Herramienta A', 'Herramienta B'] }] }
        case 'resumen_personal': return { titulo: 'Tu Resumen Personal', descripcion: 'Aquí verás todo lo que has construido durante el curso.' }
    }
}

export function CursoEditor({ cursoId }: { cursoId: string }) {
    const { cursos, bloques, addBloque, updateBloque, deleteBloque, updateCurso } = useStore()
    const curso = cursos.find((c) => c.id === cursoId)
    const cursoBloques = bloques.filter((b) => b.curso_id === cursoId).sort((a, b) => a.orden - b.orden)
    const [editingBlock, setEditingBlock] = useState<string | null>(null)
    const [quizGenForBlock, setQuizGenForBlock] = useState<string | null>(null)
    const [showSimGen, setShowSimGen] = useState(false)

    if (!curso) return <div className="text-graphite/40 font-mono text-sm">Curso no encontrado</div>

    const handleAddBlock = (tipo: BloqueType) => {
        addBloque({ curso_id: cursoId, orden: cursoBloques.length + 1, tipo, contenido: defaultContent(tipo) })
    }
    const moveBlock = (index: number, direction: -1 | 1) => {
        const other = index + direction
        if (other < 0 || other >= cursoBloques.length) return
        const a = cursoBloques[index]; const b = cursoBloques[other]
        updateBloque(a.id, { orden: b.orden }); updateBloque(b.id, { orden: a.orden })
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-soft border border-graphite/5 p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                        <input type="text" value={curso.titulo}
                            onChange={(e) => updateCurso(cursoId, { titulo: e.target.value })}
                            className="w-full text-2xl font-serif text-graphite bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                            placeholder="Titulo del curso" />
                        <textarea value={curso.descripcion}
                            onChange={(e) => updateCurso(cursoId, { descripcion: e.target.value })}
                            className="w-full text-sm text-graphite/60 bg-transparent border-none focus:outline-none focus:ring-0 p-0 mt-2 resize-none"
                            placeholder="Descripcion del curso..." rows={2} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono ${curso.publicado ? 'bg-green-50 text-green-600' : 'bg-graphite/5 text-graphite/40'}`}>
                        {curso.publicado ? 'Publicado' : 'Borrador'}
                    </span>
                </div>
                <div className="text-xs text-graphite/30 font-mono mt-3">{cursoBloques.length} bloques</div>
            </div>

            {cursoBloques.map((bloque, index) => {
                const typeConf = blockTypes.find((bt) => bt.type === bloque.tipo) || { type: bloque.tipo, icon: FileText, label: bloque.tipo, color: 'text-graphite bg-graphite/10' }
                const isEditing = editingBlock === bloque.id
                return (
                    <div key={bloque.id}>
                        {bloque.inicio_pagina && index > 0 && (
                            <div className="flex items-center gap-3 my-2 px-2">
                                <div className="flex-1 h-px border-t-2 border-dashed border-orange/30" />
                                <div className="flex items-center gap-1.5 text-xs text-orange/70 font-mono bg-orange/5 px-3 py-1 rounded-full">
                                    <BookMarked className="w-3 h-3" />Nueva pagina
                                </div>
                                <div className="flex-1 h-px border-t-2 border-dashed border-orange/30" />
                            </div>
                        )}
                        <div className="bg-white rounded-2xl shadow-soft border border-graphite/5 overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-graphite/5 bg-cream/30">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="w-4 h-4 text-graphite/20" />
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeConf.color}`}>
                                        <typeConf.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-graphite capitalize">{bloque.tipo}</span>
                                    <span className="text-xs text-graphite/30 font-mono">#{index + 1}</span>
                                    {bloque.inicio_pagina && <span className="text-xs bg-orange/10 text-orange px-2 py-0.5 rounded-full font-mono">pag.inicio</span>}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => updateBloque(bloque.id, { inicio_pagina: !bloque.inicio_pagina })}
                                        className={`p-1.5 rounded-lg transition-colors ${bloque.inicio_pagina ? 'bg-orange/10 text-orange' : 'text-graphite/30 hover:text-graphite hover:bg-cream'}`}
                                        title={bloque.inicio_pagina ? 'Quitar corte de pagina' : 'Nueva pagina aqui'}>
                                        <BookMarked className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => moveBlock(index, -1)} disabled={index === 0} className="btn-ghost p-1.5 disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                                    <button onClick={() => moveBlock(index, 1)} disabled={index === cursoBloques.length - 1} className="btn-ghost p-1.5 disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
                                    <button onClick={() => setEditingBlock(isEditing ? null : bloque.id)}
                                        className={`btn-ghost p-1.5 text-xs px-3 ${isEditing ? 'bg-orange/10 text-orange' : ''}`}>
                                        {isEditing ? 'Cerrar' : 'Editar'}
                                    </button>
                                    <button onClick={() => { if (confirm('Eliminar este bloque?')) deleteBloque(bloque.id) }} className="btn-ghost p-1.5">
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </div>
                            {isEditing && <div className="p-5"><BlockEditor bloque={bloque} onUpdate={(data) => updateBloque(bloque.id, { contenido: data })} /></div>}
                            {!isEditing && <div className="p-5"><BlockPreview bloque={bloque} /></div>}
                        </div>
                    </div>
                )
            })}

            <div className="bg-white/50 border-2 border-dashed border-graphite/10 rounded-2xl p-6">
                <p className="text-center text-sm text-graphite/40 mb-4">Agregar bloque</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {blockTypes.map((bt) => (
                        <button key={bt.type} onClick={() => handleAddBlock(bt.type)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-graphite/10 hover:border-orange/30 hover:shadow-soft transition-all text-sm text-graphite/60 hover:text-graphite">
                            <bt.icon className="w-4 h-4" />{bt.label}
                        </button>
                    ))}
                    <div className="w-px bg-graphite/10 mx-1" />
                    <button onClick={() => setQuizGenForBlock('__new__')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-orange/10 rounded-xl border border-orange/20 hover:bg-orange/20 transition-all text-sm text-orange font-medium">
                        <Sparkles className="w-4 h-4" />Quiz con IA
                    </button>
                    <button onClick={() => setShowSimGen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-all text-sm text-purple-600 font-medium">
                        <Cpu className="w-4 h-4" />Simulador IA
                    </button>
                </div>
            </div>

            {quizGenForBlock && (
                <QuizGenerator
                    blockContent={cursoBloques.filter(b => b.tipo === 'texto').map(b => (b.contenido as any).html || '').join('\n')}
                    courseTitle={curso.titulo}
                    onInsert={(quiz) => { addBloque({ curso_id: cursoId, orden: cursoBloques.length + 1, tipo: 'cuestionario', contenido: quiz }) }}
                    onClose={() => setQuizGenForBlock(null)}
                />
            )}
            {showSimGen && (
                <SimulatorGenerator
                    courseTitle={curso.titulo}
                    contextContent={cursoBloques.filter(b => b.tipo === 'texto').map(b => (b.contenido as any).html || '').join('\n')}
                    onInsert={(sim) => { addBloque({ curso_id: cursoId, orden: cursoBloques.length + 1, tipo: 'simulador', contenido: sim as unknown as Record<string, unknown> }); setShowSimGen(false) }}
                    onClose={() => setShowSimGen(false)}
                />
            )}
        </div>
    )
}

function BlockEditor({ bloque, onUpdate }: { bloque: Bloque; onUpdate: (c: Record<string, unknown>) => void }) {
    const c = bloque.contenido as any

    if (bloque.tipo === 'texto') {
        return (
            <div>
                <label className="block text-sm font-medium text-graphite mb-2">Contenido HTML</label>
                <textarea value={c.html || ''} onChange={(e) => onUpdate({ ...c, html: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cream border border-graphite/10 text-graphite text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 font-mono resize-none"
                    rows={10} placeholder="<h2>Titulo</h2><p>Contenido...</p>" />
            </div>
        )
    }

    if (bloque.tipo === 'imagen') {
        const cuadros = (c.cuadros || []) as InfoBox[]
        const layout: ImagenLayout = c.layout || 'completa'
        const updateCuadro = (idx: number, changes: Partial<InfoBox>) => {
            const updated = [...cuadros]; updated[idx] = { ...updated[idx], ...changes }; onUpdate({ ...c, cuadros: updated })
        }
        const removeCuadro = (idx: number) => { onUpdate({ ...c, cuadros: cuadros.filter((_, i) => i !== idx) }) }
        const addCuadro = () => {
            const newBox: InfoBox = { id: `box-${Date.now()}`, texto: 'Informacion', posicion: 'bottom-left', color: 'default' }
            onUpdate({ ...c, cuadros: [...cuadros, newBox] })
        }
        return (
            <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                        <label className="block text-xs font-medium text-graphite mb-1">URL de imagen</label>
                        <input type="text" value={c.url || ''} onChange={(e) => onUpdate({ ...c, url: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30"
                            placeholder="https://ejemplo.com/imagen.jpg" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-graphite mb-1">Texto alt</label>
                        <input type="text" value={c.alt || ''} onChange={(e) => onUpdate({ ...c, alt: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30"
                            placeholder="Descripcion accesible" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-graphite mb-1">Caption</label>
                        <input type="text" value={c.caption || ''} onChange={(e) => onUpdate({ ...c, caption: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30"
                            placeholder="Pie de foto..." />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-2">Posicion respecto al texto anterior</label>
                    <div className="flex gap-2">
                        {([['completa', 'Ancho completo'], ['derecha', 'Texto | Imagen'], ['izquierda', 'Imagen | Texto']] as [ImagenLayout, string][]).map(([val, lbl]) => (
                            <button key={val} type="button" onClick={() => onUpdate({ ...c, layout: val })}
                                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${layout === val ? 'bg-cobalt/10 text-cobalt border-cobalt/30' : 'bg-cream text-graphite/50 border-graphite/10 hover:border-graphite/20'}`}>
                                {lbl}
                            </button>
                        ))}
                    </div>
                </div>
                {c.url && (
                    <div>
                        <label className="block text-xs font-medium text-graphite mb-2">Vista previa con callouts</label>
                        <ImagenConCallouts url={c.url} alt={c.alt} caption={c.caption} cuadros={cuadros} layout={layout} maxHeight={220} />
                    </div>
                )}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-graphite">Cuadros informativos ({cuadros.length})</label>
                        <button type="button" onClick={addCuadro} className="flex items-center gap-1.5 text-xs text-orange hover:text-orange/70 transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Anadir cuadro
                        </button>
                    </div>
                    {cuadros.map((box, bi) => (
                        <div key={box.id} className="p-3 rounded-xl bg-cream border border-graphite/8 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <textarea value={box.texto} onChange={(e) => updateCuadro(bi, { texto: e.target.value })} rows={2}
                                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none"
                                    placeholder="Texto del cuadro..." />
                                <button onClick={() => removeCuadro(bi)} className="p-1.5 text-red-400 hover:text-red-600 mt-1"><X className="w-3.5 h-3.5" /></button>
                            </div>
                            <div className="flex items-end gap-6">
                                <div>
                                    <p className="text-xs text-graphite/40 mb-1.5">Posicion (3x3)</p>
                                    <PositionPicker value={box.posicion as InfoBoxPosition} onChange={(p) => updateCuadro(bi, { posicion: p })} />
                                </div>
                                <div>
                                    <p className="text-xs text-graphite/40 mb-1.5">Color</p>
                                    <CalloutColorPicker value={box.color as InfoBoxColor} onChange={(col) => updateCuadro(bi, { color: col })} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {cuadros.length === 0 && <p className="text-xs text-graphite/30 text-center py-3">Sin cuadros. Haz clic en Anadir cuadro.</p>}
                </div>
            </div>
        )
    }

    if (bloque.tipo === 'carrusel') {
        const imagenes = c.imagenes || []
        return (
            <div className="space-y-3">
                <label className="block text-sm font-medium text-graphite">Imagenes del carrusel</label>
                {imagenes.map((img: any, i: number) => (
                    <div key={i} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                            <input type="text" value={img.url} onChange={(e) => { const u = [...imagenes]; u[i] = { ...img, url: e.target.value }; onUpdate({ ...c, imagenes: u }) }}
                                className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" placeholder="URL de la imagen" />
                            <input type="text" value={img.caption} onChange={(e) => { const u = [...imagenes]; u[i] = { ...img, caption: e.target.value }; onUpdate({ ...c, imagenes: u }) }}
                                className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" placeholder="Caption" />
                        </div>
                        <button onClick={() => onUpdate({ ...c, imagenes: imagenes.filter((_: any, idx: number) => idx !== i) })} className="p-2 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                    </div>
                ))}
                <button onClick={() => onUpdate({ ...c, imagenes: [...imagenes, { url: '', caption: '' }] })} className="btn-ghost gap-1 text-sm text-orange">
                    <Plus className="w-4 h-4" /> Agregar imagen
                </button>
            </div>
        )
    }

    if (bloque.tipo === 'cuestionario') {
        const preguntas = c.preguntas || []
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-graphite mb-1.5">Titulo del cuestionario</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                {preguntas.map((preg: any, i: number) => (
                    <div key={preg.id} className="p-4 bg-cream rounded-xl border border-graphite/5 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-graphite/30">Pregunta {i + 1}</span>
                            <div className="flex items-center gap-2">
                                <select value={preg.tipo} onChange={(e) => { const u = [...preguntas]; u[i] = { ...preg, tipo: e.target.value }; onUpdate({ ...c, preguntas: u }) }}
                                    className="text-xs px-2 py-1 rounded-lg bg-white border border-graphite/10">
                                    <option value="opcion_multiple">Opcion multiple</option>
                                    <option value="abierta">Abierta</option>
                                </select>
                                <input type="number" value={preg.puntos} onChange={(e) => { const u = [...preguntas]; u[i] = { ...preg, puntos: parseInt(e.target.value) || 0 }; onUpdate({ ...c, preguntas: u }) }}
                                    className="w-16 text-xs px-2 py-1 rounded-lg bg-white border border-graphite/10 text-right" placeholder="Pts" />
                                <button onClick={() => onUpdate({ ...c, preguntas: preguntas.filter((_: any, idx: number) => idx !== i) })} className="text-red-400 hover:text-red-600 p-1"><X className="w-3 h-3" /></button>
                            </div>
                        </div>
                        <input type="text" value={preg.texto} onChange={(e) => { const u = [...preguntas]; u[i] = { ...preg, texto: e.target.value }; onUpdate({ ...c, preguntas: u }) }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" placeholder="Escribe la pregunta..." />
                        {preg.tipo === 'opcion_multiple' && (
                            <div className="space-y-1.5">
                                {(preg.opciones || []).map((opt: string, oi: number) => (
                                    <div key={oi} className="flex items-center gap-2">
                                        <button onClick={() => { const u = [...preguntas]; u[i] = { ...preg, correcta: oi }; onUpdate({ ...c, preguntas: u }) }}
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${preg.correcta === oi ? 'border-green-500 bg-green-500' : 'border-graphite/20'}`}>
                                            {preg.correcta === oi && <span className="text-white text-xs">v</span>}
                                        </button>
                                        <input type="text" value={opt} onChange={(e) => { const u = [...preguntas]; const opts = [...(preg.opciones || [])]; opts[oi] = e.target.value; u[i] = { ...preg, opciones: opts }; onUpdate({ ...c, preguntas: u }) }}
                                            className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <button onClick={() => { const nq = { id: `q-${Date.now()}`, texto: '', tipo: 'opcion_multiple', opciones: ['', '', '', ''], correcta: 0, puntos: 25 }; onUpdate({ ...c, preguntas: [...preguntas, nq] }) }}
                    className="btn-ghost gap-1 text-sm text-orange"><Plus className="w-4 h-4" /> Agregar pregunta</button>
            </div>
        )
    }

    if (bloque.tipo === 'simulador') {
        return (
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-graphite mb-1.5">Titulo</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-graphite mb-1.5">Instrucciones</label>
                    <input type="text" value={c.instrucciones || ''} onChange={(e) => onUpdate({ ...c, instrucciones: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-graphite mb-1.5">Codigo HTML</label>
                    <textarea value={c.html || ''} onChange={(e) => onUpdate({ ...c, html: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-graphite text-green-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 font-mono resize-none" rows={12} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-graphite mb-1.5">Altura del iframe (px)</label>
                    <input type="number" value={c.altura_px || 350} onChange={(e) => onUpdate({ ...c, altura_px: parseInt(e.target.value) || 350 })}
                        className="w-24 px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
            </div>
        )
    }

    if (bloque.tipo === 'portada') {
        return (
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-graphite mb-1">Número de módulo</label>
                        <input type="number" value={c.modulo_numero || 1} onChange={(e) => onUpdate({ ...c, modulo_numero: parseInt(e.target.value) || 1 })}
                            className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-graphite mb-1">Color del ícono</label>
                        <input type="color" value={c.icon_color || '#ffffff'} onChange={(e) => onUpdate({ ...c, icon_color: e.target.value })}
                            className="w-full h-9 px-1 py-1 rounded-lg bg-cream border border-graphite/10 cursor-pointer" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Título</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Subtítulo</label>
                    <input type="text" value={c.subtitulo || ''} onChange={(e) => onUpdate({ ...c, subtitulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-graphite mb-1">Color inicial (gradiente)</label>
                        <input type="color" value={c.gradient_from || '#2A4B7C'} onChange={(e) => onUpdate({ ...c, gradient_from: e.target.value })}
                            className="w-full h-9 px-1 py-1 rounded-lg bg-cream border border-graphite/10 cursor-pointer" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-graphite mb-1">Color final (gradiente)</label>
                        <input type="color" value={c.gradient_to || '#1a3456'} onChange={(e) => onUpdate({ ...c, gradient_to: e.target.value })}
                            className="w-full h-9 px-1 py-1 rounded-lg bg-cream border border-graphite/10 cursor-pointer" />
                    </div>
                </div>
            </div>
        )
    }

    if (bloque.tipo === 'infografia') {
        const pilares = c.pilares || []
        const colorOpts = ['mint', 'lavender', 'orange', 'cobalt', 'green', 'red']
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Título</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Descripción</label>
                    <input type="text" value={c.descripcion || ''} onChange={(e) => onUpdate({ ...c, descripcion: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                {pilares.map((pilar: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-cream border border-graphite/8 space-y-2">
                        <p className="text-xs font-semibold text-graphite/50">Pilar {i + 1}</p>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={pilar.titulo || ''} placeholder="Título"
                                onChange={(e) => { const p = [...pilares]; p[i] = { ...pilar, titulo: e.target.value }; onUpdate({ ...c, pilares: p }) }}
                                className="px-3 py-2 rounded-lg bg-white border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                            <div className="flex gap-1 items-center">
                                <span className="text-xs text-graphite/40">Color:</span>
                                <select value={pilar.color || 'mint'}
                                    onChange={(e) => { const p = [...pilares]; p[i] = { ...pilar, color: e.target.value }; onUpdate({ ...c, pilares: p }) }}
                                    className="flex-1 px-2 py-1.5 rounded-lg bg-white border border-graphite/10 text-xs text-graphite">
                                    {colorOpts.map(co => <option key={co} value={co}>{co}</option>)}
                                </select>
                            </div>
                        </div>
                        <textarea value={pilar.descripcion || ''} placeholder="Descripción" rows={2}
                            onChange={(e) => { const p = [...pilares]; p[i] = { ...pilar, descripcion: e.target.value }; onUpdate({ ...c, pilares: p }) }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none" />
                    </div>
                ))}
            </div>
        )
    }

    if (bloque.tipo === 'tarjetas_flip') {
        const tarjetas = c.tarjetas || []
        return (
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Título</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                {tarjetas.map((t: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-cream border border-graphite/8 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-graphite/50">Tarjeta {i + 1}</span>
                            <button onClick={() => onUpdate({ ...c, tarjetas: tarjetas.filter((_: any, idx: number) => idx !== i) })}
                                className="text-red-400 hover:text-red-600 p-1"><X className="w-3 h-3" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={t.frente || ''} placeholder="Frente (concepto)"
                                onChange={(e) => { const ts = [...tarjetas]; ts[i] = { ...t, frente: e.target.value }; onUpdate({ ...c, tarjetas: ts }) }}
                                className="px-3 py-2 rounded-lg bg-white border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                            <input type="color" value={t.color || '#2A4B7C'}
                                onChange={(e) => { const ts = [...tarjetas]; ts[i] = { ...t, color: e.target.value }; onUpdate({ ...c, tarjetas: ts }) }}
                                className="h-9 w-full px-1 py-1 rounded-lg bg-white border border-graphite/10 cursor-pointer" />
                        </div>
                        <textarea value={t.reverso || ''} placeholder="Reverso (explicación)" rows={2}
                            onChange={(e) => { const ts = [...tarjetas]; ts[i] = { ...t, reverso: e.target.value }; onUpdate({ ...c, tarjetas: ts }) }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none" />
                    </div>
                ))}
                <button onClick={() => onUpdate({ ...c, tarjetas: [...tarjetas, { frente: '', reverso: '', color: '#2A4B7C' }] })}
                    className="btn-ghost gap-1 text-sm text-orange"><Plus className="w-4 h-4" /> Agregar tarjeta</button>
            </div>
        )
    }

    if (bloque.tipo === 'comparador') {
        const cars = c.caracteristicas || []
        return (
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-graphite mb-1">Título columna A</label>
                        <input type="text" value={c.col_a_titulo || ''} onChange={(e) => onUpdate({ ...c, col_a_titulo: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-graphite mb-1">Título columna B</label>
                        <input type="text" value={c.col_b_titulo || ''} onChange={(e) => onUpdate({ ...c, col_b_titulo: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-graphite">Características ({cars.length})</label>
                        <button onClick={() => onUpdate({ ...c, caracteristicas: [...cars, ''] })}
                            className="flex items-center gap-1 text-xs text-orange hover:text-orange/70"><Plus className="w-3 h-3" /> Agregar</button>
                    </div>
                    <div className="space-y-1.5">
                        {cars.map((car: string, i: number) => (
                            <div key={i} className="flex gap-2">
                                <input type="text" value={car}
                                    onChange={(e) => { const cs = [...cars]; cs[i] = e.target.value; onUpdate({ ...c, caracteristicas: cs }) }}
                                    className="flex-1 px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30"
                                    placeholder={`Característica ${i + 1}`} />
                                <button onClick={() => onUpdate({ ...c, caracteristicas: cars.filter((_: any, idx: number) => idx !== i) })}
                                    className="p-2 text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (bloque.tipo === 'tabla_editable') {
        const progFieldOpts = ['bitacora']
        return (
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Título</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Columnas (separadas por coma)</label>
                    <input type="text" value={c.columnas || ''} onChange={(e) => onUpdate({ ...c, columnas: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30"
                        placeholder="Proceso,Tiempo/semana,¿Se repite?,Candidato IA" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Campo de progreso</label>
                    <select value={c.progreso_field || 'bitacora'} onChange={(e) => onUpdate({ ...c, progreso_field: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none">
                        {progFieldOpts.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
            </div>
        )
    }

    if (bloque.tipo === 'checklist') {
        const items = c.items || []
        const progFieldOpts = ['auditoria_etica', 'compromisos_72h', 'compromisos_encuadre']
        return (
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Título</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Campo de progreso</label>
                    <select value={c.progreso_field || 'auditoria_etica'} onChange={(e) => onUpdate({ ...c, progreso_field: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none">
                        {progFieldOpts.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-graphite">Items ({items.length})</label>
                        <button onClick={() => onUpdate({ ...c, items: [...items, ''] })}
                            className="flex items-center gap-1 text-xs text-orange hover:text-orange/70"><Plus className="w-3 h-3" /> Agregar</button>
                    </div>
                    <div className="space-y-1.5">
                        {items.map((item: string, i: number) => (
                            <div key={i} className="flex gap-2">
                                <input type="text" value={item}
                                    onChange={(e) => { const its = [...items]; its[i] = e.target.value; onUpdate({ ...c, items: its }) }}
                                    className="flex-1 px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30"
                                    placeholder={`Item ${i + 1}`} />
                                <button onClick={() => onUpdate({ ...c, items: items.filter((_: any, idx: number) => idx !== i) })}
                                    className="p-2 text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (bloque.tipo === 'campo_libre') {
        const progFieldOpts = ['rol_construido', 'contexto_construido', 'prompt_maestro']
        return (
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Título</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Descripción</label>
                    <input type="text" value={c.descripcion || ''} onChange={(e) => onUpdate({ ...c, descripcion: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Campo de progreso</label>
                    <select value={c.progreso_field || 'rol_construido'} onChange={(e) => onUpdate({ ...c, progreso_field: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none">
                        {progFieldOpts.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Placeholder</label>
                    <input type="text" value={c.placeholder || ''} onChange={(e) => onUpdate({ ...c, placeholder: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Plantilla inicial (opcional)</label>
                    <textarea value={c.template || ''} onChange={(e) => onUpdate({ ...c, template: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none" rows={3}
                        placeholder="Texto de inicio que verá el alumno..." />
                </div>
            </div>
        )
    }

    if (bloque.tipo === 'simulador_prompt') {
        return (
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Título</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Instrucciones para el alumno</label>
                    <textarea value={c.instrucciones || ''} onChange={(e) => onUpdate({ ...c, instrucciones: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none" rows={2} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Rúbrica del sistema (para la IA evaluadora)</label>
                    <textarea value={c.rubrica_sistema || ''} onChange={(e) => onUpdate({ ...c, rubrica_sistema: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 font-mono resize-none" rows={8}
                        placeholder="System prompt para la evaluación automática con IA..." />
                </div>
            </div>
        )
    }

    if (bloque.tipo === 'caso_etico') {
        const preguntas = c.preguntas || []
        return (
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Título</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Situación</label>
                    <textarea value={c.situacion || ''} onChange={(e) => onUpdate({ ...c, situacion: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none" rows={4} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-2">Preguntas de reflexión</label>
                    <div className="space-y-1.5">
                        {preguntas.map((p: string, i: number) => (
                            <div key={i} className="flex gap-2">
                                <input type="text" value={p}
                                    onChange={(e) => { const ps = [...preguntas]; ps[i] = e.target.value; onUpdate({ ...c, preguntas: ps }) }}
                                    className="flex-1 px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30"
                                    placeholder={`Pregunta ${i + 1}`} />
                                <button onClick={() => onUpdate({ ...c, preguntas: preguntas.filter((_: any, idx: number) => idx !== i) })}
                                    className="p-2 text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => onUpdate({ ...c, preguntas: [...preguntas, ''] })}
                        className="mt-2 btn-ghost gap-1 text-sm text-orange"><Plus className="w-4 h-4" /> Agregar pregunta</button>
                </div>
            </div>
        )
    }

    if (bloque.tipo === 'mapa_ecosistema') {
        const categorias = c.categorias || []
        return (
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Título</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-graphite">Categorías ({categorias.length})</label>
                        <button onClick={() => onUpdate({ ...c, categorias: [...categorias, { nombre: '', color: '#2A4B7C', herramientas: [] }] })}
                            className="flex items-center gap-1 text-xs text-orange hover:text-orange/70"><Plus className="w-3 h-3" /> Agregar</button>
                    </div>
                    <div className="space-y-3">
                        {categorias.map((cat: any, i: number) => (
                            <div key={i} className="p-3 rounded-xl bg-cream border border-graphite/8 space-y-2">
                                <div className="flex items-center gap-2">
                                    <input type="text" value={cat.nombre || ''} placeholder="Nombre de categoría"
                                        onChange={(e) => { const cs = [...categorias]; cs[i] = { ...cat, nombre: e.target.value }; onUpdate({ ...c, categorias: cs }) }}
                                        className="flex-1 px-3 py-2 rounded-lg bg-white border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                                    <input type="color" value={cat.color || '#2A4B7C'}
                                        onChange={(e) => { const cs = [...categorias]; cs[i] = { ...cat, color: e.target.value }; onUpdate({ ...c, categorias: cs }) }}
                                        className="w-10 h-9 px-1 py-1 rounded-lg bg-white border border-graphite/10 cursor-pointer" />
                                    <button onClick={() => onUpdate({ ...c, categorias: categorias.filter((_: any, idx: number) => idx !== i) })}
                                        className="p-1.5 text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                                </div>
                                <textarea value={(cat.herramientas || []).join(', ')} placeholder="Herramientas (separadas por coma)"
                                    onChange={(e) => { const cs = [...categorias]; cs[i] = { ...cat, herramientas: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) }; onUpdate({ ...c, categorias: cs }) }}
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-lg bg-white border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (bloque.tipo === 'resumen_personal') {
        return (
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Título</label>
                    <input type="text" value={c.titulo || ''} onChange={(e) => onUpdate({ ...c, titulo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-graphite mb-1">Descripción</label>
                    <textarea value={c.descripcion || ''} onChange={(e) => onUpdate({ ...c, descripcion: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none" rows={2} />
                </div>
                <p className="text-xs text-graphite/40 italic">Este bloque muestra automáticamente el progreso del alumno. No requiere configuración adicional.</p>
            </div>
        )
    }

    return null
}

function BlockPreview({ bloque }: { bloque: Bloque }) {
    const c = bloque.contenido as any
    if (bloque.tipo === 'texto') return <div className="prose prose-sm max-w-none text-graphite" dangerouslySetInnerHTML={{ __html: c.html || '' }} />
    if (bloque.tipo === 'imagen') {
        return <ImagenConCallouts url={c.url || ''} alt={c.alt || ''} caption={c.caption || ''} cuadros={(c.cuadros || []) as InfoBox[]} layout={(c.layout as ImagenLayout) || 'completa'} maxHeight={240} />
    }
    if (bloque.tipo === 'carrusel') {
        const imagenes = c.imagenes || []
        return (
            <div className="flex gap-3 overflow-x-auto pb-2">
                {imagenes.map((img: any, i: number) => (
                    <div key={i} className="flex-shrink-0 w-52">
                        {img.url ? <img src={img.url} alt={img.caption} className="w-52 h-36 object-cover rounded-xl" />
                            : <div className="w-52 h-36 bg-cream rounded-xl flex items-center justify-center text-graphite/20"><Image className="w-8 h-8" /></div>}
                        <p className="text-xs text-graphite/50 mt-1.5 text-center">{img.caption}</p>
                    </div>
                ))}
            </div>
        )
    }
    if (bloque.tipo === 'cuestionario') {
        const preguntas = c.preguntas || []
        return (
            <div className="space-y-3">
                <h4 className="font-medium text-graphite text-sm">{c.titulo || 'Cuestionario'}</h4>
                {preguntas.slice(0, 2).map((p: any, i: number) => (
                    <div key={p.id} className="text-sm text-graphite/60 flex gap-2">
                        <span className="text-graphite/30 font-mono">{i + 1}.</span><span>{p.texto}</span>
                        <span className="text-orange font-mono text-xs ml-auto">{p.puntos}pts</span>
                    </div>
                ))}
                {preguntas.length > 2 && <p className="text-xs text-graphite/30 font-mono">+{preguntas.length - 2} mas</p>}
            </div>
        )
    }
    if (bloque.tipo === 'simulador') {
        return (
            <div>
                <div className="flex items-center gap-2 mb-2"><Code2 className="w-4 h-4 text-purple-500" /><span className="text-sm font-medium text-graphite">{c.titulo || 'Simulador'}</span></div>
                {c.instrucciones && <p className="text-xs text-graphite/50 mb-3">{c.instrucciones}</p>}
                <iframe srcDoc={c.html || ''} sandbox="allow-scripts" className="w-full border border-graphite/10 rounded-xl" style={{ height: `${c.altura_px || 350}px` }} title={c.titulo || 'Simulador'} />
            </div>
        )
    }
    if (bloque.tipo === 'portada') return <BloquePortada contenido={c} isEditor />
    if (bloque.tipo === 'infografia') return <BloqueInfografia contenido={c} isEditor />
    if (bloque.tipo === 'tarjetas_flip') return <BloqueTarjetasFlip contenido={c} isEditor />
    if (bloque.tipo === 'comparador') return <BloqueComparador contenido={c} isEditor />
    if (bloque.tipo === 'checklist') return <BloqueChecklist contenido={c} isEditor />
    if (bloque.tipo === 'campo_libre') return <BloqueCampoLibre contenido={c} isEditor />
    if (bloque.tipo === 'tabla_editable') return <BloqueTablaEditable contenido={c} isEditor />
    if (bloque.tipo === 'simulador_prompt') return <BloqueSimuladorPrompt contenido={c} isEditor />
    if (bloque.tipo === 'caso_etico') return <BloqueCasoEtico contenido={c} bloqueId={bloque.id} isEditor />
    if (bloque.tipo === 'mapa_ecosistema') return <BloqueMapa contenido={c} isEditor />
    if (bloque.tipo === 'resumen_personal') return <BloqueResumenPersonal contenido={c} isEditor />
    return null
}
