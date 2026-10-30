import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useAuth } from '../context/AuthContext'
import { Users, Shield, GraduationCap, BookOpen, ToggleLeft, ToggleRight, Search } from 'lucide-react'
import type { UserRole } from '../types'

const ROL_CONFIG = {
    admin: { label: 'Admin', icon: Shield, color: 'text-purple-600 bg-purple-50' },
    maestro: { label: 'Maestro', icon: GraduationCap, color: 'text-cobalt bg-cobalt/10' },
    alumno: { label: 'Alumno', icon: BookOpen, color: 'text-green-600 bg-green-50' },
}

export function GestionUsuarios() {
    const { user: currentUser } = useAuth()
    const { usuarios, updateUsuario, grupos, grupoAlumnos } = useStore()
    const [search, setSearch] = useState('')
    const [filterRol, setFilterRol] = useState<UserRole | 'todos'>('todos')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editRol, setEditRol] = useState<UserRole>('alumno')

    // Defensa en profundidad: RoleGuard ya protege la ruta, pero verificamos aquí también.
    if (!currentUser || currentUser.rol !== 'admin') return <Navigate to="/" replace />

    const filtered = usuarios.filter((u) => {
        const matchSearch = u.nombre.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        const matchRol = filterRol === 'todos' || u.rol === filterRol
        return matchSearch && matchRol
    })

    const stats = {
        admin: usuarios.filter(u => u.rol === 'admin').length,
        maestro: usuarios.filter(u => u.rol === 'maestro').length,
        alumno: usuarios.filter(u => u.rol === 'alumno').length,
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="font-serif text-3xl text-graphite">Gestión de Usuarios</h1>
                <p className="text-graphite/50 text-sm mt-1">{usuarios.length} usuarios en el sistema</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {(['admin', 'maestro', 'alumno'] as const).map((rol) => {
                    const conf = ROL_CONFIG[rol]
                    return (
                        <div key={rol} className="bg-white rounded-2xl shadow-soft border border-graphite/5 p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${conf.color}`}>
                                <conf.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-2xl font-serif font-bold text-graphite">{stats[rol]}</div>
                                <div className="text-xs text-graphite/40">{conf.label}{stats[rol] !== 1 ? 'es' : ''}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-full sm:min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite/30" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre o email..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
                    />
                </div>
                <div className="flex gap-1 bg-white border border-graphite/10 rounded-xl p-1">
                    {(['todos', 'admin', 'maestro', 'alumno'] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => setFilterRol(r)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filterRol === r
                                    ? 'bg-graphite text-white'
                                    : 'text-graphite/50 hover:text-graphite'
                                }`}
                        >
                            {r === 'todos' ? 'Todos' : ROL_CONFIG[r].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* User table */}
            <div className="bg-white rounded-2xl shadow-soft border border-graphite/5 overflow-hidden">
                <div className="table-responsive">
                <table className="w-full text-sm">
                    <thead className="border-b border-graphite/5 bg-cream/40">
                        <tr>
                            <th className="text-left px-5 py-3 text-xs font-medium text-graphite/40">Usuario</th>
                            <th className="text-left px-3 py-3 text-xs font-medium text-graphite/40">Rol</th>
                            <th className="text-left px-3 py-3 text-xs font-medium text-graphite/40">Grupos</th>
                            <th className="text-right px-5 py-3 text-xs font-medium text-graphite/40">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-graphite/5">
                        {filtered.map((usuario) => {
                            const conf = ROL_CONFIG[usuario.rol]
                            const isEditing = editingId === usuario.id
                            const misGrupos = grupoAlumnos
                                .filter((ga) => ga.alumno_id === usuario.id)
                                .map((ga) => grupos.find((g) => g.id === ga.grupo_id)?.nombre)
                                .filter(Boolean)

                            return (
                                <tr key={usuario.id} className="hover:bg-cream/20 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-cobalt/20 to-mint/30 rounded-full flex items-center justify-center text-sm font-semibold text-cobalt flex-shrink-0">
                                                {(usuario.nombre?.[0] ?? usuario.email[0]).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-graphite">
                                                    {usuario.nombre} {usuario.apellido}
                                                </div>
                                                <div className="text-xs text-graphite/40 font-mono">{usuario.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3.5">
                                        {isEditing ? (
                                            <select
                                                value={editRol}
                                                onChange={(e) => setEditRol(e.target.value as UserRole)}
                                                className="text-xs px-2 py-1.5 rounded-lg bg-cream border border-orange/30 focus:outline-none focus:ring-2 focus:ring-orange/30"
                                                autoFocus
                                            >
                                                <option value="alumno">Alumno</option>
                                                <option value="maestro">Maestro</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${conf.color}`}>
                                                <conf.icon className="w-3 h-3" />
                                                {conf.label}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {misGrupos.length > 0
                                                ? misGrupos.map((g, i) => (
                                                    <span key={i} className="text-xs bg-graphite/5 text-graphite/50 px-2 py-0.5 rounded-lg">{g}</span>
                                                ))
                                                : <span className="text-xs text-graphite/20">—</span>
                                            }
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        {isEditing ? (
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => {
                                                        if (!currentUser || currentUser.rol !== 'admin') return
                                                        updateUsuario(usuario.id, { rol: editRol })
                                                        setEditingId(null)
                                                    }}
                                                    className="px-3 py-1.5 bg-orange text-white rounded-lg text-xs font-medium hover:bg-orange/90 transition-colors"
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="px-3 py-1.5 bg-graphite/5 text-graphite/60 rounded-lg text-xs hover:bg-graphite/10 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setEditingId(usuario.id); setEditRol(usuario.rol) }}
                                                className="px-3 py-1.5 text-xs text-graphite/50 hover:text-orange border border-graphite/10 hover:border-orange/30 rounded-lg transition-all"
                                            >
                                                Cambiar rol
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                </div>
                {filtered.length === 0 && (
                    <div className="py-10 text-center text-graphite/30 text-sm font-mono">
                        No se encontraron usuarios
                    </div>
                )}
            </div>
        </div>
    )
}
