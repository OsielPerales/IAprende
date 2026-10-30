import { useStore } from '../store/useStore'
import { useAuth } from '../context/AuthContext'
import { CheckCircle2, Clock, AlertCircle, BookOpen } from 'lucide-react'

export function CalificacionesAlumno() {
    const { user } = useAuth()
    const { cursos, bloques, respuestas } = useStore()

    // Get all quiz blocks for published courses
    const cursosPublicados = cursos.filter((c) => c.publicado)

    const data = cursosPublicados.map((curso) => {
        const cursoBloques = bloques.filter((b) => b.curso_id === curso.id).sort((a, b) => a.orden - b.orden)
        const quizBloques = cursoBloques.filter((b) => b.tipo === 'cuestionario')

        const quizData = quizBloques.map((bloque) => {
            const content = bloque.contenido as any
            const respuesta = respuestas.find(
                (r) => r.bloque_id === bloque.id && r.alumno_id === user?.id
            )
            const preguntas = content.preguntas || []

            // Auto-calc grade for MCQ if submitted
            let calificacion = respuesta?.calificacion
            if (respuesta && calificacion === null) {
                let puntos = 0
                let totalPuntos = 0
                preguntas.forEach((p: any) => {
                    totalPuntos += p.puntos || 0
                    if (p.tipo === 'opcion_multiple' && respuesta.respuestas[p.id] === p.correcta) {
                        puntos += p.puntos || 0
                    }
                })
                calificacion = totalPuntos > 0 ? Math.round((puntos / totalPuntos) * 100) : null
            }

            return {
                bloque,
                titulo: content.titulo || 'Cuestionario',
                numPreguntas: preguntas.length,
                enviado: !!respuesta,
                calificacion,
                pendienteRevision: respuesta && calificacion === null,
            }
        })

        const avgGrade = quizData.filter((q) => q.calificacion !== null).length > 0
            ? Math.round(
                quizData.filter((q) => q.calificacion !== null).reduce((s, q) => s + q.calificacion!, 0) /
                quizData.filter((q) => q.calificacion !== null).length
            )
            : null

        return { curso, quizData, avgGrade, totalBloques: cursoBloques.length }
    })

    const overallAvg = data.flatMap(d => d.quizData).filter(q => q.calificacion !== null)
    const globalAvg = overallAvg.length > 0
        ? Math.round(overallAvg.reduce((s, q) => s + q.calificacion!, 0) / overallAvg.length)
        : null

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="font-serif text-3xl text-graphite">Mis Calificaciones</h1>
                <p className="text-graphite/50 text-sm mt-1">Historial de evaluaciones y resultados</p>
            </div>

            {/* Global summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow-soft border border-graphite/5 p-5 text-center">
                    <div className="text-3xl font-serif text-graphite font-bold">
                        {globalAvg !== null ? `${globalAvg}%` : '—'}
                    </div>
                    <div className="text-xs text-graphite/40 mt-1">Promedio general</div>
                </div>
                <div className="bg-white rounded-2xl shadow-soft border border-graphite/5 p-5 text-center">
                    <div className="text-3xl font-serif text-green-600 font-bold">
                        {data.flatMap(d => d.quizData).filter(q => q.enviado).length}
                    </div>
                    <div className="text-xs text-graphite/40 mt-1">Evaluaciones enviadas</div>
                </div>
                <div className="bg-white rounded-2xl shadow-soft border border-graphite/5 p-5 text-center">
                    <div className="text-3xl font-serif text-orange font-bold">
                        {data.flatMap(d => d.quizData).filter(q => !q.enviado).length}
                    </div>
                    <div className="text-xs text-graphite/40 mt-1">Pendientes</div>
                </div>
            </div>

            {/* Per-course */}
            {data.map(({ curso, quizData, avgGrade, totalBloques }) => (
                <div key={curso.id} className="bg-white rounded-2xl shadow-soft border border-graphite/5 overflow-hidden">
                    {/* Course header */}
                    <div className="p-4 sm:p-5 border-b border-graphite/5 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cobalt/10 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-cobalt" />
                            </div>
                            <div>
                                <h3 className="font-medium text-graphite">{curso.titulo}</h3>
                                <p className="text-xs text-graphite/40">{totalBloques} bloques · {quizData.length} evaluaciones</p>
                            </div>
                        </div>
                        {avgGrade !== null && (
                            <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${avgGrade >= 80 ? 'bg-green-50 text-green-600' :
                                avgGrade >= 60 ? 'bg-orange/10 text-orange' :
                                    'bg-red-50 text-red-500'
                                }`}>
                                {avgGrade}%
                            </div>
                        )}
                    </div>

                    {/* Quiz rows */}
                    {quizData.length === 0 ? (
                        <div className="p-5 text-sm text-graphite/30 text-center font-mono">Sin evaluaciones en este curso</div>
                    ) : (
                        <div className="divide-y divide-graphite/5">
                            {quizData.map(({ bloque, titulo, numPreguntas, enviado, calificacion, pendienteRevision }) => (
                                <div key={bloque.id} className="px-5 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {enviado
                                            ? calificacion !== null
                                                ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                : <Clock className="w-4 h-4 text-orange flex-shrink-0" />
                                            : <AlertCircle className="w-4 h-4 text-graphite/20 flex-shrink-0" />
                                        }
                                        <div>
                                            <p className="text-sm font-medium text-graphite">{titulo}</p>
                                            <p className="text-xs text-graphite/40">{numPreguntas} preguntas</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {!enviado && (
                                            <span className="text-xs text-graphite/30 font-mono">No entregado</span>
                                        )}
                                        {enviado && pendienteRevision && (
                                            <span className="text-xs text-orange font-mono">Pendiente de revisión</span>
                                        )}
                                        {enviado && calificacion != null && (
                                            <span className={`text-sm font-bold font-mono ${(calificacion as number) >= 80 ? 'text-green-600' :
                                                    (calificacion as number) >= 60 ? 'text-orange' : 'text-red-500'
                                                }`}>
                                                {calificacion}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
