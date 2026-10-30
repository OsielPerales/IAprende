import { create } from 'zustand'
import { db } from '../lib/firebase'
import {
    collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, addDoc, writeBatch, getDoc
} from 'firebase/firestore'
import type { AppUser, Grupo, GrupoAlumno, Curso, Bloque, CuestionarioRespuesta, AlumnoAnalytics, Notificacion, ProgresoAlumno, SolicitudInscripcion, CursoGrupo } from '../types'

interface StoreState {
    usuarios: AppUser[]
    grupos: Grupo[]
    grupoAlumnos: GrupoAlumno[]
    cursos: Curso[]
    bloques: Bloque[]
    respuestas: CuestionarioRespuesta[]
    alumnoAnalyticsMap: Record<string, AlumnoAnalytics>   // key: alumno_id
    notificaciones: Notificacion[]
    solicitudes: SolicitudInscripcion[]
    cursoGrupos: CursoGrupo[]

    // Inicialización de Listeners en tiempo real
    initStoreListeners: () => () => void

    // Grupos
    addGrupo: (g: Omit<Grupo, 'id' | 'created_at'>) => Promise<void>
    updateGrupo: (id: string, data: Partial<Grupo>) => Promise<void>
    deleteGrupo: (id: string) => Promise<void>
    addAlumnoToGrupo: (grupoId: string, alumnoId: string) => Promise<void>
    removeAlumnoFromGrupo: (grupoId: string, alumnoId: string) => Promise<void>

    // Solicitudes de inscripción
    addSolicitud: (grupoId: string, alumnoId: string, mensaje?: string) => Promise<void>
    aprobarSolicitud: (solicitudId: string, grupoId: string, alumnoId: string) => Promise<void>
    rechazarSolicitud: (solicitudId: string) => Promise<void>

    // Cursos asignados a grupos
    addCursoToGrupo: (cursoId: string, grupoId: string) => Promise<void>
    removeCursoFromGrupo: (cursoId: string, grupoId: string) => Promise<void>

    // Cursos
    addCurso: (c: Omit<Curso, 'id' | 'created_at'>) => Promise<void>
    updateCurso: (id: string, data: Partial<Curso>) => Promise<void>
    deleteCurso: (id: string) => Promise<void>

    // Bloques
    addBloque: (b: Omit<Bloque, 'id' | 'created_at'>) => Promise<void>
    updateBloque: (id: string, data: Partial<Bloque>) => Promise<void>
    deleteBloque: (id: string) => Promise<void>
    reorderBloques: (cursoId: string, orderedIds: string[]) => Promise<void>

    // Respuestas
    submitRespuesta: (r: Omit<CuestionarioRespuesta, 'id' | 'enviado_at'>) => Promise<void>
    calificarRespuesta: (id: string, cal: number) => Promise<void>
    updateRespuesta: (id: string, data: Partial<CuestionarioRespuesta>) => Promise<void>

    // Usuarios
    updateUsuario: (id: string, data: Partial<AppUser>) => Promise<void>

    // Analytics (SP4)
    setAlumnoAnalytics: (alumnoId: string, data: AlumnoAnalytics) => void

    // Notificaciones (SP6)
    markNotificationRead: (id: string) => Promise<void>
    markAllNotificationsRead: (userId: string) => Promise<void>

    // ProgresoAlumno (per-session, no global listener)
    loadProgresoAlumno: (userId: string, cursoId: string) => Promise<ProgresoAlumno | null>
    upsertProgresoAlumno: (p: ProgresoAlumno) => Promise<void>

    // Helpers
    getGrupoAlumnos: (grupoId: string) => AppUser[]
    getMaestro: (maestroId: string) => AppUser | undefined
    getCursosBloques: (cursoId: string) => Bloque[]
    getCursosDeGrupo: (grupoId: string) => Curso[]
    getGruposDeAlumno: (alumnoId: string) => Grupo[]
    getCursosDeAlumno: (alumnoId: string) => Curso[]
}

export const useStore = create<StoreState>((set, get) => ({
    usuarios: [],
    grupos: [],
    grupoAlumnos: [],
    cursos: [],
    bloques: [],
    respuestas: [],
    alumnoAnalyticsMap: {},
    notificaciones: [],
    solicitudes: [],
    cursoGrupos: [],

    initStoreListeners: () => {
        const unsubs: (() => void)[] = []

        unsubs.push(onSnapshot(collection(db, 'usuarios'), (snap: any) => {
            set({ usuarios: snap.docs.map((d: any) => d.data() as AppUser) })
        }))
        unsubs.push(onSnapshot(collection(db, 'grupos'), (snap: any) => {
            set({ grupos: snap.docs.map((d: any) => ({ ...d.data(), id: d.id } as Grupo)) })
        }))
        unsubs.push(onSnapshot(collection(db, 'grupo_alumnos'), (snap: any) => {
            set({ grupoAlumnos: snap.docs.map((d: any) => d.data() as GrupoAlumno) })
        }))
        unsubs.push(onSnapshot(collection(db, 'cursos'), (snap: any) => {
            set({ cursos: snap.docs.map((d: any) => ({ ...d.data(), id: d.id } as Curso)) })
        }))
        unsubs.push(onSnapshot(collection(db, 'bloques'), (snap: any) => {
            set({ bloques: snap.docs.map((d: any) => ({ ...d.data(), id: d.id } as Bloque)).sort((a: any, b: any) => a.orden - b.orden) })
        }))
        unsubs.push(onSnapshot(collection(db, 'respuestas'), (snap: any) => {
            set({ respuestas: snap.docs.map((d: any) => ({ ...d.data(), id: d.id } as CuestionarioRespuesta)) })
        }))
        // SP4: alumno_analytics
        unsubs.push(onSnapshot(collection(db, 'alumno_analytics'), (snap: any) => {
            const map: Record<string, AlumnoAnalytics> = {}
            snap.docs.forEach((d: any) => { map[d.id] = d.data() as AlumnoAnalytics })
            set({ alumnoAnalyticsMap: map })
        }))
        // SP6: notificaciones
        unsubs.push(onSnapshot(collection(db, 'notificaciones'), (snap: any) => {
            set({
                notificaciones: snap.docs
                    .map((d: any) => ({ ...d.data(), id: d.id } as Notificacion))
                    .sort((a: Notificacion, b: Notificacion) => b.created_at.localeCompare(a.created_at))
            })
        }))
        unsubs.push(onSnapshot(collection(db, 'solicitudes_inscripcion'), (snap: any) => {
            set({
                solicitudes: snap.docs
                    .map((d: any) => ({ ...d.data(), id: d.id } as SolicitudInscripcion))
                    .sort((a: SolicitudInscripcion, b: SolicitudInscripcion) => b.created_at.localeCompare(a.created_at))
            })
        }))
        unsubs.push(onSnapshot(collection(db, 'curso_grupos'), (snap: any) => {
            set({ cursoGrupos: snap.docs.map((d: any) => d.data() as CursoGrupo) })
        }))

        return () => unsubs.forEach(u => u())
    },

    // ── Grupos ──
    addGrupo: async (g) => {
        await addDoc(collection(db, 'grupos'), { ...g, created_at: new Date().toISOString() })
    },
    updateGrupo: async (id, data) => {
        await updateDoc(doc(db, 'grupos', id), data)
    },
    deleteGrupo: async (id) => {
        const batch = writeBatch(db)
        batch.delete(doc(db, 'grupos', id))
        // Borrado en cascada: eliminar todas las inscripciones del grupo usando el caché local.
        const s = get()
        s.grupoAlumnos
            .filter((ga) => ga.grupo_id === id)
            .forEach((ga) => {
                batch.delete(doc(db, 'grupo_alumnos', `${id}_${ga.alumno_id}`))
            })
        await batch.commit()
    },
    addAlumnoToGrupo: async (grupoId, alumnoId) => {
        const idDoc = `${grupoId}_${alumnoId}`
        await setDoc(doc(db, 'grupo_alumnos', idDoc), {
            grupo_id: grupoId,
            alumno_id: alumnoId,
            fecha_ingreso: new Date().toISOString()
        })
    },
    removeAlumnoFromGrupo: async (grupoId, alumnoId) => {
        const idDoc = `${grupoId}_${alumnoId}`
        await deleteDoc(doc(db, 'grupo_alumnos', idDoc))
    },

    // ── Solicitudes de inscripción ──
    addSolicitud: async (grupoId, alumnoId, mensaje = '') => {
        const idDoc = `${grupoId}_${alumnoId}`
        await setDoc(doc(db, 'solicitudes_inscripcion', idDoc), {
            id: idDoc,
            grupo_id: grupoId,
            alumno_id: alumnoId,
            estado: 'pendiente',
            mensaje,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
    },
    aprobarSolicitud: async (solicitudId, grupoId, alumnoId) => {
        const batch = writeBatch(db)
        batch.update(doc(db, 'solicitudes_inscripcion', solicitudId), {
            estado: 'aprobada',
            updated_at: new Date().toISOString(),
        })
        batch.set(doc(db, 'grupo_alumnos', `${grupoId}_${alumnoId}`), {
            grupo_id: grupoId,
            alumno_id: alumnoId,
            fecha_ingreso: new Date().toISOString(),
        })
        await batch.commit()
    },
    rechazarSolicitud: async (solicitudId) => {
        await updateDoc(doc(db, 'solicitudes_inscripcion', solicitudId), {
            estado: 'rechazada',
            updated_at: new Date().toISOString(),
        })
    },

    // ── Curso-Grupo ──
    addCursoToGrupo: async (cursoId, grupoId) => {
        const idDoc = `${cursoId}_${grupoId}`
        await setDoc(doc(db, 'curso_grupos', idDoc), {
            curso_id: cursoId,
            grupo_id: grupoId,
            fecha_asignacion: new Date().toISOString(),
        })
    },
    removeCursoFromGrupo: async (cursoId, grupoId) => {
        await deleteDoc(doc(db, 'curso_grupos', `${cursoId}_${grupoId}`))
    },

    // ── Cursos ──
    addCurso: async (c) => {
        await addDoc(collection(db, 'cursos'), { ...c, created_at: new Date().toISOString() })
    },
    updateCurso: async (id, data) => {
        await updateDoc(doc(db, 'cursos', id), data)
    },
    deleteCurso: async (id) => {
        await deleteDoc(doc(db, 'cursos', id))
    },

    // ── Bloques ──
    addBloque: async (b) => {
        await addDoc(collection(db, 'bloques'), { ...b, created_at: new Date().toISOString() })
    },
    updateBloque: async (id, data) => {
        await updateDoc(doc(db, 'bloques', id), data)
    },
    deleteBloque: async (id) => {
        await deleteDoc(doc(db, 'bloques', id))
    },
    reorderBloques: async (cursoId, orderedIds) => {
        const batch = writeBatch(db)
        orderedIds.forEach((id, index) => {
            batch.update(doc(db, 'bloques', id), { orden: index + 1 })
        })
        await batch.commit()
    },

    // ── Respuestas ──
    submitRespuesta: async (r) => {
        await addDoc(collection(db, 'respuestas'), { ...r, enviado_at: new Date().toISOString() })
    },
    calificarRespuesta: async (id, cal) => {
        await updateDoc(doc(db, 'respuestas', id), { calificacion: cal })
    },
    updateRespuesta: async (id, data) => {
        await updateDoc(doc(db, 'respuestas', id), data)
    },

    // ── Usuarios ──
    updateUsuario: async (id, data) => {
        await updateDoc(doc(db, 'usuarios', id), data)
    },

    // ── Analytics (SP4) ──
    setAlumnoAnalytics: (alumnoId, data) => {
        set(s => ({ alumnoAnalyticsMap: { ...s.alumnoAnalyticsMap, [alumnoId]: data } }))
    },

    // ── Notificaciones (SP6) ──
    markNotificationRead: async (id) => {
        await updateDoc(doc(db, 'notificaciones', id), { leida: true })
    },
    markAllNotificationsRead: async (userId) => {
        const { notificaciones } = get()
        const unread = notificaciones.filter(n => n.destinatario_id === userId && !n.leida)
        const batch = writeBatch(db)
        unread.forEach(n => batch.update(doc(db, 'notificaciones', n.id), { leida: true }))
        if (unread.length > 0) await batch.commit()
    },

    // ── ProgresoAlumno ──
    loadProgresoAlumno: async (userId, cursoId) => {
        const docRef = doc(db, 'progreso_alumno', `${userId}_${cursoId}`)
        const snap = await getDoc(docRef)
        if (snap.exists()) return snap.data() as ProgresoAlumno
        return null
    },
    upsertProgresoAlumno: async (p) => {
        const docRef = doc(db, 'progreso_alumno', `${p.userId}_${p.cursoId}`)
        await setDoc(docRef, { ...p, updated_at: new Date().toISOString() }, { merge: true })
    },

    // ── Helpers (Síncronos, leen del caché local de Zustand) ──
    getGrupoAlumnos: (grupoId) => {
        const s = get()
        const alumnoIds = s.grupoAlumnos.filter((ga) => ga.grupo_id === grupoId).map((ga) => ga.alumno_id)
        return s.usuarios.filter((u) => alumnoIds.includes(u.id))
    },
    getMaestro: (maestroId) => get().usuarios.find((u) => u.id === maestroId),
    getCursosBloques: (cursoId) => get().bloques.filter((b) => b.curso_id === cursoId).sort((a, b) => a.orden - b.orden),
    getCursosDeGrupo: (grupoId) => {
        const s = get()
        const cursoIds = s.cursoGrupos.filter((cg) => cg.grupo_id === grupoId).map((cg) => cg.curso_id)
        return s.cursos.filter((c) => cursoIds.includes(c.id))
    },
    getGruposDeAlumno: (alumnoId) => {
        const s = get()
        const grupoIds = s.grupoAlumnos.filter((ga) => ga.alumno_id === alumnoId).map((ga) => ga.grupo_id)
        return s.grupos.filter((g) => grupoIds.includes(g.id))
    },
    getCursosDeAlumno: (alumnoId) => {
        const s = get()
        const grupoIds = new Set(s.grupoAlumnos.filter((ga) => ga.alumno_id === alumnoId).map((ga) => ga.grupo_id))
        const cursoIds = new Set(s.cursoGrupos.filter((cg) => grupoIds.has(cg.grupo_id)).map((cg) => cg.curso_id))
        return s.cursos.filter((c) => c.publicado && cursoIds.has(c.id))
    },
}))
