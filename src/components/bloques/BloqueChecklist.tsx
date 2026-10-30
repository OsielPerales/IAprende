import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import type { ProgresoAlumno } from '../../types'

interface ContenidoChecklist {
    titulo: string
    descripcion?: string
    items: string[]
    progreso_field: string
}

interface Props {
    contenido: ContenidoChecklist
    progreso?: ProgresoAlumno | null
    onProgresoUpdate?: (field: keyof ProgresoAlumno, value: unknown) => void
    isEditor?: boolean
}

export function BloqueChecklist({ contenido: c, progreso, onProgresoUpdate, isEditor }: Props) {
    const initChecked = (): boolean[] => {
        if (!progreso) return new Array(c.items.length).fill(false)
        const stored = (progreso as any)[c.progreso_field]
        if (Array.isArray(stored)) return stored.map(Boolean).concat(new Array(Math.max(0, c.items.length - stored.length)).fill(false))
        if (stored && typeof stored === 'object') return c.items.map((_, i) => Boolean(stored[String(i)]))
        return new Array(c.items.length).fill(false)
    }

    const [checked, setChecked] = useState<boolean[]>(initChecked)

    useEffect(() => {
        setChecked(initChecked())
    }, [progreso])

    const toggle = (i: number) => {
        if (isEditor) return
        const next = [...checked]
        next[i] = !next[i]
        setChecked(next)
        onProgresoUpdate?.(c.progreso_field as keyof ProgresoAlumno, next)
    }

    const done = checked.filter(Boolean).length
    const total = c.items.length
    const pct = total ? Math.round((done / total) * 100) : 0

    return (
        <div className="p-4 md:p-6">
            <h3 className="font-serif text-xl text-graphite mb-1">{c.titulo}</h3>
            {c.descripcion && <p className="text-sm text-graphite/50 mb-4">{c.descripcion}</p>}

            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-graphite/50 mb-3">
                <span>{done} de {total} completados</span>
                <span className="font-mono">{pct}%</span>
            </div>
            <div className="w-full bg-graphite/8 rounded-full h-1.5 mb-5">
                <div
                    className="h-1.5 rounded-full bg-orange transition-all duration-300"
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="space-y-3">
                {c.items.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => toggle(i)}
                        disabled={isEditor}
                        className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                            checked[i]
                                ? 'border-orange/30 bg-orange/5'
                                : 'border-graphite/10 bg-white hover:border-orange/20'
                        } ${isEditor ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                        <div
                            className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                checked[i]
                                    ? 'bg-orange border-orange'
                                    : 'border-graphite/20 bg-white'
                            }`}
                        >
                            {checked[i] && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </div>
                        <span className={`text-sm leading-relaxed ${checked[i] ? 'text-graphite' : 'text-graphite/70'}`}>
                            {item}
                        </span>
                    </button>
                ))}
            </div>

            {done === total && total > 0 && (
                <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
                    <p className="text-green-700 font-medium text-sm">✓ ¡Completado! Todos los compromisos marcados.</p>
                </div>
            )}
        </div>
    )
}
