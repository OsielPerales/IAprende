import { useState } from 'react'

interface Tarjeta {
    frente: string
    reverso: string
    color?: string
}

interface ContenidoTarjetasFlip {
    titulo: string
    instrucciones?: string
    tarjetas: Tarjeta[]
}

interface Props {
    contenido: ContenidoTarjetasFlip
    isEditor?: boolean
}

export function BloqueTarjetasFlip({ contenido: c, isEditor }: Props) {
    const [flipped, setFlipped] = useState<Set<number>>(new Set())

    const toggle = (i: number) => {
        if (isEditor) return
        setFlipped(prev => {
            const next = new Set(prev)
            next.has(i) ? next.delete(i) : next.add(i)
            return next
        })
    }

    return (
        <div className="p-4 md:p-6">
            <h3 className="font-serif text-xl text-graphite mb-1">{c.titulo}</h3>
            {c.instrucciones && (
                <p className="text-sm text-graphite/50 mb-5">{c.instrucciones}</p>
            )}

            <div className={`grid gap-4 ${c.tarjetas.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
                {c.tarjetas.map((tarjeta, i) => {
                    const isFlipped = flipped.has(i)
                    const bg = tarjeta.color || '#EBF3FB'

                    return (
                        <div
                            key={i}
                            className="cursor-pointer select-none"
                            style={{ perspective: '1000px', height: '180px' }}
                            onClick={() => toggle(i)}
                            title={isEditor ? undefined : 'Haz clic para voltear'}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    transformStyle: 'preserve-3d',
                                    transition: 'transform 0.55s ease',
                                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                }}
                            >
                                {/* Front */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        background: bg,
                                        borderRadius: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '16px',
                                        border: '2px solid rgba(0,0,0,0.06)',
                                    }}
                                >
                                    {tarjeta.frente.split('\n').map((line, li) => (
                                        <p
                                            key={li}
                                            className={li === 0 ? 'text-3xl mb-1' : li === 1 ? 'font-bold text-graphite text-sm uppercase tracking-wide' : 'text-graphite/60 text-xs mt-0.5'}
                                        >
                                            {line}
                                        </p>
                                    ))}
                                    {!isEditor && (
                                        <p className="absolute bottom-3 text-xs text-graphite/30">toca para voltear</p>
                                    )}
                                </div>

                                {/* Back */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)',
                                        background: '#2A4B7C',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '16px',
                                    }}
                                >
                                    <p className="text-white text-sm leading-relaxed text-center whitespace-pre-line">
                                        {tarjeta.reverso}
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
