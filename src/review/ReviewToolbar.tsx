import { useState } from 'react'
import { enterReviewRole, resetReview } from './firebase'
import type { UserRole } from '../types'

export default function ReviewToolbar() {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(true)
  function enter(role: UserRole) { enterReviewRole(role); window.location.assign(role === 'alumno' ? '/app' : '/' + role) }
  async function copy() {
    const context = `iAprende · Revisión visual\nPantalla: ${location.href}\nVersión: ${import.meta.env.VITE_BUILD_SHA || 'local'}\nQué observé:\nQué esperaba:`
    try { await navigator.clipboard.writeText(context); setCopied(true); setTimeout(() => setCopied(false), 3000) }
    catch { window.prompt('Copia este contexto y envíalo en ChatGPT:', context) }
  }
  return <aside aria-label="Controles de revisión visual" style={{ position: 'fixed', bottom: 8, left: 8, right: 8, zIndex: 10000, background: '#fff8eb', color: '#192c43', border: '1px solid #e07a5f', borderRadius: 14, padding: '8px 12px', boxShadow: '0 4px 20px #0002', fontFamily: 'system-ui', fontSize: 12 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
      <strong>Revisión visual · Datos de ejemplo</strong>
      <button onClick={() => setExpanded(!expanded)} aria-label={expanded ? 'Reducir controles' : 'Mostrar controles'}>{expanded ? 'Reducir' : 'Abrir'}</button>
    </div>
    {expanded && <><p style={{ margin: '4px 0 8px' }}>Los cambios se guardan en este navegador. Acceso, permisos e IA reales se verifican en Firebase DEV.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {(['alumno', 'maestro', 'admin'] as UserRole[]).map(role => <button key={role} onClick={() => enter(role)} style={{ background: '#2a4b7c', color: 'white', borderRadius: 8, padding: '7px 10px' }}>{role === 'admin' ? 'Administrador' : role === 'maestro' ? 'Maestro' : 'Alumno'}</button>)}
        <button onClick={copy} style={{ padding: '7px 8px' }}>{copied ? 'Contexto copiado' : 'Copiar observación'}</button>
        <button onClick={() => { if (confirm('¿Restablecer los datos de ejemplo de este navegador?')) { resetReview(); location.assign('/login') } }} style={{ padding: '7px 8px' }}>Restablecer</button>
      </div></>}
  </aside>
}
