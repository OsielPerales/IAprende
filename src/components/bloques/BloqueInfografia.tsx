import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Pilar {
    titulo: string
    icono: string
    color: string
    descripcion: string
    badge?: string
}

interface ContenidoInfografia {
    titulo: string
    intro?: string
    pilares: Pilar[]
}

interface Props {
    contenido: ContenidoInfografia
    isEditor?: boolean
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
    mint:    { bg: '#D4E5DF', border: '#7fb5a3', text: '#1a5c4c' },
    lavender:{ bg: '#E6E1F0', border: '#9d94c4', text: '#4a3d7a' },
    orange:  { bg: '#FDEBD0', border: '#E07A5F', text: '#8B3A2F' },
    cobalt:  { bg: '#EBF3FB', border: '#2A4B7C', text: '#1a3456' },
    green:   { bg: '#F0FFF4', border: '#22c55e', text: '#166534' },
    red:     { bg: '#FFF0F0', border: '#dc2626', text: '#991b1b' },
}

function getColors(color: string) {
    return COLOR_MAP[color] ?? COLOR_MAP.cobalt
}

export function BloqueInfografia({ contenido: c, isEditor }: Props) {
    const [expanded, setExpanded] = useState<number | null>(isEditor ? null : 0)

    return (
        <div className="p-4 md:p-6">
            <h3 className="font-serif text-xl text-graphite mb-1">{c.titulo}</h3>
            {c.intro && <p className="text-sm text-graphite/50 mb-5">{c.intro}</p>}

            <div className="flex flex-col sm:flex-row gap-3">
                {c.pilares.map((pilar, i) => {
                    const cols = getColors(pilar.color)
                    const isOpen = expanded === i
                    return (
                        <div
                            key={i}
                            className="flex-1 rounded-2xl border-2 overflow-hidden cursor-pointer transition-all"
                            style={{ borderColor: cols.border, background: cols.bg }}
                            onClick={() => setExpanded(isOpen ? null : i)}
                        >
                            <div className="p-4 flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0 mt-0.5">{pilar.icono}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p
                                            className="font-semibold text-sm leading-tight"
                                            style={{ color: cols.text }}
                                        >
                                            {pilar.titulo}
                                        </p>
                                        {isOpen
                                            ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: cols.text }} />
                                            : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: cols.text }} />
                                        }
                                    </div>
                                    {pilar.badge && (
                                        <span
                                            className="inline-block mt-1 text-xs font-mono px-2 py-0.5 rounded-full"
                                            style={{ background: cols.border, color: 'white' }}
                                        >
                                            {pilar.badge}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Expandable content */}
                            <div
                                className="overflow-hidden transition-all"
                                style={{
                                    maxHeight: isOpen ? '300px' : '0',
                                    transition: 'max-height 0.3s ease',
                                }}
                            >
                                <div className="px-4 pb-4">
                                    <div
                                        className="w-full h-px mb-3 opacity-30"
                                        style={{ background: cols.border }}
                                    />
                                    <p className="text-sm leading-relaxed" style={{ color: cols.text }}>
                                        {pilar.descripcion}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
