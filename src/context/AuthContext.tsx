import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { auth, db } from '../lib/firebase'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { AppUser, UserRole } from '../types'

const ADMIN_BOOTSTRAP_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@iaprende.com'

function resolveBootstrapRole(email: string | null | undefined): UserRole {
    return email === ADMIN_BOOTSTRAP_EMAIL ? 'admin' : 'alumno'
}

interface AuthContextType {
    user: AppUser | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signUp: (email: string, password: string, nombre: string, apellido: string) => Promise<{ error: string | null }>
    signInWithGoogle: () => Promise<{ error: string | null }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                fetchProfile(firebaseUser)
            } else {
                setUser(null)
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [])

    async function fetchProfile(firebaseUser: any) {
        try {
            const docRef = doc(db, 'usuarios', firebaseUser.uid)
            const docSnap = await getDoc(docRef)
            
            if (docSnap.exists()) {
                setUser(docSnap.data() as AppUser)
            } else {
                console.log('Documento no encontrado, creando documento base...')
                const appUser: AppUser = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    nombre: firebaseUser.displayName?.split(' ')[0] || 'Usuario',
                    apellido: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                    rol: resolveBootstrapRole(firebaseUser.email),
                    created_at: new Date().toISOString()
                }
                await setDoc(docRef, appUser)
                setUser(appUser)
            }
        } catch (error) {
            console.error('Error fetching/creating profile in Firestore:', error)
            alert('Error en base de datos: Asegúrate de haber habilitado Firestore Database en tu consola de Firebase y que las reglas de seguridad permitan escritura/lectura.')
        } finally {
            setLoading(false)
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            return { error: null }
        } catch (error: any) {
            let msg = error.message
            if (error.code === 'auth/invalid-credential') msg = 'Credenciales inválidas.'
            else if (error.code === 'auth/user-not-found') msg = 'Usuario no encontrado.'
            else if (error.code === 'auth/wrong-password') msg = 'Contraseña incorrecta.'
            return { error: msg }
        }
    }

    const signUp = async (email: string, password: string, nombre: string, apellido: string) => {
        try {
            const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)

            if (firebaseUser) {
                const appUser: AppUser = {
                    id: firebaseUser.uid,
                    email,
                    nombre,
                    apellido,
                    rol: resolveBootstrapRole(email),
                    created_at: new Date().toISOString()
                }
                await setDoc(doc(db, 'usuarios', firebaseUser.uid), appUser)
                setUser(appUser)
            }
            return { error: null }
        } catch (error: any) {
            let msg = error.message
            if (error.code === 'auth/email-already-in-use') msg = 'El correo ya está en uso.'
            else if (error.code === 'auth/weak-password') msg = 'La contraseña es muy débil.'
            return { error: msg }
        }
    }

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            // onAuthStateChanged dispara fetchProfile automáticamente,
            // que maneja tanto usuarios existentes como nuevos.
            return { error: null }
        } catch (error: any) {
            return { error: error.message }
        }
    }

    const signOut = async () => {
        await firebaseSignOut(auth)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
