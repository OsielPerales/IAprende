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
import { doc, getDoc, runTransaction } from 'firebase/firestore'
import type { AppUser } from '../types'

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
                setLoading(true)
                setUser(null)
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
                if (auth.currentUser?.uid === firebaseUser.uid) setUser({ ...docSnap.data(), id: firebaseUser.uid } as AppUser)
            } else {
                console.log('Documento no encontrado, creando documento base...')
                const appUser: AppUser = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    nombre: firebaseUser.displayName?.split(' ')[0] || 'Usuario',
                    apellido: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                    rol: 'alumno',
                    created_at: new Date().toISOString()
                }
                const profile = await runTransaction(db, async tx => {
                    const current = await tx.get(docRef)
                    if (current.exists()) return { ...current.data(), id: firebaseUser.uid } as AppUser
                    tx.set(docRef, appUser)
                    return appUser
                })
                if (auth.currentUser?.uid === firebaseUser.uid) setUser(profile)
            }
        } catch (error) {
            if (auth.currentUser?.uid === firebaseUser.uid) setUser(null)
            console.error('No se pudo cargar el perfil. Intenta iniciar sesión de nuevo.')
        } finally {
            if (auth.currentUser?.uid === firebaseUser.uid) setLoading(false)
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
                    rol: 'alumno',
                    created_at: new Date().toISOString()
                }
                const ref = doc(db, 'usuarios', firebaseUser.uid)
                const profile = await runTransaction(db, async tx => {
                    const current = await tx.get(ref)
                    if (current.exists()) {
                        tx.update(ref, { nombre, apellido })
                        return { ...current.data(), id: firebaseUser.uid, nombre, apellido } as AppUser
                    }
                    tx.set(ref, appUser)
                    return appUser
                })
                if (auth.currentUser?.uid === firebaseUser.uid) setUser(profile)
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
