import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    GraduationCap,
    BarChart3,
    FolderOpen,
    UserCog,
    Menu,
    X,
    Play,
    Globe,
} from 'lucide-react'
import { useState } from 'react'
import type { UserRole } from '../types'
import { useStore } from '../store/useStore'
import { NotificationsPanel } from './NotificationsPanel'

interface NavItem {
    label: string
    path: string
    icon: React.ElementType
}

const navByRole: Record<UserRole, NavItem[]> = {
    alumno: [
        { label: 'Mi Dashboard', path: '/app', icon: LayoutDashboard },
        { label: 'Mis Cursos', path: '/app/cursos', icon: BookOpen },
        { label: 'Mis Grupos', path: '/app/grupos', icon: Users },
        { label: 'Calificaciones', path: '/app/calificaciones', icon: BarChart3 },
    ],
    maestro: [
        { label: 'Dashboard', path: '/maestro', icon: LayoutDashboard },
        { label: 'Mis Cursos', path: '/maestro/cursos', icon: FolderOpen },
        { label: 'Impartir Curso', path: '/maestro/impartir', icon: Play },
        { label: 'Mis Grupos', path: '/maestro/grupos', icon: Users },
        { label: 'Calificaciones', path: '/maestro/calificaciones', icon: BarChart3 },
    ],
    admin: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Usuarios', path: '/admin/usuarios', icon: UserCog },
        { label: 'Grupos', path: '/admin/grupos', icon: Users },
        { label: 'Cursos', path: '/admin/cursos', icon: BookOpen },
        { label: 'Configuración', path: '/admin/config', icon: Settings },
    ],
}

export function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { notificaciones, markNotificationRead, markAllNotificationsRead } = useStore()

    const misNotificaciones = user
        ? notificaciones.filter(n => n.destinatario_id === user.id)
        : []

    if (!user) return null
    const navItems = navByRole[user.rol]

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const initials = `${user.nombre?.[0] ?? ''}${user.apellido?.[0] ?? ''}`.toUpperCase() || user.email[0].toUpperCase()

    return (
        <div className="min-h-screen flex bg-cream">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-graphite/8 flex flex-col transition-transform duration-300
                    lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo */}
                <div className="p-5 border-b border-graphite/8">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-orange rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-serif text-lg text-graphite leading-none block">iAprende</span>
                            <span className="text-[10px] text-graphite/40 font-mono uppercase tracking-wider">
                                {user.rol === 'admin' ? 'Administración' : user.rol === 'maestro' ? 'Docente' : 'Estudiante'}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Nav items */}
                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                                    ? 'bg-orange/10 text-orange font-medium'
                                    : 'text-graphite/60 hover:bg-graphite/5 hover:text-graphite'
                                    }`}
                            >
                                <item.icon className="w-[18px] h-[18px]" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* User info */}
                <div className="p-3 border-t border-graphite/8">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-9 h-9 bg-cobalt/10 rounded-full flex items-center justify-center text-cobalt text-xs font-bold">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-graphite truncate">{user.nombre} {user.apellido}</div>
                            <div className="text-xs text-graphite/40 truncate">{user.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-all mt-1"
                    >
                        <LogOut className="w-[18px] h-[18px]" />
                        Cerrar sesión
                    </button>
                    <a
                        href={import.meta.env.VITE_MAIN_APP_URL || 'https://desarrolloselaborados.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-graphite/50 hover:bg-graphite/5 hover:text-graphite transition-all mt-1"
                    >
                        <Globe className="w-[18px] h-[18px]" />
                        Sitio principal
                    </a>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-graphite/20 backdrop-blur-sm z-30 lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 w-full lg:ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-cream/80 backdrop-blur-md border-b border-graphite/5">
                    <div className="flex items-center justify-between h-14 px-4 lg:px-8">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2.5 rounded-lg hover:bg-graphite/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
                        >
                            {sidebarOpen ? <X className="w-5 h-5 text-graphite" /> : <Menu className="w-5 h-5 text-graphite" />}
                        </button>
                        <div className="text-xs text-graphite/40 font-mono hidden lg:block">
                            Plataforma iAprende · Desarrollos Elaborados
                        </div>
                        <div className="flex items-center gap-3">
                            {/* SP6: Notifications bell (maestros y admins) */}
                            {(user.rol === 'maestro' || user.rol === 'admin') && (
                                <NotificationsPanel
                                    notificaciones={misNotificaciones}
                                    onMarkRead={markNotificationRead}
                                    onMarkAllRead={() => markAllNotificationsRead(user.id)}
                                />
                            )}
                            <span className="text-xs text-graphite/50">
                                {user.nombre} · <span className="capitalize text-orange">{user.rol}</span>
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
