import { beforeEach, expect, it, vi } from 'vitest'
import { validateProduction } from '../scripts/check-production-env.mjs'
import { initializeApp, getAuth, getFirestore, enterReviewRole, resetReview, collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, onSnapshot } from '../src/review/firebase'

beforeEach(() => { resetReview() })
it('review has distinct in-browser accounts and never returns a real ID token', async () => {
  const app = initializeApp({ projectId: 'production-ignored' })
  enterReviewRole('maestro')
  const auth = getAuth(app)
  expect(auth.currentUser.uid).toBe('demo-maestro-001')
  await expect(auth.currentUser.getIdToken()).rejects.toThrow('revisión visual')
  expect(getFirestore(app).name).toBe('VISUAL_REVIEW_ONLY')
})
it('review CRUD and filtered subscriptions persist in the review store', async () => {
  const db = getFirestore()
  const receive = vi.fn()
  const stop = onSnapshot(query(collection(db, 'cursos'), where('publicado', '==', false)), receive)
  const created = await addDoc(collection(db, 'cursos'), { titulo: 'Curso de prueba', publicado: false })
  expect(receive.mock.lastCall?.[0].docs).toHaveLength(1)
  await updateDoc(doc(db, 'cursos', created.id), { publicado: true })
  expect(receive.mock.lastCall?.[0].docs).toHaveLength(0)
  expect((await getDoc(doc(db, 'cursos', created.id))).data().titulo).toBe('Curso de prueba')
  stop()
  expect((await getDocs(collection(db, 'cursos'))).size).toBeGreaterThan(1)
})
it('production validation blocks placeholders, emulators and review configuration', () => {
  expect(validateProduction({ VITE_APP_ENV: 'review', VITE_USE_EMULATORS: 'true' }).length).toBeGreaterThan(0)
  expect(validateProduction({ VITE_APP_ENV: 'production', VITE_FIREBASE_PROJECT_ID: 'demo-iaprende' }).length).toBeGreaterThan(0)
  expect(validateProduction({ VITE_APP_ENV: 'production', VITE_FIREBASE_PROJECT_ID: 'iaprende-1415d', VITE_FIREBASE_API_KEY: 'public-web-config', VITE_FIREBASE_AUTH_DOMAIN: 'iaprende-1415d.firebaseapp.com', VITE_FIREBASE_APP_ID: '1:123:web:abc', VITE_AI_CLAUDE_URL: 'https://us-central1-iaprende-1415d.cloudfunctions.net', VITE_AI_PROXY_URL: 'https://us-central1-iaprende-1415d.cloudfunctions.net/aiProxy' })).toEqual([])
})
