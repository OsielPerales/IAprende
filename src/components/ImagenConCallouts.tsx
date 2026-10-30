/**
 * ImagenConCallouts — shared component for image blocks with positioned info callouts.
 * Used in both the editor (preview) and the course viewer.
 */
import type { InfoBox, InfoBoxPosition, InfoBoxColor, ImagenLayout } from '../types'

// ─── Position → CSS classes (absolute positioning inside relative container) ──
const POS_CLASSES: Record<InfoBoxPosition, string> = {
    'top-left': 'top-2 left-2',
    'top-center': 'top-2 left-1/2 -translate-x-1/2',
    'top-right': 'top-2 right-2',
    'middle-left': 'top-1/2 -translate-y-1/2 left-2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'middle-right': 'top-1/2 -translate-y-1/2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-center': 'bottom-2 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-2 right-2',
}

// ─── Color → Tailwind classes ─────────────────────────────────────────────────
const COLOR_CLASSES: Record<InfoBoxColor, string> = {
    default: 'bg-white/90 text-graphite border border-graphite/10',
    info: 'bg-cobalt/90 text-white border border-cobalt',
    success: 'bg-green-600/90 text-white border border-green-500',
    warning: 'bg-amber-400/90 text-graphite border border-amber-300',
    dark: 'bg-graphite/90 text-white border border-graphite/60',
}

interface ImagenConCalloutsProps {
    url: string
    alt?: string
    caption?: string
    cuadros?: InfoBox[]
    layout?: ImagenLayout
    className?: string
    /** Max height for the image (default 320px in viewer, 'auto' in editor wide) */
    maxHeight?: number | 'auto'
}

export function ImagenConCallouts({
    url,
    alt = '',
    caption,
    cuadros = [],
    layout = 'completa',
    className = '',
    maxHeight = 320,
}: ImagenConCalloutsProps) {
    const heightStyle = maxHeight === 'auto' ? {} : { maxHeight: `${maxHeight}px` }

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="relative overflow-hidden rounded-xl w-full" style={heightStyle}>
                {url ? (
                    <img
                        src={url}
                        alt={alt}
                        className="w-full h-full object-cover"
                        style={heightStyle}
                    />
                ) : (
                    <div className="w-full flex items-center justify-center bg-graphite/5 rounded-xl" style={{ height: maxHeight === 'auto' ? 200 : maxHeight }}>
                        <span className="text-graphite/20 text-sm font-mono">Sin imagen</span>
                    </div>
                )}

                {/* Callout boxes */}
                {cuadros.map((box) => (
                    <div
                        key={box.id}
                        className={`absolute z-10 max-w-[45%] px-3 py-2 rounded-xl shadow-lg text-xs leading-snug backdrop-blur-sm ${COLOR_CLASSES[box.color]} ${POS_CLASSES[box.posicion]}`}
                    >
                        {box.texto}
                    </div>
                ))}
            </div>

            {caption && (
                <p className="text-center text-xs text-graphite/50 mt-2 italic">{caption}</p>
            )}
        </div>
    )
}

// ─── 3×3 position picker ──────────────────────────────────────────────────────
const GRID_POSITIONS: InfoBoxPosition[] = [
    'top-left', 'top-center', 'top-right',
    'middle-left', 'center', 'middle-right',
    'bottom-left', 'bottom-center', 'bottom-right',
]

const POS_LABELS: Record<InfoBoxPosition, string> = {
    'top-left': '↖', 'top-center': '↑', 'top-right': '↗',
    'middle-left': '←', 'center': '·', 'middle-right': '→',
    'bottom-left': '↙', 'bottom-center': '↓', 'bottom-right': '↘',
}

interface PositionPickerProps {
    value: InfoBoxPosition
    onChange: (p: InfoBoxPosition) => void
}

export function PositionPicker({ value, onChange }: PositionPickerProps) {
    return (
        <div className="grid grid-cols-3 gap-1 w-24">
            {GRID_POSITIONS.map((pos) => (
                <button
                    key={pos}
                    type="button"
                    onClick={() => onChange(pos)}
                    className={`h-7 rounded-md flex items-center justify-center text-sm transition-all ${value === pos
                        ? 'bg-orange text-white shadow-sm'
                        : 'bg-graphite/5 text-graphite/40 hover:bg-graphite/10 hover:text-graphite'
                        }`}
                    title={pos}
                >
                    {POS_LABELS[pos]}
                </button>
            ))}
        </div>
    )
}

// ─── Color picker ─────────────────────────────────────────────────────────────
const COLOR_OPTIONS: { value: InfoBoxColor; bg: string; label: string }[] = [
    { value: 'default', bg: 'bg-white border border-graphite/20', label: 'Blanco' },
    { value: 'info', bg: 'bg-cobalt', label: 'Azul' },
    { value: 'success', bg: 'bg-green-600', label: 'Verde' },
    { value: 'warning', bg: 'bg-amber-400', label: 'Ámbar' },
    { value: 'dark', bg: 'bg-graphite', label: 'Oscuro' },
]

interface ColorPickerProps {
    value: InfoBoxColor
    onChange: (c: InfoBoxColor) => void
}

export function CalloutColorPicker({ value, onChange }: ColorPickerProps) {
    return (
        <div className="flex items-center gap-1.5">
            {COLOR_OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`w-6 h-6 rounded-full transition-all ${opt.bg} ${value === opt.value ? 'ring-2 ring-orange ring-offset-1 scale-110' : 'hover:scale-105'}`}
                    title={opt.label}
                />
            ))}
        </div>
    )
}
