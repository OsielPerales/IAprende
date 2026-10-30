import { useState, useEffect } from 'react'
import { Save, CheckCircle2 } from 'lucide-react'
import type { ProgresoAlumno } from '../../types'

interface ContenidoCampoLibre {
    titulo: string
    badge?: string
    badge_color?: string
    descripcion?: string
    placeholder?: string
    template?: string
    progreso_field: string
    ayuda?: string
}

interface Props {
    contenido: ContenidoCampoLibre
    progreso?: ProgresoAlumno | null
    onProgresoUpdate?: (field: keyof ProgresoAlumno, value: unknown) => void
    isEditor?: boolean
}

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
    cobalt:   { bg: '#2A4B7C', text: 'white' },
    green:    { bg: '#15803d', text: 'white' },
    orange:   { bg: '#E07A5F', text: 'white' },
    red:      { bg: '#dc2626', text: 'white' },
    lavender: { bg: '#6B5EA8', text: 'white' },
}

export function BloqueCampoLibre({ contenido: c, progreso, onProgresoUpdate, isEditor }: Props) {
    const getInitialValue = () => {
        if (progreso) {
            const stored = (progreso as any)[c.progreso_field]
            if (typeof stored === 'string' && stored.trim()) return stored
        }
        return c.template || ''
    }

    const [value, setValue] = useState(getInitialValue)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const stored = progreso ? (progreso as any)[c.progreso_field] : null
        if (typeof stored === 'string' && stored.trim()) {
            setValue(stored)
        }
    }, [progreso])

    const handleSave = () => {
        if (!value.trim() || isEditor) return
        onProgresoUpdate?.(c.progreso_field as keyof ProgresoAlumno, value.trim())
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const badge = c.badge
    const badgeStyle = badge ? (BADGE_STYLES[c.badge_color || 'cobalt'] ?? BADGE_STYLES.cobalt) : null

    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-2">
                {badge && badgeStyle && (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider"
                        style={{ background: badgeStyle.bg, color: badgeStyle.text }}
                    >
                        {badge}
                    </span>
                )}
                <h3 className="font-serif text-xl text-graphite">{c.titulo}</h3>
            </div>

            {c.descripcion && (
                <p className="text-sm text-graphite/60 mb-4">{c.descripcion}</p>
            )}

            <div className="relative">
                <textarea
                    value={value}
                    onChange={(e) => { setValue(e.target.value); setSaved(false) }}
                    disabled={isEditor}
                    placeholder={c.placeholder || 'Escribe aquí...'}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-cream border-2 border-graphite/10 text-graphite text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange/40 resize-none disabled:opacity-50 transition-all"
                />
                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-graphite/30 font-mono">{value.length} caracteres</span>
                    {!isEditor && (
                        <button
                            onClick={handleSave}
                            disabled={!value.trim()}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                saved
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange text-white hover:bg-orange-light disabled:opacity-30'
                            }`}
                        >
                            {saved
                                ? <><CheckCircle2 className="w-4 h-4" /> Guardado</>
                                : <><Save className="w-4 h-4" /> Guardar</>
                            }
                        </button>
                    )}
                </div>
            </div>

            {c.ayuda && (
                <div className="mt-3 px-4 py-3 bg-cobalt/5 rounded-xl border border-cobalt/10">
                    <p className="text-xs text-cobalt/80">💡 {c.ayuda}</p>
                </div>
            )}
        </div>
    )
}
