import { useState } from 'react'
import { useStore } from '../store/useStore'
import { useAuth } from '../context/AuthContext'
import {
    Users, ClipboardList, ChevronDown, ChevronUp,
    CheckCircle2, Clock, Edit3, Save, X
} from 'lucide-react'
import { AIGradeButton } from '../components/AIGradeButton'

export function GradebookMaestro() {
    const { user } = useAuth()
    const { grupos, grupoAlumnos, usuarios, cursos, bloques, respuestas, updateRespuesta } = useStore()
    const [expandedGrupo, setExpandedGrupo] = useState<string | null>(null)
    const [expandedBloque, setExpandedBloque] = useState<string | null>(null)
    const [editingGrade, setEditingGrade] = useState<{ rid: string; value: string } | null>(null)
    const [aiFeedback, setAiFeedback] = useState<Record<string, string>>({}) // rid → feedback

    const misGrupos = user?.rol === 'admin'
        ? grupos
        : grupos.filter((g) => g.maestro_id === user?.id)

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="font-serif text-3xl text-graphite">Calificaciones</h1>
                <p className="text-graphite/50 text-sm mt-1">
                    {misGrupos.length} grupo{misGrupos.length !== 1 ? 's' : ''} · vista de evaluaciones y respuestas
                </p>
            </div>

            {misGrupos.map((grupo) => {
                const isGrupoExpanded = expandedGrupo === grupo.id
                const alumnos = grupoAlumnos
                    .filter((ga) => ga.grupo_id === grupo.id)
                    .map((ga) => usuarios.find((u) => u.id === ga.alumno_id))
                    .filter(Boolean) as typeof usuarios

                // All quiz blocks across all courses
                const quizBloques = bloques.filter((b) => b.tipo === 'cuestionario')

                // Stats
                const totalRespuestas = respuestas.filter((r) =>
                    alumnos.some((a) => a.id === r.alumno_id)
                ).length
                const pendientes = respuestas.filter((r) =>
                    alumnos.some((a) => a.id === r.alumno_id) && r.calificacion === null
                ).length

                return (
                    <div key={grupo.id} className="bg-white rounded-2xl shadow-soft border border-graphite/5 overflow-hidden">
                        {/* Group header */}
                        <button
                            onClick={() => setExpandedGrupo(isGrupoExpanded ? null : grupo.id)}
                            className="w-full p-5 flex items-center justify-between hover:bg-cream/30 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-cobalt/10 rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5 text-cobalt" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-medium text-graphite">{grupo.nombre}</h3>
                                    <p className="text-xs text-graphite/40">
                                        {alumnos.length} alumnos · {totalRespuestas} entregas
                                        {pendientes > 0 && (
                                            <span className="ml-2 px-2 py-0.5 bg-orange/10 text-orange rounded-full text-xs">
                                                {pendientes} por calificar
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            {isGrupoExpanded
                                ? <ChevronUp className="w-5 h-5 text-graphite/30" />
                                : <ChevronDown className="w-5 h-5 text-graphite/30" />
                            }
                        </button>

                        {isGrupoExpanded && (
                            <div className="border-t border-graphite/5">
                                {quizBloques.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-graphite/30 font-mono">
                                        No hay cuestionarios publicados aún
                                    </div>
                                ) : (
                                    quizBloques.map((bloque) => {
                                        const curso = cursos.find((c) => c.id === bloque.curso_id)
                                        const content = bloque.contenido as any
                                        const isQuizExpanded = expandedBloque === bloque.id

                                        const alumnoRespuestas = alumnos.map((alumno) => {
                                            const resp = respuestas.find(
                                                (r) => r.bloque_id === bloque.id && r.alumno_id === alumno.id
                                            )
                                            // Auto-calc MCQ score
                                            let nota = resp?.calificacion ?? null
                                            if (resp && nota === null) {
                                                const preguntas = content.preguntas || []
                                                let puntos = 0
                                                let total = 0
                                                preguntas.forEach((p: any) => {
                                                    total += p.puntos || 0
                                                    if (p.tipo === 'opcion_multiple' && resp.respuestas[p.id] === p.correcta) {
                                                        puntos += p.puntos || 0
                                                    }
                                                })
                                                const hasOpen = preguntas.some((p: any) => p.tipo === 'abierta')
                                                nota = !hasOpen && total > 0 ? Math.round((puntos / total) * 100) : null
                                            }
                                            return { alumno, resp, nota }
                                        })

                                        const submitted = alumnoRespuestas.filter((a) => a.resp).length
                                        const avgNota = alumnoRespuestas.filter((a) => a.nota !== null)
                                        const avg = avgNota.length
                                            ? Math.round(avgNota.reduce((s, a) => s + a.nota!, 0) / avgNota.length)
                                            : null

                                        return (
                                            <div key={bloque.id} className="border-b border-graphite/5 last:border-0">
                                                <button
                                                    onClick={() => setExpandedBloque(isQuizExpanded ? null : bloque.id)}
                                                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-cream/20 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <ClipboardList className="w-4 h-4 text-orange flex-shrink-0" />
                                                        <div className="text-left">
                                                            <p className="text-sm font-medium text-graphite">
                                                                {content.titulo || 'Cuestionario'}
                                                            </p>
                                                            <p className="text-xs text-graphite/40">
                                                                {curso?.titulo} · {submitted}/{alumnos.length} entregados
                                                                {avg !== null && ` · promedio ${avg}%`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {alumnoRespuestas.some((a) => a.resp && a.nota === null) && (
                                                            <span className="px-2 py-0.5 bg-orange/10 text-orange text-xs rounded-full">
                                                                Por revisar
                                                            </span>
                                                        )}
                                                        {isQuizExpanded
                                                            ? <ChevronUp className="w-4 h-4 text-graphite/30" />
                                                            : <ChevronDown className="w-4 h-4 text-graphite/30" />
                                                        }
                                                    </div>
                                                </button>

                                                {isQuizExpanded && (
                                                    <div className="bg-cream/20 border-t border-graphite/5">
                                                        <div className="table-responsive">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="border-b border-graphite/5">
                                                                    <th className="text-left px-5 py-3 text-xs font-medium text-graphite/40">Alumno</th>
                                                                    <th className="text-left px-3 py-3 text-xs font-medium text-graphite/40">Estado</th>
                                                                    <th className="text-left px-3 py-3 text-xs font-medium text-graphite/40">Respuestas</th>
                                                                    <th className="text-right px-5 py-3 text-xs font-medium text-graphite/40">Calificación</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-graphite/5">
                                                                {alumnoRespuestas.map(({ alumno, resp, nota }) => {
                                                                    const isEditing = editingGrade?.rid === (resp?.id || '')
                                                                    const preguntas = content.preguntas || []

                                                                    return (
                                                                        <tr key={alumno.id} className="bg-white hover:bg-cream/40 transition-colors">
                                                                            <td className="px-5 py-3">
                                                                                <div className="font-medium text-graphite">{alumno.nombre}</div>
                                                                                <div className="text-xs text-graphite/40 font-mono">{alumno.email}</div>
                                                                            </td>
                                                                            <td className="px-3 py-3">
                                                                                {!resp ? (
                                                                                    <span className="flex items-center gap-1 text-xs text-graphite/30">
                                                                                        <X className="w-3 h-3" /> Sin entregar
                                                                                    </span>
                                                                                ) : nota !== null ? (
                                                                                    <span className="flex items-center gap-1 text-xs text-green-600">
                                                                                        <CheckCircle2 className="w-3 h-3" /> Calificado
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="flex items-center gap-1 text-xs text-orange">
                                                                                        <Clock className="w-3 h-3" /> Pendiente
                                                                                    </span>
                                                                                )}
                                                                            </td>
                                                                            <td className="px-3 py-3 max-w-xs">
                                                                                {resp && (
                                                                                    <div className="space-y-1">
                                                                                        {preguntas.map((p: any, i: number) => {
                                                                                            const ans = resp.respuestas[p.id]
                                                                                            const isCorrect = p.tipo === 'opcion_multiple' && ans === p.correcta
                                                                                            const isWrong = p.tipo === 'opcion_multiple' && ans !== undefined && ans !== p.correcta
                                                                                            return (
                                                                                                <div key={p.id} className="text-xs flex items-start gap-1.5">
                                                                                                    <span className={`font-mono flex-shrink-0 mt-px ${isCorrect ? 'text-green-500' :
                                                                                                        isWrong ? 'text-red-400' : 'text-cobalt'
                                                                                                        }`}>
                                                                                                        {i + 1}.
                                                                                                    </span>
                                                                                                    <span className="text-graphite/60 truncate max-w-[180px]">
                                                                                                        {p.tipo === 'opcion_multiple'
                                                                                                            ? (ans !== undefined && ans !== null)
                                                                                                                ? p.opciones?.[ans as any] || '—'
                                                                                                                : '—'
                                                                                                            : String(ans || '—').substring(0, 60) + (String(ans || '').length > 60 ? '…' : '')
                                                                                                        }
                                                                                                    </span>
                                                                                                </div>
                                                                                            )
                                                                                        })}
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            <td className="px-5 py-3 text-right">
                                                                                {resp && (
                                                                                    isEditing ? (
                                                                                        <div className="flex items-center gap-1 justify-end">
                                                                                            <input
                                                                                                type="number"
                                                                                                min={0}
                                                                                                max={100}
                                                                                                value={editingGrade!.value}
                                                                                                onChange={(e) => setEditingGrade({ rid: resp.id, value: e.target.value })}
                                                                                                className="w-16 px-2 py-1 rounded-lg bg-cream border border-orange/30 text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange/30"
                                                                                                autoFocus
                                                                                            />
                                                                                            <span className="text-xs text-graphite/40">%</span>
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    const val = parseInt(editingGrade!.value)
                                                                                                    if (!isNaN(val) && val >= 0 && val <= 100) {
                                                                                                        updateRespuesta(resp.id, { calificacion: val })
                                                                                                    }
                                                                                                    setEditingGrade(null)
                                                                                                }}
                                                                                                className="p-1 text-green-500 hover:text-green-700"
                                                                                            >
                                                                                                <Save className="w-3.5 h-3.5" />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => setEditingGrade(null)}
                                                                                                className="p-1 text-graphite/30 hover:text-graphite"
                                                                                            >
                                                                                                <X className="w-3.5 h-3.5" />
                                                                                            </button>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="flex flex-col items-end gap-1.5">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <span className={`font-mono font-bold text-sm ${nota === null ? 'text-graphite/30' :
                                                                                                    nota >= 80 ? 'text-green-600' :
                                                                                                        nota >= 60 ? 'text-orange' : 'text-red-500'
                                                                                                    }`}>
                                                                                                    {nota !== null ? `${nota}%` : '—'}
                                                                                                </span>
                                                                                                <button
                                                                                                    onClick={() => setEditingGrade({ rid: resp.id, value: String(nota ?? '') })}
                                                                                                    className="p-1 text-graphite/20 hover:text-orange transition-colors"
                                                                                                    title="Calificar manualmente"
                                                                                                >
                                                                                                    <Edit3 className="w-3 h-3" />
                                                                                                </button>
                                                                                            </div>
                                                                                            {/* SP1: AI grading for open-ended unanswered questions */}
                                                                                            {resp && nota === null && preguntas.some((p: any) => p.tipo === 'abierta') && (
                                                                                                <AIGradeButton
                                                                                                    respuestaId={resp.id}
                                                                                                    onSuggestion={(score, feedback) => {
                                                                                                        setEditingGrade({ rid: resp.id, value: String(score) })
                                                                                                        setAiFeedback(prev => ({ ...prev, [resp.id]: feedback }))
                                                                                                    }}
                                                                                                />
                                                                                            )}
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
