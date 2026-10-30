import { useState } from 'react'
import { Send, Users, Loader2 } from 'lucide-react'
import { db } from '../../lib/firebase'
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'

interface ContenidoCasoEtico {
    titulo: string
    situacion: string
    preguntas: string[]
}

interface Props {
    contenido: ContenidoCasoEtico
    bloqueId: string
    isEditor?: boolean
}

export function BloqueCasoEtico({ contenido: c, bloqueId, isEditor }: Props) {
    const { user } = useAuth()
    const [respuestas, setRespuestas] = useState<string[]>(new Array(c.preguntas.length).fill(''))
    const [enviado, setEnviado] = useState(false)
    const [loading, setLoading] = useState(false)
    const [conteo, setConteo] = useState<number | null>(null)
    const [muestras, setMuestras] = useState<string[][]>([])

    const updateRespuesta = (i: number, val: string) => {
        const next = [...respuestas]
        next[i] = val
        setRespuestas(next)
    }

    const handleEnviar = async () => {
        if (!user || isEditor) return
        const allFilled = respuestas.every(r => r.trim().length > 0)
        if (!allFilled) return
        setLoading(true)
        try {
            const docId = `${bloqueId}_${user.id}`
            await setDoc(doc(db, 'caso_etico_respuestas', docId), {
                userId: user.id,
                bloque_id: bloqueId,
                respuestas,
                created_at: new Date().toISOString(),
            })
            setEnviado(true)
            // Load aggregate
            const snap = await getDocs(query(collection(db, 'caso_etico_respuestas'), where('bloque_id', '==', bloqueId)))
            setConteo(snap.size)
            const sample: string[][] = []
            snap.docs.slice(0, 3).forEach(d => {
                const data = d.data()
                if (data.userId !== user.id && Array.isArray(data.respuestas)) {
                    sample.push(data.respuestas)
                }
            })
            setMuestras(sample)
        } catch { /* ignore */ }
        finally { setLoading(false) }
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    <Users className="w-3.5 h-3.5" /> Caso Ético Grupal
                </span>
            </div>

            <h3 className="font-serif text-xl text-graphite mb-3">{c.titulo}</h3>

            {/* Situación */}
            <div className="bg-cream border border-graphite/10 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-graphite/40 uppercase tracking-wide mb-2">Situación</p>
                <p className="text-sm text-graphite/80 leading-relaxed whitespace-pre-line">{c.situacion}</p>
            </div>

            {/* Questions */}
            <div className="space-y-5">
                {c.preguntas.map((pregunta, i) => (
                    <div key={i}>
                        <p className="text-sm font-medium text-graphite mb-2">
                            <span className="text-orange font-bold">{i + 1}.</span> {pregunta}
                        </p>
                        {enviado ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-graphite/80 whitespace-pre-wrap">
                                {respuestas[i]}
                            </div>
                        ) : (
                            <textarea
                                value={respuestas[i]}
                                onChange={(e) => updateRespuesta(i, e.target.value)}
                                disabled={isEditor}
                                rows={3}
                                placeholder="Comparte tu reflexión..."
                                className="w-full px-4 py-3 rounded-xl bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 resize-none"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Send button */}
            {!enviado && !isEditor && (
                <button
                    onClick={handleEnviar}
                    disabled={loading || !respuestas.every(r => r.trim())}
                    className="mt-5 btn-primary gap-2 disabled:opacity-40"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Enviar mis reflexiones
                </button>
            )}

            {/* Aggregate */}
            {enviado && conteo !== null && (
                <div className="mt-5 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <p className="text-sm font-medium text-purple-700 mb-3">
                        ✓ Reflexiones enviadas · <strong>{conteo}</strong> participante{conteo !== 1 ? 's' : ''} respondieron
                    </p>
                    {muestras.length > 0 && (
                        <div>
                            <p className="text-xs text-purple-500 mb-2">Algunas perspectivas del grupo:</p>
                            <div className="space-y-2">
                                {muestras.map((muestra, mi) => (
                                    <div key={mi} className="bg-white rounded-lg px-3 py-2">
                                        <p className="text-xs text-graphite/60 italic">&ldquo;{muestra[0]?.substring(0, 120)}{muestra[0]?.length > 120 ? '...' : ''}&rdquo;</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
