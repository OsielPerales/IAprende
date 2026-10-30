import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, BarChart3, TrendingUp, Clock, CheckCircle2, Database, Loader2, CheckCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useAuth } from '../context/AuthContext'
import { KnowledgeGapCard } from '../components/KnowledgeGapCard'
import { AnalyticsChat } from '../components/AnalyticsChat'
import { db } from '../lib/firebase'
import { doc, setDoc, collection, addDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore'
import { cursoIA, bloquesIA } from '../store/seedCursoIA'

export function AlumnoDashboard() {
    const { user } = useAuth()
    const { respuestas, alumnoAnalyticsMap, setAlumnoAnalytics, getCursosDeAlumno, getGruposDeAlumno, solicitudes } = useStore()

    if (!user) return null

    const misRespuestas = respuestas.filter(r => r.alumno_id === user.id)
    const calificadas = misRespuestas.filter(r => r.calificacion !== undefined && r.calificacion !== null)
    const promedio = calificadas.length
        ? Math.round(calificadas.reduce((a, r) => a + (r.calificacion ?? 0), 0) / calificadas.length)
        : 0

    const misCursos = getCursosDeAlumno(user.id)
    const misGrupos = getGruposDeAlumno(user.id)
    const solicitudesPendientes = solicitudes.filter(s => s.alumno_id === user.id && s.estado === 'pendiente')

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="font-serif text-3xl text-graphite mb-1">
                    Hola, {user.nombre} 👋
                </h1>
                <p className="text-graphite/50 text-sm">Bienvenido de vuelta. Aquí está tu progreso.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                    { icon: BookOpen, label: 'Mis cursos', value: String(misCursos.length), color: 'text-orange', bg: 'bg-orange/10' },
                    { icon: Users, label: 'Mis grupos', value: String(misGrupos.length), color: 'text-cobalt', bg: 'bg-cobalt/10' },
                    { icon: CheckCircle2, label: 'Respuestas enviadas', value: String(misRespuestas.length), color: 'text-green-600', bg: 'bg-green-50' },
                    { icon: BarChart3, label: 'Promedio', value: calificadas.length ? `${promedio}` : '—', color: 'text-orange', bg: 'bg-orange/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-soft border border-graphite/5">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="font-mono text-2xl font-bold text-graphite">{stat.value}</div>
                        <div className="text-xs text-graphite/40 mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Banner de solicitudes pendientes */}
            {solicitudesPendientes.length > 0 && (
                <div className="bg-orange/5 border border-orange/20 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange flex-shrink-0" />
                        <p className="text-sm text-graphite">
                            Tienes <strong>{solicitudesPendientes.length}</strong> solicitud{solicitudesPendientes.length !== 1 ? 'es' : ''} de grupo pendiente{solicitudesPendientes.length !== 1 ? 's' : ''} de autorización.
                        </p>
                    </div>
                    <Link to="/app/grupos" className="text-xs text-orange font-medium hover:underline flex-shrink-0">
                        Ver grupos →
                    </Link>
                </div>
            )}

            {/* SP4: Knowledge Gap Card */}
            <KnowledgeGapCard
                alumnoId={user.id}
                analytics={alumnoAnalyticsMap[user.id] ?? null}
                onRefresh={(data) => setAlumnoAnalytics(user.id, data)}
            />

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl text-graphite">Mis cursos</h2>
                    <Link to="/app/grupos" className="text-xs text-cobalt hover:underline">
                        Gestionar grupos →
                    </Link>
                </div>
                {misCursos.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center border border-graphite/5">
                        <p className="text-graphite/30 text-sm font-mono">No hay cursos asignados a tus grupos.</p>
                        <Link to="/app/grupos" className="text-xs text-orange mt-2 block hover:underline">
                            Solicitar acceso a un grupo →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {misCursos.map((curso) => (
                            <Link
                                key={curso.id}
                                to={`/app/curso/${curso.id}`}
                                className="block bg-white rounded-2xl p-5 shadow-soft border border-graphite/5 hover:shadow-soft-lg transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-graphite">{curso.titulo}</h3>
                                    <span className="text-xs text-orange font-medium">Ver curso →</span>
                                </div>
                                {curso.descripcion && (
                                    <p className="text-sm text-graphite/50 mt-1 truncate">{curso.descripcion}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export function MaestroDashboard() {
    const { user } = useAuth()
    const { cursos, grupos, respuestas, usuarios } = useStore()

    if (!user) return null

    const pendientesCalificar = respuestas.filter(r => r.calificacion === undefined || r.calificacion === null)
    const alumnos = usuarios.filter(u => u.rol === 'alumno')

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="font-serif text-3xl text-graphite mb-1">Panel Docente</h1>
                <p className="text-graphite/50 text-sm">Gestiona tus cursos y revisa el progreso de tus grupos.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                    { icon: BookOpen, label: 'Cursos', value: String(cursos.length), color: 'text-orange', bg: 'bg-orange/10' },
                    { icon: Users, label: 'Alumnos activos', value: String(alumnos.length), color: 'text-cobalt', bg: 'bg-cobalt/10' },
                    { icon: TrendingUp, label: 'Grupos', value: String(grupos.length), color: 'text-green-600', bg: 'bg-green-50' },
                    { icon: Clock, label: 'Por calificar', value: String(pendientesCalificar.length), color: 'text-orange', bg: 'bg-orange/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-soft border border-graphite/5">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="font-mono text-2xl font-bold text-graphite">{stat.value}</div>
                        <div className="text-xs text-graphite/40 mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* SP3: Analytics Chat */}
            <AnalyticsChat maestroId={user.id} />

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-graphite/5">
                    <h2 className="font-serif text-lg text-graphite mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-cobalt" />
                        Mis Grupos
                    </h2>
                    {grupos.length === 0 ? (
                        <p className="text-sm text-graphite/30 font-mono">Sin grupos creados aún.</p>
                    ) : (
                        <div className="space-y-3">
                            {grupos.slice(0, 4).map((g) => (
                                <div key={g.id} className="p-4 bg-cream rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-graphite text-sm">{g.nombre}</div>
                                        <div className="text-xs text-graphite/40 mt-0.5">{g.descripcion || 'Sin descripción'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-soft border border-graphite/5">
                    <h2 className="font-serif text-lg text-graphite mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-orange" />
                        Últimas respuestas
                    </h2>
                    {respuestas.length === 0 ? (
                        <p className="text-sm text-graphite/30 font-mono">Sin respuestas aún.</p>
                    ) : (
                        <div className="space-y-3">
                            {respuestas.slice(0, 5).map((r) => {
                                const alumno = usuarios.find(u => u.id === r.alumno_id)
                                return (
                                    <div key={r.id} className="p-3 bg-cream rounded-xl flex items-center justify-between">
                                        <div className="text-sm font-medium text-graphite">
                                            {alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Alumno'}
                                        </div>
                                        <span className={`font-mono text-sm font-bold ${r.calificacion != null ? (r.calificacion >= 80 ? 'text-green-600' : r.calificacion >= 60 ? 'text-orange' : 'text-red-500') : 'text-graphite/30'}`}>
                                            {r.calificacion != null ? r.calificacion : 'Pendiente'}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export function AdminDashboard() {
    const { usuarios, cursos, grupos, respuestas } = useStore()
    const { user } = useAuth()
    const [seedStatus, setSeedStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
    const [seedMsg, setSeedMsg] = useState('')

    const handleSeedCurso = async () => {
        setSeedStatus('loading')
        setSeedMsg('')
        try {
            const maestroId = user?.id || cursoIA.maestro_id

            // 1. Delete all existing blocks for this course to avoid orphans
            const oldSnap = await getDocs(query(collection(db, 'bloques'), where('curso_id', '==', cursoIA.id)))
            const deletePromises = oldSnap.docs.map(d => deleteDoc(doc(db, 'bloques', d.id)))
            await Promise.all(deletePromises)

            // 2. Write (or overwrite) the course document
            await setDoc(doc(db, 'cursos', cursoIA.id), { ...cursoIA, maestro_id: maestroId })

            // 3. Write all 45 blocks
            for (const bloque of bloquesIA) {
                await setDoc(doc(db, 'bloques', bloque.id), bloque)
            }

            setSeedStatus('done')
            setSeedMsg(`Curso re-cargado: ${oldSnap.size} bloques eliminados → ${bloquesIA.length} bloques nuevos creados.`)
        } catch (e: any) {
            setSeedStatus('error')
            setSeedMsg(`Error: ${e.message}`)
        }
    }

    const admins = usuarios.filter(u => u.rol === 'admin').length
    const maestros = usuarios.filter(u => u.rol === 'maestro').length
    const alumnos = usuarios.filter(u => u.rol === 'alumno').length
    const calificadas = respuestas.filter(r => r.calificacion != null).length
    const tasaCompletacion = respuestas.length
        ? Math.round((calificadas / respuestas.length) * 100)
        : 0

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="font-serif text-3xl text-graphite mb-1">Administración</h1>
                <p className="text-graphite/50 text-sm">Gestión integral de la plataforma iAprende.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                    { icon: Users, label: 'Usuarios totales', value: String(usuarios.length), color: 'text-cobalt', bg: 'bg-cobalt/10' },
                    { icon: BookOpen, label: 'Cursos', value: String(cursos.length), color: 'text-orange', bg: 'bg-orange/10' },
                    { icon: Users, label: 'Grupos activos', value: String(grupos.length), color: 'text-green-600', bg: 'bg-green-50' },
                    { icon: TrendingUp, label: 'Tasa calificación', value: respuestas.length ? `${tasaCompletacion}%` : '—', color: 'text-green-600', bg: 'bg-green-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-soft border border-graphite/5">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="font-mono text-2xl font-bold text-graphite">{stat.value}</div>
                        <div className="text-xs text-graphite/40 mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Seed Curso IA */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-orange/20">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="font-serif text-lg text-graphite flex items-center gap-2">
                            <Database className="w-5 h-5 text-orange" />
                            Cargar Curso Demo
                        </h2>
                        <p className="text-sm text-graphite/50 mt-1">
                            Carga el curso <strong>IA Estratégica y Diseño de Instrucciones</strong> con {bloquesIA.length} bloques completos al Firestore.
                            Si ya existe, lo sobreescribe (actualiza).
                        </p>
                    </div>
                    <button
                        onClick={handleSeedCurso}
                        disabled={seedStatus === 'loading'}
                        className={`btn-primary gap-2 flex-shrink-0 ${seedStatus === 'loading' ? 'opacity-70' : ''}`}
                    >
                        {seedStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                        {seedStatus === 'done' && <CheckCircle className="w-4 h-4" />}
                        {seedStatus === 'idle' || seedStatus === 'error' ? <Database className="w-4 h-4" /> : null}
                        {seedStatus === 'loading' ? 'Cargando...' : seedStatus === 'done' ? 'Listo' : 'Cargar Curso'}
                    </button>
                </div>
                {seedMsg && (
                    <p className={`mt-3 text-sm font-mono px-4 py-2 rounded-xl ${seedStatus === 'done' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {seedMsg}
                    </p>
                )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-graphite/5">
                    <h2 className="font-serif text-lg text-graphite mb-4">Usuarios por rol</h2>
                    <div className="space-y-3">
                        {[
                            { rol: 'Alumnos', count: alumnos, color: 'bg-cobalt', pct: usuarios.length ? Math.round((alumnos / usuarios.length) * 100) : 0 },
                            { rol: 'Maestros', count: maestros, color: 'bg-orange', pct: usuarios.length ? Math.round((maestros / usuarios.length) * 100) : 0 },
                            { rol: 'Admins', count: admins, color: 'bg-mint-dark', pct: usuarios.length ? Math.round((admins / usuarios.length) * 100) : 0 },
                        ].map((r, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-graphite/60">{r.rol}</span>
                                    <span className="font-mono text-graphite font-medium">{r.count}</span>
                                </div>
                                <div className="w-full bg-graphite/5 rounded-full h-1.5">
                                    <div className={`h-1.5 rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-soft border border-graphite/5 md:col-span-1 lg:col-span-2">
                    <h2 className="font-serif text-lg text-graphite mb-4">Últimos usuarios registrados</h2>
                    {usuarios.length === 0 ? (
                        <p className="text-sm text-graphite/30 font-mono">Sin usuarios registrados aún.</p>
                    ) : (
                        <div className="space-y-2">
                            {[...usuarios]
                                .sort((a, b) => b.created_at.localeCompare(a.created_at))
                                .slice(0, 5)
                                .map((u) => (
                                    <div key={u.id} className="flex items-center gap-3 p-3 bg-cream rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt text-xs font-bold flex-shrink-0">
                                            {(u.nombre?.[0] ?? u.email[0]).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-graphite font-medium truncate">{u.nombre} {u.apellido}</div>
                                            <div className="text-xs text-graphite/40 truncate">{u.email}</div>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.rol === 'admin' ? 'bg-purple-50 text-purple-600' : u.rol === 'maestro' ? 'bg-cobalt/10 text-cobalt' : 'bg-green-50 text-green-600'}`}>
                                            {u.rol}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
