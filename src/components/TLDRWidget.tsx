import { useState } from 'react'
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { generateTLDR, isDemoAI } from '../lib/ai'

interface Props {
    htmlContent: string
}

// Simple inline markdown bold renderer
function parseBold(text: string): React.ReactNode[] {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
            ? <strong key={i} className="text-graphite font-semibold">{part.slice(2, -2)}</strong>
            : <span key={i}>{part}</span>
    )
}

export function TLDRWidget({ htmlContent }: Props) {
    const [points, setPoints] = useState<string[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(true)

    const handleGenerate = async () => {
        setLoading(true)
        try {
            const result = await generateTLDR(htmlContent)
            setPoints(result)
            setOpen(true)
        } catch {
            setPoints(['No se pudo generar el resumen. Intenta de nuevo.'])
        } finally {
            setLoading(false)
        }
    }

    if (!points && !loading) {
        return (
            <button
                onClick={handleGenerate}
                className="flex items-center gap-2 text-xs text-cobalt/70 hover:text-cobalt transition-colors group mt-4 border border-cobalt/20 hover:border-cobalt/40 rounded-xl px-3 py-2 bg-cobalt/5 hover:bg-cobalt/10"
            >
                <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                {isDemoAI ? 'Resumen IA (demo)' : 'Resumir con IA'}
            </button>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 mt-4 text-xs text-cobalt/50">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generando resumen...
            </div>
        )
    }

    return (
        <div className="mt-5 border border-cobalt/15 rounded-xl bg-cobalt/5 overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-cobalt hover:bg-cobalt/8 transition-colors"
            >
                <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    3 puntos clave
                </span>
                {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {open && (
                <ul className="px-4 pb-3 space-y-2">
                    {points!.map((p, i) => (
                        <li key={i} className="text-sm text-graphite/70 leading-relaxed flex gap-2">
                            <span className="text-cobalt mt-0.5 flex-shrink-0">▪</span>
                            <span>{parseBold(p.replace(/^•\s*/, ''))}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
