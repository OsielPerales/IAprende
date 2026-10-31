import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RoleGuard } from './components/RoleGuard'
import { AppLayout } from './components/AppLayout'
import { LoginPage, RegisterPage } from './pages/Auth'
import { AlumnoDashboard, MaestroDashboard, AdminDashboard } from './pages/Dashboards'
import { GruposAdmin } from './pages/GruposAdmin'
import { CursosMaestro, CursoEditor } from './pages/CursoEditor'
import { CursosAlumno, CursoViewer } from './pages/CursoViewer'
import { CursoIAInteractivoV3Preview } from './pages/CursoIAInteractivoV3Preview'
import { CalificacionesAlumno } from './pages/CalificacionesAlumno'
import { GradebookMaestro } from './pages/GradebookMaestro'
import { GestionUsuarios } from './pages/GestionUsuarios'
import { ImpartirCurso, CursosImpartir } from './pages/ImpartirCurso'
import { GruposAlumno } from './pages/GruposAlumno'
import { useEffect, type ReactNode } from 'react'
import { useStore } from './store/useStore'
import './index.css'

function StoreInitializer({ children }: { children: ReactNode }) {
    const initStoreListeners = useStore(s => s.initStoreListeners)
    const { user, loading } = useAuth()

    useEffect(() => {
        // Solo abrir listeners de Firestore cuando el usuario está autenticado.
        // Esto evita errores permission-denied en páginas públicas y cierra
        // los listeners automáticamente al hacer signOut.
        if (loading || !user) return
        const unsub = initStoreListeners()
        return () => unsub()
    }, [user, loading, initStoreListeners])

    return <>{children}</>
}

function RoleRedirect() {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" replace />
    if (user.rol === 'admin') return <Navigate to="/admin" replace />
    if (user.rol === 'maestro') return <Navigate to="/maestro" replace />
    return <Navigate to="/app" replace />
}

function CursoEditorWrapper() {
    const { id } = useParams<{ id: string }>()
    return id ? <CursoEditor cursoId={id} /> : <div>Curso no encontrado</div>
}

function CursoViewerWrapper() {
    const { id } = useParams<{ id: string }>()
    return id ? <CursoViewer cursoId={id} /> : <div>Curso no encontrado</div>
}

function ImpartirCursoWrapper() {
    const { id } = useParams<{ id: string }>()
    return id ? <ImpartirCurso cursoId={id} /> : <div>Curso no encontrado</div>
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <StoreInitializer>
                    <Routes>
                        {/* Public */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/registro" element={<RegisterPage />} />
                        <Route path="/" element={<RoleRedirect />} />

                    {/* ── Alumno ── */}
                    <Route path="/app" element={<RoleGuard allowedRoles={['alumno']}><AppLayout><AlumnoDashboard /></AppLayout></RoleGuard>} />
                    <Route path="/app/cursos" element={<RoleGuard allowedRoles={['alumno']}><AppLayout><CursosAlumno /></AppLayout></RoleGuard>} />
                    <Route path="/app/curso/:id" element={<RoleGuard allowedRoles={['alumno']}><AppLayout><CursoViewerWrapper /></AppLayout></RoleGuard>} />
                    <Route path="/app/grupos" element={<RoleGuard allowedRoles={['alumno']}><AppLayout><GruposAlumno /></AppLayout></RoleGuard>} />
                    <Route path="/app/calificaciones" element={<RoleGuard allowedRoles={['alumno']}><AppLayout><CalificacionesAlumno /></AppLayout></RoleGuard>} />

                    {/* ── Maestro ── */}
                    <Route path="/maestro" element={<RoleGuard allowedRoles={['maestro']}><AppLayout><MaestroDashboard /></AppLayout></RoleGuard>} />
                    <Route path="/maestro/curso-ia-v3/preview" element={<RoleGuard allowedRoles={['maestro']}><AppLayout><CursoIAInteractivoV3Preview /></AppLayout></RoleGuard>} />
                    <Route path="/maestro/cursos" element={<RoleGuard allowedRoles={['maestro']}><AppLayout><CursosMaestro /></AppLayout></RoleGuard>} />
                    <Route path="/maestro/curso/:id/editar" element={<RoleGuard allowedRoles={['maestro']}><AppLayout><CursoEditorWrapper /></AppLayout></RoleGuard>} />
                    <Route path="/maestro/grupos" element={<RoleGuard allowedRoles={['maestro']}><AppLayout><GruposAdmin /></AppLayout></RoleGuard>} />
                    <Route path="/maestro/calificaciones" element={<RoleGuard allowedRoles={['maestro']}><AppLayout><GradebookMaestro /></AppLayout></RoleGuard>} />
                    <Route path="/maestro/impartir" element={<RoleGuard allowedRoles={['maestro']}><AppLayout><CursosImpartir /></AppLayout></RoleGuard>} />
                    <Route path="/maestro/curso/:id/impartir" element={<RoleGuard allowedRoles={['maestro']}><ImpartirCursoWrapper /></RoleGuard>} />

                    {/* ── Admin ── */}
                    <Route path="/admin" element={<RoleGuard allowedRoles={['admin']}><AppLayout><AdminDashboard /></AppLayout></RoleGuard>} />
                    <Route path="/admin/usuarios" element={<RoleGuard allowedRoles={['admin']}><AppLayout><GestionUsuarios /></AppLayout></RoleGuard>} />
                    <Route path="/admin/grupos" element={<RoleGuard allowedRoles={['admin']}><AppLayout><GruposAdmin /></AppLayout></RoleGuard>} />
                    <Route path="/admin/curso-ia-v3/preview" element={<RoleGuard allowedRoles={['admin']}><AppLayout><CursoIAInteractivoV3Preview /></AppLayout></RoleGuard>} />
                    <Route path="/admin/cursos" element={<RoleGuard allowedRoles={['admin']}><AppLayout><CursosMaestro /></AppLayout></RoleGuard>} />
                    <Route path="/admin/curso/:id/editar" element={<RoleGuard allowedRoles={['admin']}><AppLayout><CursoEditorWrapper /></AppLayout></RoleGuard>} />
                    <Route path="/admin/calificaciones" element={<RoleGuard allowedRoles={['admin']}><AppLayout><GradebookMaestro /></AppLayout></RoleGuard>} />
                    <Route path="/admin/config" element={<RoleGuard allowedRoles={['admin']}><AppLayout><div className="text-graphite/40 font-mono text-sm">Configuración — Próximamente</div></AppLayout></RoleGuard>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                </StoreInitializer>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
