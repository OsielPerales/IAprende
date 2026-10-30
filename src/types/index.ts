export type UserRole = 'alumno' | 'maestro' | 'admin'

export interface AppUser {
    id: string
    email: string
    nombre: string
    apellido: string
    rol: UserRole
    avatar_url?: string
    created_at: string
}

export interface Grupo {
    id: string
    nombre: string
    descripcion: string
    maestro_id: string
    maestro?: AppUser
    created_at: string
}

export interface GrupoAlumno {
    grupo_id: string
    alumno_id: string
    fecha_ingreso: string
    alumno?: AppUser
}

export interface Curso {
    id: string
    titulo: string
    descripcion: string
    maestro_id: string
    publicado: boolean
    portada_url?: string
    created_at: string
}

export interface CursoGrupo {
    curso_id: string
    grupo_id: string
    fecha_asignacion: string
}

export interface SolicitudInscripcion {
    id: string
    alumno_id: string
    grupo_id: string
    estado: 'pendiente' | 'aprobada' | 'rechazada'
    mensaje?: string
    created_at: string
    updated_at: string
}

// ─── Info callout position (3×3 grid) ───────────────────────────────────────
export type InfoBoxPosition =
    | 'top-left' | 'top-center' | 'top-right'
    | 'middle-left' | 'center' | 'middle-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right'

export type InfoBoxColor = 'default' | 'info' | 'success' | 'warning' | 'dark'

export interface InfoBox {
    id: string
    texto: string
    posicion: InfoBoxPosition
    color: InfoBoxColor
}

// ─── Image block layout ───────────────────────────────────────────────────────
export type ImagenLayout = 'completa' | 'derecha' | 'izquierda'

// ─── Block types ─────────────────────────────────────────────────────────────
export type BloqueType =
    | 'texto' | 'carrusel' | 'cuestionario' | 'simulador' | 'imagen'
    | 'portada' | 'comparador' | 'infografia' | 'tarjetas_flip'
    | 'tabla_editable' | 'checklist' | 'campo_libre'
    | 'simulador_prompt' | 'caso_etico' | 'mapa_ecosistema' | 'resumen_personal'

export interface Bloque {
    id: string
    curso_id: string
    orden: number
    tipo: BloqueType
    contenido: Record<string, unknown>
    /** Marks the start of a new visual page in the student viewer */
    inicio_pagina?: boolean
    created_at: string
}

export interface CuestionarioRespuesta {
    id: string
    bloque_id: string
    alumno_id: string
    respuestas: Record<string, unknown>
    calificacion: number | null
    feedback_maestro?: string
    enviado_at: string
}

// ─── Student progress (progreso_alumno collection) ───────────────────────────
export interface BitacoraEntry {
    proceso: string
    tiempo_semana: string
    se_repite: boolean
    candidato_ia: string
}

export interface ProgresoAlumno {
    userId: string
    cursoId: string
    bloques_completados: string[]
    bitacora: BitacoraEntry[]
    compromisos_encuadre: Record<string, string>
    rol_construido: string
    contexto_construido: string
    prompt_maestro: string
    calificacion_formativa: number
    calificacion_sumativa: number
    respuestas_diagnostica: Record<string, string>
    auditoria_etica: boolean[]
    compromisos_72h: Record<string, boolean>
    updated_at: string
}

// ─── SP4: Knowledge gap analytics per student ────────────────────────────────
export interface AlumnoAnalytics {
    gaps: string[]
    strengths: string[]
    priorityTopics: string[]
    summary: string
    updatedAt: string
}

// ─── SP6: Smart notifications ────────────────────────────────────────────────
export interface Notificacion {
    id: string
    destinatario_id: string
    tipo: string
    titulo: string
    cuerpo: string
    leida: boolean
    created_at: string
}
