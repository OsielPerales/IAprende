import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// Usa import.meta.env para Vite
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'PLACEHOLDER',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'PLACEHOLDER',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'PLACEHOLDER',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'PLACEHOLDER',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'PLACEHOLDER',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || 'PLACEHOLDER',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Opt-in only. Preview URLs do not connect to a developer's localhost.
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
    const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
    if (!localHost || !firebaseConfig.projectId.startsWith('demo-')) {
        throw new Error('Los emuladores requieren navegador local y un proyecto ficticio demo-.')
    }
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: false })
    connectFirestoreEmulator(db, '127.0.0.1', 8085)
}
