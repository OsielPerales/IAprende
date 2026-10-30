import { Map } from 'lucide-react'

interface Categoria {
    nombre: string
    color: string
    herramientas: string[]
}

interface ContenidoMapa {
    titulo: string
    descripcion?: string
    categorias: Categoria[]
}

interface Props {
    contenido: ContenidoMapa
    isEditor?: boolean
}

function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r}, ${g}, ${b}`
}

export function BloqueMapa({ contenido: c }: Props) {
    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
                <Map className="w-5 h-5 text-cobalt" />
                <h3 className="font-serif text-xl text-graphite">{c.titulo}</h3>
            </div>
            {c.descripcion && <p className="text-sm text-graphite/50 mb-5">{c.descripcion}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {c.categorias.map((cat, i) => {
                    const rgb = hexToRgb(cat.color || '#2A4B7C')
                    return (
                        <div
                            key={i}
                            className="rounded-2xl overflow-hidden border"
                            style={{ borderColor: `rgba(${rgb}, 0.25)` }}
                        >
                            <div
                                className="px-4 py-3"
                                style={{ background: `rgba(${rgb}, 0.12)` }}
                            >
                                <p
                                    className="font-semibold text-sm"
                                    style={{ color: cat.color }}
                                >
                                    {cat.nombre}
                                </p>
                            </div>
                            <div className="px-4 py-3 flex flex-wrap gap-2">
                                {cat.herramientas.map((tool, ti) => (
                                    <span
                                        key={ti}
                                        className="inline-block px-3 py-1.5 rounded-xl text-xs font-medium text-white"
                                        style={{ background: cat.color }}
                                    >
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
