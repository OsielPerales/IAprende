import { useState, useRef } from 'react'
import { Check, RefreshCw } from 'lucide-react'

interface ContenidoComparador {
    titulo: string
    descripcion?: string
    col_a_titulo: string
    col_b_titulo: string
    caracteristicas: string[]
    correctas_a?: number[]
    correctas_b?: number[]
}

interface Props {
    contenido: ContenidoComparador
    isEditor?: boolean
}

type Assignment = 'A' | 'B' | null

export function BloqueComparador({ contenido: c, isEditor }: Props) {
    const [assignments, setAssignments] = useState<Record<string, Assignment>>({})
    const [checked, setChecked] = useState(false)
    const dragItem = useRef<string | null>(null)

    const pool = c.caracteristicas.filter(ci => !assignments[ci])
    const colA = c.caracteristicas.filter(ci => assignments[ci] === 'A')
    const colB = c.caracteristicas.filter(ci => assignments[ci] === 'B')

    const assign = (item: string, col: 'A' | 'B') => {
        setAssignments(prev => ({ ...prev, [item]: col }))
    }
    const unassign = (item: string) => {
        setAssignments(prev => { const n = { ...prev }; delete n[item]; return n })
    }
    const reset = () => { setAssignments({}); setChecked(false) }

    const isCorrect = (item: string, col: 'A' | 'B'): boolean | null => {
        if (!checked) return null
        const idx = c.caracteristicas.indexOf(item)
        if (col === 'A') return (c.correctas_a ?? []).includes(idx)
        return (c.correctas_b ?? []).includes(idx)
    }

    const onDragStart = (item: string) => { dragItem.current = item }
    const onDrop = (col: 'A' | 'B') => {
        if (dragItem.current) { assign(dragItem.current, col); dragItem.current = null }
    }
    const onDragOver = (e: React.DragEvent) => e.preventDefault()

    const chipClass = (item: string, col: 'A' | 'B') => {
        const res = isCorrect(item, col)
        if (res === true) return 'bg-green-100 border-green-400 text-green-700'
        if (res === false) return 'bg-red-100 border-red-400 text-red-600'
        return 'bg-white border-graphite/20 text-graphite/80'
    }

    if (isEditor) {
        return (
            <div className="p-4 md:p-6">
                <h3 className="font-serif text-xl text-graphite mb-2">{c.titulo}</h3>
                {c.descripcion && <p className="text-sm text-graphite/50 mb-4">{c.descripcion}</p>}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-cobalt/5 rounded-xl p-3 border border-cobalt/20">
                        <p className="text-xs font-medium text-cobalt mb-2">{c.col_a_titulo}</p>
                        <p className="text-xs text-graphite/40">Arrastra aquí en la vista del alumno</p>
                    </div>
                    <div className="bg-orange/5 rounded-xl p-3 border border-orange/20">
                        <p className="text-xs font-medium text-orange mb-2">{c.col_b_titulo}</p>
                        <p className="text-xs text-graphite/40">{c.caracteristicas.length} características</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6">
            <h3 className="font-serif text-xl text-graphite mb-2">{c.titulo}</h3>
            {c.descripcion && <p className="text-sm text-graphite/50 mb-4">{c.descripcion}</p>}

            {/* Pool */}
            {pool.length > 0 && (
                <div className="mb-4 p-3 bg-cream rounded-xl border border-graphite/10 min-h-12">
                    <p className="text-xs text-graphite/40 mb-2">Sin asignar — arrastra a una columna:</p>
                    <div className="flex flex-wrap gap-2">
                        {pool.map((item) => (
                            <div
                                key={item}
                                draggable
                                onDragStart={() => onDragStart(item)}
                                className="px-3 py-1.5 bg-white border-2 border-graphite/15 rounded-xl text-sm text-graphite cursor-grab active:cursor-grabbing hover:border-orange/40 transition-colors"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['A', 'B'] as const).map((col) => {
                    const items = col === 'A' ? colA : colB
                    const title = col === 'A' ? c.col_a_titulo : c.col_b_titulo
                    const border = col === 'A' ? 'border-cobalt/30' : 'border-orange/30'
                    const head = col === 'A' ? 'bg-cobalt/10 text-cobalt' : 'bg-orange/10 text-orange'
                    return (
                        <div
                            key={col}
                            className={`rounded-2xl border-2 ${border} overflow-hidden`}
                            onDrop={() => onDrop(col)}
                            onDragOver={onDragOver}
                        >
                            <div className={`px-4 py-2 ${head} font-medium text-sm text-center`}>{title}</div>
                            <div className="p-3 min-h-24 flex flex-wrap gap-2">
                                {items.map((item) => (
                                    <div
                                        key={item}
                                        className={`px-3 py-1.5 border-2 rounded-xl text-sm cursor-pointer transition-all flex items-center gap-1.5 ${chipClass(item, col)}`}
                                        onClick={() => unassign(item)}
                                        title="Clic para devolver al pool"
                                    >
                                        {checked && isCorrect(item, col) === true && <Check className="w-3 h-3" />}
                                        {item}
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <p className="text-xs text-graphite/30 w-full text-center mt-4">Arrastra aquí</p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4">
                {pool.length === 0 && !checked && (
                    <button onClick={() => setChecked(true)} className="btn-primary text-sm gap-2">
                        <Check className="w-4 h-4" /> Verificar
                    </button>
                )}
                <button onClick={reset} className="btn-ghost text-sm gap-2 text-graphite/50">
                    <RefreshCw className="w-4 h-4" /> Reiniciar
                </button>
                {checked && (
                    <span className="text-sm text-graphite/60">
                        {[...colA, ...colB].filter(item => {
                            const idx = c.caracteristicas.indexOf(item)
                            const inA = colA.includes(item)
                            return inA ? (c.correctas_a ?? []).includes(idx) : (c.correctas_b ?? []).includes(idx)
                        }).length} / {c.caracteristicas.length} correctas
                    </span>
                )}
            </div>
        </div>
    )
}
