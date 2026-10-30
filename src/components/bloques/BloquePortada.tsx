import type { ProgresoAlumno } from '../../types'

interface ContenidoPortada {
    modulo_numero: number
    modulo_label?: string
    titulo: string
    subtitulo?: string
    gradient_from?: string
    gradient_to?: string
    icon_color?: string
}

interface Props {
    contenido: ContenidoPortada
    progreso?: ProgresoAlumno | null
    isEditor?: boolean
}

export function BloquePortada({ contenido: c, isEditor }: Props) {
    const from = c.gradient_from || '#2A4B7C'
    const to = c.gradient_to || '#1a3456'
    const accent = c.icon_color || '#E07A5F'

    return (
        <div
            className="relative overflow-hidden rounded-xl"
            style={{
                background: `linear-gradient(135deg, ${from}, ${to})`,
                minHeight: isEditor ? '140px' : '220px',
            }}
        >
            {/* Decorative circles */}
            <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
                style={{ background: accent }}
            />
            <div
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
                style={{ background: accent }}
            />

            <div className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center text-white">
                {/* Module badge */}
                <div
                    className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5 text-white font-bold text-xl shadow-lg"
                    style={{ background: accent }}
                >
                    {c.modulo_numero === 0 ? '✦' : c.modulo_numero}
                </div>

                {c.modulo_label && (
                    <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-mono">
                        {c.modulo_label}
                    </p>
                )}

                <h1
                    className="font-serif text-white leading-tight mb-3"
                    style={{ fontSize: isEditor ? '18px' : '26px' }}
                >
                    {c.titulo}
                </h1>

                {c.subtitulo && (
                    <p className="text-white/70 text-sm max-w-xl leading-relaxed">{c.subtitulo}</p>
                )}
            </div>
        </div>
    )
}
