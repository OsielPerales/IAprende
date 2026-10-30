import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types'

interface Props {
    children: React.ReactNode
    allowedRoles: UserRole[]
}

export function RoleGuard({ children, allowedRoles }: Props) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-orange border-t-transparent rounded-full animate-spin" />
                    <span className="text-graphite/50 text-sm font-mono">Cargando...</span>
                </div>
            </div>
        )
    }

    if (!user) return <Navigate to="/login" replace />
    if (!allowedRoles.includes(user.rol)) return <Navigate to="/" replace />

    return <>{children}</>
}
