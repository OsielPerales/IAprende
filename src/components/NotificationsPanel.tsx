/**
 * SP6 — Panel de Notificaciones Inteligentes
 *
 * Ícono de campana en el navbar con badge de no leídas.
 * Slide-in panel con el digest diario generado por Claude.
 */
import { useState, useRef, useEffect } from 'react'
import { Bell, X, CheckCheck } from 'lucide-react'
import type { Notificacion } from '../types'

interface Props {
  notificaciones: Notificacion[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}

export function NotificationsPanel({ notificaciones, onMarkRead, onMarkAllRead }: Props) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const unread = notificaciones.filter(n => !n.leida).length

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg hover:bg-graphite/5 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5 text-graphite/60" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-graphite/8 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-graphite/5">
            <h3 className="font-medium text-graphite text-sm">Notificaciones</h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1 text-xs text-cobalt hover:text-cobalt/70 transition-colors"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Todas leídas
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-graphite/5 rounded-lg">
                <X className="w-4 h-4 text-graphite/40" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 text-graphite/15 mx-auto mb-2" />
                <p className="text-xs text-graphite/30 font-mono">Sin notificaciones aún</p>
              </div>
            ) : (
              notificaciones.slice(0, 20).map(notif => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 border-b border-graphite/5 last:border-0 cursor-pointer hover:bg-cream/50 transition-colors ${!notif.leida ? 'bg-cobalt/3' : ''}`}
                  onClick={() => onMarkRead(notif.id)}
                >
                  <div className="flex items-start gap-2">
                    {!notif.leida && (
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full mt-1.5 flex-shrink-0" />
                    )}
                    <div className={!notif.leida ? '' : 'ml-3.5'}>
                      <p className="text-xs font-medium text-graphite mb-0.5">{notif.titulo}</p>
                      <p className="text-xs text-graphite/60 leading-relaxed">{notif.cuerpo}</p>
                      <p className="text-[10px] text-graphite/25 font-mono mt-1">
                        {new Date(notif.created_at).toLocaleDateString('es-MX', {
                          weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
