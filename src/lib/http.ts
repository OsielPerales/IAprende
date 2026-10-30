import { auth } from './firebase'

/** Send the current Firebase identity to the configured backend, never a role from the UI. */
export async function authenticatedFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const user = auth.currentUser
  if (!user) throw new Error('Inicia sesión para continuar.')
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${await user.getIdToken()}`)
  const response = await fetch(input, { ...init, headers })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(typeof body.error === 'string' ? body.error : 'No se pudo completar la operación.')
  }
  return response
}
