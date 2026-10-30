import { useState, useEffect } from 'react'
import { Save, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import type { ProgresoAlumno, BitacoraEntry } from '../../types'

interface ContenidoTablaEditable {
    titulo: string
    descripcion?: string
    columnas: string[]
    filas_default: BitacoraEntry[]
    progreso_field: string
    ayuda?: string
}

interface Props {
    contenido: ContenidoTablaEditable
    progreso?: ProgresoAlumno | null
    onProgresoUpdate?: (field: keyof ProgresoAlumno, value: unknown) => void
    isEditor?: boolean
}

function bitacoraToFilas(bitacora: BitacoraEntry[]): string[][] {
    return bitacora.map(b => [b.proceso, b.tiempo_semana, b.se_repite ? 'Sí' : 'No', b.candidato_ia])
}

function filasToEntries(filas: string[][]): BitacoraEntry[] {
    return filas.map(row => ({
        proceso: row[0] || '',
        tiempo_semana: row[1] || '',
        se_repite: (row[2] || '').toLowerCase() === 'sí' || (row[2] || '').toLowerCase() === 'si',
        candidato_ia: row[3] || 'Medio',
    }))
}

export function BloqueTablaEditable({ contenido: c, progreso, onProgresoUpdate, isEditor }: Props) {
    const getInitialFilas = (): string[][] => {
        if (progreso?.bitacora?.length) return bitacoraToFilas(progreso.bitacora)
        return bitacoraToFilas(c.filas_default)
    }

    const [filas, setFilas] = useState<string[][]>(getInitialFilas)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        if (progreso?.bitacora?.length) setFilas(bitacoraToFilas(progreso.bitacora))
    }, [progreso])

    const updateCell = (ri: number, ci: number, val: string) => {
        setFilas(prev => {
            const next = prev.map(r => [...r])
            next[ri][ci] = val
            return next
        })
        setSaved(false)
    }

    const addRow = () => {
        setFilas(prev => [...prev, new Array(c.columnas.length).fill('')])
        setSaved(false)
    }

    const removeRow = (ri: number) => {
        setFilas(prev => prev.filter((_, i) => i !== ri))
        setSaved(false)
    }

    const handleSave = () => {
        if (isEditor) return
        const entries = filasToEntries(filas)
        onProgresoUpdate?.('bitacora', entries)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    // Dropdown options for certain columns
    const getOptions = (ci: number): string[] | null => {
        if (ci === 2) return ['Sí', 'No']
        if (ci === 3) return ['Alto', 'Medio', 'Bajo']
        return null
    }

    return (
        <div className="p-4 md:p-6">
            <h3 className="font-serif text-xl text-graphite mb-1">{c.titulo}</h3>
            {c.descripcion && <p className="text-sm text-graphite/60 mb-4">{c.descripcion}</p>}

            <div className="overflow-x-auto rounded-xl border border-graphite/10">
                <table className="w-full min-w-[480px]">
                    <thead>
                        <tr className="bg-cobalt text-white">
                            {c.columnas.map((col, ci) => (
                                <th key={ci} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                                    {col}
                                </th>
                            ))}
                            {!isEditor && <th className="px-3 py-3 w-10" />}
                        </tr>
                    </thead>
                    <tbody>
                        {filas.map((row, ri) => (
                            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-cream/60'}>
                                {row.map((cell, ci) => {
                                    const opts = getOptions(ci)
                                    return (
                                        <td key={ci} className="px-2 py-2 border-b border-graphite/5">
                                            {isEditor ? (
                                                <span className="text-sm text-graphite/50 px-2">{cell || '—'}</span>
                                            ) : opts ? (
                                                <select
                                                    value={cell}
                                                    onChange={(e) => updateCell(ri, ci, e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent text-sm text-graphite focus:outline-none focus:bg-orange/5 rounded-lg"
                                                >
                                                    {opts.map(o => <option key={o}>{o}</option>)}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={cell}
                                                    onChange={(e) => updateCell(ri, ci, e.target.value)}
                                                    placeholder={`${c.columnas[ci]}...`}
                                                    className="w-full px-3 py-2 bg-transparent text-sm text-graphite placeholder:text-graphite/25 focus:outline-none focus:bg-orange/5 rounded-lg"
                                                />
                                            )}
                                        </td>
                                    )
                                })}
                                {!isEditor && (
                                    <td className="px-2 py-2 border-b border-graphite/5">
                                        <button
                                            onClick={() => removeRow(ri)}
                                            className="p-1.5 text-graphite/20 hover:text-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!isEditor && (
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={addRow}
                        className="flex items-center gap-2 text-sm text-orange hover:text-orange/70 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Agregar fila
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            saved
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange text-white hover:bg-orange-light'
                        }`}
                    >
                        {saved
                            ? <><CheckCircle2 className="w-4 h-4" /> Guardado</>
                            : <><Save className="w-4 h-4" /> Guardar tabla</>
                        }
                    </button>
                </div>
            )}

            {c.ayuda && (
                <div className="mt-3 px-4 py-3 bg-cobalt/5 rounded-xl border border-cobalt/10">
                    <p className="text-xs text-cobalt/80">💡 {c.ayuda}</p>
                </div>
            )}
        </div>
    )
}
