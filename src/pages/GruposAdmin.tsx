import { useState } from 'react'
import { useStore } from '../store/useStore'
import { useAuth } from '../context/AuthContext'
import {
    Plus, Pencil, Trash2, Users, X, UserPlus, UserMinus,
    ChevronDown, ChevronUp, Check, XCircle, Clock, BookOpen, BookMarked,
} from 'lucide-react'

type Tab = 'alumnos' | 'solicitudes' | 'cursos'

export function GruposAdmin() {
    const { user } = useAuth()
    const {
        grupos, usuarios, grupoAlumnos, cursos, solicitudes, cursoGrupos,
        addGrupo, updateGrupo, deleteGrupo,
        addAlumnoToGrupo, removeAlumnoFromGrupo,
        aprobarSolicitud, rechazarSolicitud,
        addCursoToGrupo, removeCursoFromGrupo,
        getGrupoAlumnos, getMaestro,
    } = useStore()

    const isAdmin = user?.rol === 'admin'
    const isMaestro = user?.rol === 'maestro'

    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ nombre: '', descripcion: '', maestro_id: '' })
    const [expandedGrupo, setExpandedGrupo] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<Tab>('alumnos')

    const maestros = usuarios.filter((u) => u.rol === 'maestro')
    const allAlumnos = usuarios.filter((u) => u.rol === 'alumno')

    const visibleGrupos = isMaestro
        ? grupos.filter((g) => g.maestro_id === user!.id)
        : grupos

    const canManageGrupo = (grupoId: string) => {
        if (isAdmin) return true
        const g = grupos.find((g) => g.id === grupoId)
        return isMaestro && g?.maestro_id === user?.id
    }

    const openCreate = () => {
        setForm({ nombre: '', descripcion: '', maestro_id: isMaestro ? user!.id : (maestros[0]?.id || '') })
        setEditingId(null)
        setShowModal(true)
    }

    const openEdit = (g: typeof grupos[0]) => {
        setForm({ nombre: g.nombre, descripcion: g.descripcion, maestro_id: g.maestro_id })
        setEditingId(g.id)
        setShowModal(true)
    }

    const handleSave = () => {
        if (!form.nombre.trim()) return
        const maestroId = isMaestro ? user!.id : form.maestro_id
        if (editingId) {
            updateGrupo(editingId, { ...form, maestro_id: maestroId })
        } else {
            addGrupo({ ...form, maestro_id: maestroId })
        }
        setShowModal(false)
    }

    const handleDelete = (id: string) => {
        if (confirm('¿Eliminar este grupo y todas sus asignaciones?')) deleteGrupo(id)
    }

    const handleExpand = (grupoId: string) => {
        if (expandedGrupo === grupoId) {
            setExpandedGrupo(null)
        } else {
            setExpandedGrupo(grupoId)
            setActiveTab('alumnos')
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl text-graphite">Gestión de Grupos</h1>
                    <p className="text-graphite/50 text-sm mt-1">
                        {visibleGrupos.length} grupo{visibleGrupos.length !== 1 ? 's' : ''} registrado{visibleGrupos.length !== 1 ? 's' : ''}
                    </p>
                </div>
                {(isAdmin || isMaestro) && (
                    <button onClick={openCreate} className="btn-primary gap-2">
                        <Plus className="w-4 h-4" />
                        Nuevo Grupo
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {visibleGrupos.length === 0 && (
                    <div className="bg-white rounded-2xl p-10 text-center border border-graphite/5 text-graphite/30 text-sm font-mono">
                        No hay grupos registrados.
                    </div>
                )}

                {visibleGrupos.map((grupo) => {
                    const maestro = getMaestro(grupo.maestro_id)
                    const alumnos = getGrupoAlumnos(grupo.id)
                    const isExpanded = expandedGrupo === grupo.id
                    const canManage = canManageGrupo(grupo.id)

                    const solicitudesGrupo = solicitudes.filter(
                        (s) => s.grupo_id === grupo.id && s.estado === 'pendiente'
                    )
                    const cursosGrupo = cursoGrupos.filter((cg) => cg.grupo_id === grupo.id)
                    const alumnosNoInscritos = allAlumnos.filter((a) => !alumnos.find((al) => al.id === a.id))
                    const cursosNoAsignados = cursos.filter(
                        (c) => c.publicado && !cursosGrupo.find((cg) => cg.curso_id === c.id)
                    )

                    return (
                        <div key={grupo.id} className="bg-white rounded-2xl shadow-soft border border-graphite/5 overflow-hidden">
                            {/* Header */}
                            <div
                                className="p-5 flex items-center justify-between cursor-pointer hover:bg-cream/50 transition-colors"
                                onClick={() => handleExpand(grupo.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-cobalt/10 rounded-xl flex items-center justify-center">
                                        <Users className="w-5 h-5 text-cobalt" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-graphite">{grupo.nombre}</h3>
                                        <p className="text-xs text-graphite/40 mt-0.5">
                                            Maestro: <span className="text-cobalt">{maestro?.nombre} {maestro?.apellido}</span>
                                            {' · '}{alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''}
                                            {' · '}{cursosGrupo.length} curso{cursosGrupo.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {solicitudesGrupo.length > 0 && (
                                        <span className="px-2 py-0.5 bg-orange/10 text-orange text-xs font-bold rounded-full">
                                            {solicitudesGrupo.length} solicitud{solicitudesGrupo.length !== 1 ? 'es' : ''}
                                        </span>
                                    )}
                                    {canManage && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openEdit(grupo) }}
                                                className="btn-ghost p-2 rounded-lg"
                                            >
                                                <Pencil className="w-4 h-4 text-graphite/40" />
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(grupo.id) }}
                                                    className="btn-ghost p-2 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {isExpanded
                                        ? <ChevronUp className="w-4 h-4 text-graphite/30" />
                                        : <ChevronDown className="w-4 h-4 text-graphite/30" />
                                    }
                                </div>
                            </div>

                            {/* Expanded content with tabs */}
                            {isExpanded && (
                                <div className="border-t border-graphite/5">
                                    {grupo.descripcion && (
                                        <p className="px-5 pt-4 text-sm text-graphite/50">{grupo.descripcion}</p>
                                    )}

                                    {/* Tabs */}
                                    <div className="flex gap-1 px-5 pt-4">
                                        {(['alumnos', 'solicitudes', 'cursos'] as Tab[]).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize flex items-center gap-1.5 ${activeTab === tab
                                                    ? 'bg-cobalt/10 text-cobalt'
                                                    : 'text-graphite/50 hover:text-graphite hover:bg-graphite/5'
                                                    }`}
                                            >
                                                {tab === 'alumnos' && <Users className="w-3.5 h-3.5" />}
                                                {tab === 'solicitudes' && <Clock className="w-3.5 h-3.5" />}
                                                {tab === 'cursos' && <BookOpen className="w-3.5 h-3.5" />}
                                                {tab === 'alumnos' && `Alumnos (${alumnos.length})`}
                                                {tab === 'solicitudes' && (
                                                    <span className="flex items-center gap-1">
                                                        Solicitudes
                                                        {solicitudesGrupo.length > 0 && (
                                                            <span className="w-4 h-4 bg-orange text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                                                {solicitudesGrupo.length}
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                                {tab === 'cursos' && `Cursos (${cursosGrupo.length})`}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="p-5 bg-cream/30">
                                        {/* ── Tab Alumnos ── */}
                                        {activeTab === 'alumnos' && (
                                            <div className="space-y-4">
                                                {alumnos.length === 0 ? (
                                                    <p className="text-sm text-graphite/30 italic">Sin alumnos inscritos</p>
                                                ) : (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {alumnos.map((alumno) => (
                                                            <div key={alumno.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-graphite/5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-cobalt/10 rounded-full flex items-center justify-center text-xs font-bold text-cobalt">
                                                                        {(alumno.nombre?.[0] ?? alumno.email[0]).toUpperCase()}{(alumno.apellido?.[0] ?? '').toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-medium text-graphite">{alumno.nombre} {alumno.apellido}</div>
                                                                        <div className="text-xs text-graphite/40">{alumno.email}</div>
                                                                    </div>
                                                                </div>
                                                                {canManage && (
                                                                    <button
                                                                        onClick={() => removeAlumnoFromGrupo(grupo.id, alumno.id)}
                                                                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                                                                        title="Remover del grupo"
                                                                    >
                                                                        <UserMinus className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {canManage && alumnosNoInscritos.length > 0 && (
                                                    <div>
                                                        <h4 className="text-sm font-medium text-graphite mb-2 flex items-center gap-2">
                                                            <UserPlus className="w-4 h-4 text-orange" />
                                                            Agregar alumno directamente
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {alumnosNoInscritos.map((a) => (
                                                                <button
                                                                    key={a.id}
                                                                    onClick={() => addAlumnoToGrupo(grupo.id, a.id)}
                                                                    className="px-3 py-1.5 bg-white border border-graphite/10 hover:border-orange/40 rounded-lg text-sm text-graphite/60 hover:text-orange transition-all"
                                                                >
                                                                    + {a.nombre} {a.apellido}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ── Tab Solicitudes ── */}
                                        {activeTab === 'solicitudes' && (
                                            <SolicitudesTab
                                                grupoId={grupo.id}
                                                solicitudes={solicitudes.filter((s) => s.grupo_id === grupo.id)}
                                                usuarios={usuarios}
                                                canManage={canManage}
                                                onAprobar={aprobarSolicitud}
                                                onRechazar={rechazarSolicitud}
                                            />
                                        )}

                                        {/* ── Tab Cursos ── */}
                                        {activeTab === 'cursos' && (
                                            <div className="space-y-4">
                                                {cursosGrupo.length === 0 ? (
                                                    <p className="text-sm text-graphite/30 italic">Sin cursos asignados a este grupo</p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {cursosGrupo.map((cg) => {
                                                            const curso = cursos.find((c) => c.id === cg.curso_id)
                                                            if (!curso) return null
                                                            return (
                                                                <div key={cg.curso_id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-graphite/5">
                                                                    <div className="flex items-center gap-3">
                                                                        <BookMarked className="w-4 h-4 text-orange" />
                                                                        <div>
                                                                            <div className="text-sm font-medium text-graphite">{curso.titulo}</div>
                                                                            <div className="text-xs text-graphite/40">{curso.descripcion?.slice(0, 50)}{curso.descripcion && curso.descripcion.length > 50 ? '…' : ''}</div>
                                                                        </div>
                                                                    </div>
                                                                    {canManage && (
                                                                        <button
                                                                            onClick={() => removeCursoFromGrupo(cg.curso_id, grupo.id)}
                                                                            className="text-red-400 hover:text-red-600 p-1 transition-colors"
                                                                            title="Quitar curso del grupo"
                                                                        >
                                                                            <X className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}

                                                {canManage && cursosNoAsignados.length > 0 && (
                                                    <div>
                                                        <h4 className="text-sm font-medium text-graphite mb-2 flex items-center gap-2">
                                                            <Plus className="w-4 h-4 text-cobalt" />
                                                            Asignar curso publicado
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cursosNoAsignados.map((c) => (
                                                                <button
                                                                    key={c.id}
                                                                    onClick={() => addCursoToGrupo(c.id, grupo.id)}
                                                                    className="px-3 py-1.5 bg-white border border-graphite/10 hover:border-cobalt/40 rounded-lg text-sm text-graphite/60 hover:text-cobalt transition-all"
                                                                >
                                                                    + {c.titulo}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Modal Crear/Editar */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-serif text-xl text-graphite">{editingId ? 'Editar Grupo' : 'Nuevo Grupo'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 text-graphite/30 hover:text-graphite transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-graphite mb-1.5">Nombre del grupo</label>
                                <input
                                    type="text"
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-cream border border-graphite/10 text-graphite text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
                                    placeholder="Ej: Turno Matutino A"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-graphite mb-1.5">Descripción</label>
                                <textarea
                                    value={form.descripcion}
                                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-cream border border-graphite/10 text-graphite text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all resize-none"
                                    rows={3}
                                    placeholder="Descripción opcional..."
                                />
                            </div>
                            {isAdmin && (
                                <div>
                                    <label className="block text-sm font-medium text-graphite mb-1.5">Maestro asignado</label>
                                    <select
                                        value={form.maestro_id}
                                        onChange={(e) => setForm({ ...form, maestro_id: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-cream border border-graphite/10 text-graphite text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
                                    >
                                        {maestros.map((m) => (
                                            <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                            <button onClick={handleSave} className="btn-primary flex-1">{editingId ? 'Guardar' : 'Crear'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Sub-componente de solicitudes ─────────────────────────────────────────────
function SolicitudesTab({
    grupoId, solicitudes, usuarios, canManage, onAprobar, onRechazar,
}: {
    grupoId: string
    solicitudes: import('../types').SolicitudInscripcion[]
    usuarios: import('../types').AppUser[]
    canManage: boolean
    onAprobar: (id: string, grupoId: string, alumnoId: string) => Promise<void>
    onRechazar: (id: string) => Promise<void>
}) {
    const [loading, setLoading] = useState<Record<string, boolean>>({})

    const act = async (fn: () => Promise<void>, key: string) => {
        setLoading((prev) => ({ ...prev, [key]: true }))
        try { await fn() } finally { setLoading((prev) => ({ ...prev, [key]: false })) }
    }

    const pendientes = solicitudes.filter((s) => s.estado === 'pendiente')
    const historial = solicitudes.filter((s) => s.estado !== 'pendiente')

    return (
        <div className="space-y-4">
            {pendientes.length === 0 && (
                <p className="text-sm text-graphite/30 italic">Sin solicitudes pendientes</p>
            )}
            {pendientes.map((s) => {
                const alumno = usuarios.find((u) => u.id === s.alumno_id)
                return (
                    <div key={s.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-orange/20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange/10 rounded-full flex items-center justify-center text-xs font-bold text-orange">
                                {(alumno?.nombre?.[0] ?? '?').toUpperCase()}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-graphite">{alumno?.nombre} {alumno?.apellido}</div>
                                <div className="text-xs text-graphite/40">{alumno?.email}</div>
                                {s.mensaje && (
                                    <div className="text-xs text-graphite/50 mt-0.5 italic">"{s.mensaje}"</div>
                                )}
                            </div>
                        </div>
                        {canManage && (
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => act(() => onAprobar(s.id, grupoId, s.alumno_id), `aprobar_${s.id}`)}
                                    disabled={loading[`aprobar_${s.id}`]}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    Aprobar
                                </button>
                                <button
                                    onClick={() => act(() => onRechazar(s.id), `rechazar_${s.id}`)}
                                    disabled={loading[`rechazar_${s.id}`]}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Rechazar
                                </button>
                            </div>
                        )}
                    </div>
                )
            })}

            {historial.length > 0 && (
                <div>
                    <h4 className="text-xs font-medium text-graphite/40 uppercase tracking-wider mb-2">Historial</h4>
                    <div className="space-y-1.5">
                        {historial.map((s) => {
                            const alumno = usuarios.find((u) => u.id === s.alumno_id)
                            return (
                                <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-graphite/3 border border-graphite/5">
                                    <span className="text-sm text-graphite/60">{alumno?.nombre} {alumno?.apellido}</span>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.estado === 'aprobada'
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-red-50 text-red-600'
                                        }`}>
                                        {s.estado}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
