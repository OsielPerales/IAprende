import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, ArrowRight, Eye, EyeOff } from 'lucide-react'

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn, signInWithGoogle } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        const { error } = await signIn(email, password)
        setLoading(false)
        if (error) {
            setError(error)
        } else {
            navigate('/')
        }
    }

    const handleGoogle = async () => {
        setError('')
        setLoading(true)
        const { error } = await signInWithGoogle()
        setLoading(false)
        if (error) {
            setError(error)
        } else {
            navigate('/')
        }
    }



    return (
        <div className="min-h-screen flex bg-cream">
            {/* Left — Illustration / Brand panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-cobalt relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-mint rounded-full blur-3xl" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-serif text-xl text-white">iAprende</span>
                    </div>
                    <h2 className="font-serif text-4xl text-white leading-tight mb-6">
                        Educación industrial que <span className="text-orange-light">transforma</span> tu equipo.
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed max-w-md">
                        Plataforma de capacitación validada en nuestra propia planta. Del conocimiento a la acción.
                    </p>
                </div>
                <a href={import.meta.env.VITE_MAIN_APP_URL || 'https://desarrolloselaborados.com'} rel="noopener noreferrer" className="relative z-10 text-white/50 text-sm font-mono hover:text-white transition-colors">
                    &larr; Volver a Desarrollos Elaborados
                </a>
            </div>

            {/* Right — Login form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 mb-12 lg:hidden">
                        <div className="w-10 h-10 bg-orange rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-serif text-2xl text-graphite">iAprende</span>
                    </div>

                    <h1 className="font-serif text-3xl text-graphite mb-2">Iniciar sesión</h1>
                    <p className="text-graphite/50 mb-10">Ingresa con tu cuenta de la plataforma.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-graphite/70 ml-1">Correo electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-graphite/10 text-graphite text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all shadow-sm"
                                placeholder="tu@correo.com"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-graphite/70 ml-1">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-2xl bg-white border border-graphite/10 text-graphite text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all shadow-sm pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-graphite/30 hover:text-graphite/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center gap-3 py-4 text-base rounded-2xl"
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between">
                        <hr className="w-full border-graphite/10" />
                        <span className="px-3 text-xs text-graphite/40 bg-cream">O</span>
                        <hr className="w-full border-graphite/10" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={loading}
                        className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white border border-graphite/10 text-graphite font-medium hover:bg-graphite/5 transition-all focus:outline-none focus:ring-2 focus:ring-graphite/20"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continuar con Google
                    </button>

                    <div className="mt-6 text-center">
                        <Link to="/registro" className="text-sm text-orange hover:underline">
                            ¿No tienes cuenta? Regístrate
                        </Link>
                    </div>


                </div>
            </div>
        </div>
    )
}

export function RegisterPage() {
    const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signUp, signInWithGoogle } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        const { error } = await signUp(form.email, form.password, form.nombre, form.apellido)
        setLoading(false)
        if (error) {
            setError(error)
        } else {
            navigate('/')
        }
    }

    const handleGoogle = async () => {
        setError('')
        setLoading(true)
        const { error } = await signInWithGoogle()
        setLoading(false)
        if (error) {
            setError(error)
        } else {
            navigate('/')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream p-6">
            <div className="w-full max-w-md">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-orange rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-serif text-xl text-graphite">iAprende</span>
                </div>

                <h1 className="font-serif text-3xl text-graphite mb-2">Crear cuenta</h1>
                <p className="text-graphite/50 mb-8">Únete a la plataforma de capacitación industrial.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1.5">Nombre</label>
                            <input
                                type="text"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-graphite/10 text-graphite text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-graphite mb-1.5">Apellido</label>
                            <input
                                type="text"
                                value={form.apellido}
                                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-graphite/10 text-graphite text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-graphite mb-1.5">Correo</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-graphite/10 text-graphite text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-graphite mb-1.5">Contraseña</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-graphite/10 text-graphite text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
                            minLength={6}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2 py-3">
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between">
                    <hr className="w-full border-graphite/10" />
                    <span className="px-3 text-xs text-graphite/40 bg-cream">O</span>
                    <hr className="w-full border-graphite/10" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={loading}
                    className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white border border-graphite/10 text-graphite font-medium hover:bg-graphite/5 transition-all focus:outline-none focus:ring-2 focus:ring-graphite/20"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continuar con Google
                </button>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-orange hover:underline">
                        ¿Ya tienes cuenta? Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    )
}
