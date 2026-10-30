import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Plus, Clock, CheckCircle2, XCircle, BookOpen, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useAuth } from '../context/AuthContext'

export function GruposAlumno() {
    const { user } = useAuth()
    const {
        grupos, solicitudes,
        addSolicitud, getGruposDeAlumno, getCursosDeGrupo, getMaestro,
    } = useStore()

    const [mensajes, setMensajes] = useState<Record<string, string>>({})
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())

    if (!user) return null

    const misGrupos = getGruposDeAlumno(user.id)
    const misSolicitudes = solicitudes.filter((s) => s.alumno_id === user.id)

    const gruposConSolicitud = new Set(
        misSolicitudes.filter((s) => s.estado !== 'rechazada').map((s) => s.grupo_id)
    )
    const gruposYaMiembro = new Set(misGrupos.map((g) => g.id))

    const gruposDisponibles = grupos.filter(
        (g) => !gruposYaMiembro.has(g.id) && !gruposConSolicitud.has(g.id)
    )

    const solicitudesPendientes = misSolicitudes.filter((s) => s.estado === 'pendiente')
    const solicitudesRechazadas = misSolicitudes.filter((s) => s.estado === 'rechazada')

    const handleSolicitar = async (grupoId: string) => {
        setLoadingIds((prev) => new Set(prev).add(grupoId))
        try {
            await addSolicitud(grupoId, user.id, mensajes[grupoId] || '')
            setMensajes((prev) => ({ ...prev, [grupoId]: '' }))
        } finally {
            setLoadingIds((prev) => {
                const next = new Set(prev)
                next.delete(grupoId)
                return next
            })
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="font-serif text-3xl text-graphite">Mis Grupos</h1>
                <p className="text-graphite/50 text-sm mt-1">
                    Solicita acceso a un grupo para ver sus cursos asignados.
                </p>
            </div>

            {/* Grupos en los que participo */}
            {misGrupos.length > 0 && (
                <section>
                    <h2 className="font-serif text-xl text-graphite mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Grupos en los que participo
                    </h2>
                    <div className="space-y-4">
                        {misGrupos.map((grupo) => {
                            const maestro = getMaestro(grupo.maestro_id)
                            const cursosGrupo = getCursosDeGrupo(grupo.id)
                            return (
                                <div key={grupo.id} className="bg-white rounded-2xl p-5 shadow-soft border border-graphite/5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-11 h-11 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Users className="w-5 h-5 text-cobalt" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-graphite">{grupo.nombre}</h3>
                                            {grupo.descripcion && (
                                                <p className="text-xs text-graphite/40 mt-0.5">{grupo.descripcion}</p>
                                            )}
                                            <p className="text-xs text-graphite/30 mt-0.5">
                                                Maestro: {maestro?.nombre} {maestro?.apellido}
                                            </p>
                                            {cursosGrupo.length > 0 ? (
                                                <div className="mt-3 space-y-1.5">
                                                    <p className="text-xs font-medium text-graphite/50 uppercase tracking-wider">
                                                        Cursos disponibles
                                                    </p>
                                                    {cursosGrupo.map((c) => (
                                                        <Link
                                                            key={c.id}
                                                            to={`/app/curso/${c.id}`}
                                                            className="flex items-center justify-between px-3 py-2 bg-orange/5 hover:bg-orange/10 rounded-lg transition-colors group"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <BookOpen className="w-3.5 h-3.5 text-orange" />
                                                                <span className="text-sm text-graphite group-hover:text-orange transition-colors">{c.titulo}</span>
                                                            </div>
                                                            <ArrowRight className="w-3.5 h-3.5 text-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-graphite/30 mt-3 italic">Sin cursos asignados aún</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Solicitudes pendientes */}
            {solicitudesPendientes.length > 0 && (
                <section>
                    <h2 className="font-serif text-xl text-graphite mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange" />
                        Esperando autorización
                    </h2>
                    <div className="space-y-2">
                        {solicitudesPendientes.map((s) => {
                            const grupo = grupos.find((g) => g.id === s.grupo_id)
                            const maestro = grupo ? getMaestro(grupo.maestro_id) : null
                            return (
                                <div key={s.id} className="flex items-center justify-between bg-orange/5 border border-orange/20 rounded-xl px-4 py-3">
                                    <div>
                                        <span className="text-sm font-medium text-graphite">{grupo?.nombre}</span>
                                        <span className="ml-2 text-xs text-graphite/40">
                                            · Maestro: {maestro?.nombre} {maestro?.apellido}
                                        </span>
                                        {s.mensaje && (
                                            <p className="text-xs text-graphite/40 mt-0.5 italic">Tu mensaje: "{s.mensaje}"</p>
                                        )}
                                    </div>
                                    <span className="flex items-center gap-1.5 text-xs text-orange font-medium">
                                        <Clock className="w-3.5 h-3.5" />
                                        Pendiente
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Solicitudes rechazadas (mostrar para que puedan re-solicitar) */}
            {solicitudesRechazadas.length > 0 && (
                <section>
                    <h2 className="font-serif text-xl text-graphite mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-400" />
                        Solicitudes no autorizadas
                    </h2>
                    <div className="space-y-2">
                        {solicitudesRechazadas.map((s) => {
                            const grupo = grupos.find((g) => g.id === s.grupo_id)
                            return (
                                <div key={s.id} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                    <span className="text-sm font-medium text-graphite">{grupo?.nombre}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-red-500 font-medium">No autorizada</span>
                                        <button
                                            onClick={() => handleSolicitar(s.grupo_id)}
                                            disabled={loadingIds.has(s.grupo_id)}
                                            className="text-xs text-cobalt hover:underline disabled:opacity-50"
                                        >
                                            Solicitar de nuevo
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Grupos disponibles */}
            {gruposDisponibles.length > 0 && (
                <section>
                    <h2 className="font-serif text-xl text-graphite mb-4">Grupos disponibles</h2>
                    <div className="space-y-3">
                        {gruposDisponibles.map((grupo) => {
                            const maestro = getMaestro(grupo.maestro_id)
                            const isLoading = loadingIds.has(grupo.id)
                            return (
                                <div key={grupo.id} className="bg-white rounded-2xl p-5 shadow-soft border border-graphite/5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-graphite/5 rounded-xl flex items-center justify-center">
                                                <Users className="w-5 h-5 text-graphite/30" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-graphite">{grupo.nombre}</h3>
                                                {grupo.descripcion && (
                                                    <p className="text-xs text-graphite/40 mt-0.5">{grupo.descripcion}</p>
                                                )}
                                                <p className="text-xs text-graphite/30 mt-0.5">
                                                    Maestro: {maestro?.nombre} {maestro?.apellido}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSolicitar(grupo.id)}
                                            disabled={isLoading}
                                            className="btn-primary text-sm flex-shrink-0 gap-1.5 disabled:opacity-50"
                                        >
                                            <Plus className="w-4 h-4" />
                                            {isLoading ? 'Enviando…' : 'Solicitar ingreso'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {misGrupos.length === 0 && gruposDisponibles.length === 0 && solicitudesPendientes.length === 0 && (
                <div className="bg-white rounded-2xl p-10 text-center border border-graphite/5">
                    <Users className="w-10 h-10 text-graphite/20 mx-auto mb-3" />
                    <p className="text-graphite/30 text-sm font-mono">No hay grupos disponibles en este momento.</p>
                    <p className="text-graphite/20 text-xs mt-1">Contacta a tu maestro o administrador.</p>
                </div>
            )}
        </div>
    )
}
