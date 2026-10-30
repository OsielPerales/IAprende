# iAprende — Hoja de Producto & Documento Técnico Interno
**Versión:** 1.0 · **Revisión de código:** 2026-10-30 · **Clasificación:** Interno

---

> Estado verificado en código y pruebas locales; no acredita despliegue ni servicio productivo. Consulta [el contraste y límites actuales](docs/ESTADO_ACTUAL_2026-10-30.md).

## 1. RESUMEN EJECUTIVO

**iAprende** es una plataforma de capacitación industrial interactiva diseñada bajo la filosofía **Humanista UI** — centrada en la experiencia humana, accesible y expresiva. Combina un sistema de gestión de aprendizaje (LMS) moderno con **7 Superpotencias de IA** integradas a través de Claude AI, habilitando a instructores, alumnos y administradores a crear, impartir y evaluar capacitaciones de forma autónoma, adaptativa e inteligente.

| Atributo | Valor |
|---|---|
| **Nombre del producto** | iAprende |
| **Firebase Project ID** | `iaprende-1415d` |
| **URL de Producción** | `iaprende-1415d.web.app` |
| **Audiencia primaria** | Empresas industriales, instructores corporativos, equipos de RH |
| **Modelo de usuario** | Alumno / Maestro / Administrador |
| **Idioma principal** | Español (soporte multilenguaje vía SP7) |

---

## 2. PROPUESTA DE VALOR

### Problema que Resuelve
Las empresas industriales necesitan capacitar equipos operativos con herramientas que no requieran conocimiento tecnológico avanzado del instructor, que se adapten al ritmo de cada trabajador y que generen evidencia trazable de aprendizaje.

### Solución
iAprende permite que un instructor con conocimiento del tema (no de tecnología) diseñe y publique un curso interactivo en minutos usando IA, lo imparta en vivo, evalúe automáticamente y reciba análisis profundos del desempeño de su grupo — todo desde un navegador web.

### Diferenciadores Clave
- **IA Generativa integrada nativa** — no es un add-on externo, está en el núcleo de la plataforma
- **16 tipos de bloques de contenido interactivos** — desde texto hasta simuladores HTML en vivo
- **Filosofía Humanista UI** — diseño cálido, tipografía serif, paleta artesanal, sin frialdad corporativa
- **MCP Server para Claude Desktop** — extiende las capacidades directamente al asistente IA del instructor
- **Arquitectura serverless** — escala automáticamente, sin infra que mantener
- **Modo Demo** — funciona sin IA para demos y onboarding sin costo

---

## 3. MAPA DE CAPACIDADES

```
iAprende
│
├── AUTENTICACIÓN Y ROLES
│   ├── Login email/contraseña
│   ├── Login con Google OAuth
│   ├── 3 roles: Alumno · Maestro · Admin
│   └── Auto-asignación de rol admin por email
│
├── GESTIÓN DE CONTENIDO (Maestro)
│   ├── Crear cursos manualmente
│   ├── Generar cursos completos con IA (SP2)
│   ├── Editor visual de bloques (drag & drop)
│   ├── 16 tipos de bloques de contenido
│   ├── Generar cuestionarios con IA
│   ├── Generar simuladores HTML interactivos con IA
│   └── Publicar / despublicar cursos
│
├── IMPARTICIÓN Y VISUALIZACIÓN
│   ├── Modo Presentación en Vivo (ImpartirCurso)
│   ├── Visualización secuencial de bloques (Alumno)
│   ├── Navegación por bloques y páginas
│   ├── Progreso persistente por alumno y curso
│   └── Tutor IA flotante en cada bloque (SP1)
│
├── EVALUACIÓN Y CALIFICACIONES
│   ├── Cuestionarios (opción múltiple + respuesta abierta)
│   ├── Auto-calificación con IA (SP1)
│   ├── Calificación manual por maestro
│   ├── Gradebook por grupo
│   └── Historial de calificaciones para el alumno
│
├── ANALÍTICA INTELIGENTE
│   ├── Análisis de clase por lenguaje natural (SP3)
│   ├── Detección de brechas de conocimiento (SP4)
│   ├── Ruta de aprendizaje adaptativa (SP5)
│   └── Notificaciones y digest inteligente (SP6)
│
├── GESTIÓN ORGANIZACIONAL (Admin)
│   ├── Gestionar usuarios y roles
│   ├── Crear y administrar grupos
│   ├── Asignar cursos a grupos
│   ├── Aprobar/rechazar solicitudes de inscripción
│   └── Ver estadísticas globales
│
├── ACCESIBILIDAD Y ADAPTACIÓN
│   ├── Traducción y simplificación de contenido (SP7)
│   └── Diseño responsive (mobile-first)
│
└── EXTENSIBILIDAD (MCP)
    ├── Servidor MCP para Claude Desktop (stdio)
    ├── Servidor MCP via HTTP (Cloud Functions)
    └── 7 tools + 2 resources expuestos
```

---

## 4. FLUJOS DE USUARIO PRINCIPALES

### 4.1 Flujo del Alumno
```
Registro / Login
    → Solicitar acceso a grupo
    → Esperar aprobación del maestro
    → Ver cursos asignados al grupo
    → Navegar bloques secuencialmente
    → Responder cuestionarios
    → Consultar Tutor IA (chat flotante)
    → Recibir recomendación adaptativa (SP5)
    → Ver análisis de brechas (SP4)
    → Revisar calificaciones
    → Recibir notificaciones inteligentes (SP6)
```

### 4.2 Flujo del Maestro
```
Login
    → Ver dashboard con resumen de cursos y alumnos
    → Crear curso nuevo (manual o con IA → SP2)
    → Diseñar bloques de contenido
    → Publicar curso y asignar a grupos
    → Impartir en vivo (modo presentación)
    → Ver respuestas y calificar
    → Auto-calificar respuestas abiertas (SP1)
    → Hacer consultas NL sobre desempeño (SP3)
    → Revisar análisis de brechas (SP4)
    → Recibir digest diario (SP6)
```

### 4.3 Flujo del Admin
```
Login
    → Ver panel de control global
    → Gestionar usuarios (crear, editar roles)
    → Crear y gestionar grupos
    → Aprobar solicitudes de inscripción
    → Asignar cursos a grupos
    → Ver métricas globales de la plataforma
```

---

## 5. CATÁLOGO DE BLOQUES DE CONTENIDO (16 tipos)

| # | Tipo | Clave | Descripción | IA integrada |
|---|---|---|---|---|
| 1 | Texto enriquecido | `texto` | Contenido HTML con editor WYSIWYG | Tutor IA + TL;DR |
| 2 | Carrusel de imágenes | `carrusel` | Galería deslizable de imágenes | — |
| 3 | Cuestionario | `cuestionario` | Opción múltiple + respuesta abierta | Auto-calificación SP1 |
| 4 | Simulador HTML | `simulador` | HTML/CSS/JS embebido en iframe sandbox | Generación vía IA |
| 5 | Imagen con anotaciones | `imagen` | Imagen con callouts interactivos | — |
| 6 | Portada | `portada` | Página de inicio del curso | — |
| 7 | Comparador | `comparador` | Vista side-by-side de dos contenidos | — |
| 8 | Infografía | `infografia` | Infografía interactiva | — |
| 9 | Tarjetas de memorización | `tarjetas_flip` | Flip cards para estudio | — |
| 10 | Tabla interactiva | `tabla_editable` | Tabla editable en vivo | — |
| 11 | Checklist | `checklist` | Lista de verificación completable | — |
| 12 | Campo libre | `campo_libre` | Respuesta abierta guardada en progreso | — |
| 13 | Generador de prompts | `simulador_prompt` | Construye y evalúa prompts (0–5) | `evaluatePromptFn`, `executePromptFn` |
| 14 | Caso ético | `caso_etico` | Dilema ético colaborativo | — |
| 15 | Mapa conceptual | `mapa_ecosistema` | Mapa visual del ecosistema IA | — |
| 16 | Resumen personal | `resumen_personal` | Resumen auto-rellenable por alumno | — |

---

## 6. SUPERPOTENCIAS DE IA (SP1–SP7)

### SP1 — Auto-Calificación de Respuestas Abiertas
- **Qué hace:** Evalúa respuestas abiertas de alumnos usando Claude, entregando calificación (0-100), retroalimentación constructiva, nivel de confianza y justificación para el maestro.
- **Cuándo se activa:** Botón "Calificar con IA" en el Gradebook del maestro; también accesible vía MCP.
- **Modelo:** `claude-sonnet-4-6`
- **Endpoint:** `POST /autoGradeRespuestaFn`
- **Output:** `{ score, feedback, confidence: high|medium|low, reasoning }`

### SP2 — Generación de Cursos Completos
- **Qué hace:** A partir de un tema y contexto industrial, genera un curso completo con título, descripción, N bloques de texto HTML y cuestionario final, guardados directamente en Firestore.
- **Cuándo se activa:** Modal "Generar curso con IA" en el dashboard del maestro.
- **Modelo:** `claude-sonnet-4-6`
- **Endpoint:** `POST /generateCourseFromTopicFn`
- **Output:** `{ cursoId, titulo, bloquesCount }`

### SP3 — Análisis de Clase por Lenguaje Natural
- **Qué hace:** El maestro hace preguntas en lenguaje natural sobre su grupo ("¿Quién está bajo 70%?", "¿Cuáles temas son más difíciles?") y Claude responde con análisis basado en datos reales de Firestore.
- **Cuándo se activa:** Widget `AnalyticsChat` en el Gradebook.
- **Modelo:** `claude-haiku-4-5-20251001`
- **Endpoint:** `POST /queryClassDataFn`
- **Output:** Respuesta conversacional en texto

### SP4 — Detección de Brechas de Conocimiento
- **Qué hace:** Analiza el historial de respuestas y progreso de un alumno para identificar brechas (conceptos débiles), fortalezas, temas prioritarios y genera un resumen motivador personalizado.
- **Cuándo se activa:** Manualmente por el maestro; también visible en el dashboard del alumno.
- **Modelo:** `claude-haiku-4-5-20251001`
- **Endpoint:** `POST /detectKnowledgeGapsFn`
- **Output:** `{ gaps[], strengths[], priorityTopics[], summary }` → persiste en `alumno_analytics`

### SP5 — Ruta de Aprendizaje Adaptativa
- **Qué hace:** Después de completar un cuestionario, Claude genera una recomendación personalizada (nivel: excelente/bueno/reforzar/repasar) con mensaje motivador y acción concreta, considerando el historial completo del alumno.
- **Cuándo se activa:** Automáticamente al enviar un cuestionario.
- **Modelo:** `claude-haiku-4-5-20251001`
- **Endpoint:** `POST /getPersonalizedLearningPathFn`
- **Output:** `{ nivel, mensaje, accion, siguienteTema? }`

### SP6 — Notificaciones Inteligentes (Digest Diario)
- **Qué hace:** Cloud Scheduler ejecuta diariamente (7 AM hora México) una función que genera un resumen para maestros con entregas recientes y pendientes. Usa un identificador por instructor/día para evitar notificaciones duplicadas.
- **Cuándo se activa:** Automáticamente cada día via Cloud Scheduler.
- **Modelo:** `claude-haiku-4-5-20251001` con datos Firestore
- **Output:** Documentos en colección `notificaciones`, visibles en `NotificationsPanel`

### SP7 — Traducción y Simplificación de Contenido
- **Qué hace:** Traduce o simplifica el contenido de un bloque (HTML) al idioma o nivel de complejidad deseado, permitiendo personalizar la accesibilidad del material.
- **Cuándo se activa:** Acción de traducción/simplificación en el visor de texto. No hay tool MCP dedicada.
- **Modelo:** `claude-haiku-4-5-20251001`
- **Endpoint:** `POST /translateBlockFn`
- **Output:** `{ html, note }`

---

## 7. HERRAMIENTAS MCP IMPLEMENTADAS

iAprende expone un **Servidor MCP (Model Context Protocol)** que permite a Claude Desktop y otros clientes MCP operar directamente sobre la plataforma. Existen dos modos de servidor:

### 7.1 Servidor MCP Standalone (Claude Desktop · stdio)
**Ruta:** `mcp-server/src/index.ts`
**Transporte:** `stdio` (procesos locales, pipes)

**Configuración en `claude_desktop_config.json`:**
```json
{
  "mcpServers": {
    "iaprende": {
      "command": "node",
      "args": ["/ruta/absoluta/mcp-server/lib/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-...",
        "FIREBASE_SERVICE_ACCOUNT_JSON": "<base64-service-account>"
      }
    }
  }
}
```

#### Tools disponibles por stdio (7 tools)

| Tool | Nombre | Descripción | Parámetros clave |
|---|---|---|---|
| 1 | `get_platform_stats` | Estadísticas generales de la plataforma: total de usuarios, cursos, grupos y respuestas pendientes | — |
| 2 | `list_pending_grades` | Lista todas las respuestas abiertas sin calificar, con datos del alumno y bloque | `grupo_id?` |
| 3 | `get_group_roster` | Devuelve el roster completo de un grupo con nombre, email y desempeño promedio de cada alumno | `grupo_id` |
| 4 | `auto_grade_open_answer` | Califica automáticamente una respuesta abierta usando Claude Sonnet, devuelve score + feedback | `respuesta_id`, `rubric?` |
| 5 | `answer_instructor_query` | Responde en lenguaje natural preguntas del instructor sobre el desempeño de su clase | `query`, `maestro_id` |
| 6 | `generate_course_from_topic` | Genera y persiste en Firestore un curso completo a partir de un tema e instrucciones | `topic`, `industry_context`, `maestro_id`, `num_bloques?` |
| 7 | `submit_grade` | Registra una calificación en Firestore para una respuesta específica | `respuesta_id`, `calificacion`, `feedback?` |

#### Resources Disponibles (2 resources)

| Resource | URI | Descripción | Formato |
|---|---|---|---|
| 1 | `iaprende://platform/stats` | Estadísticas actuales de la plataforma (usuarios, cursos, grupos) | JSON |
| 2 | `iaprende://respuestas/pending` | Lista de respuestas pendientes de calificación | JSON |

### 7.2 Servidor MCP via HTTP (Cloud Functions)
**Ruta:** `functions/src/mcp/mcpHttpFunction.ts`
**Transporte:** Streamable HTTP stateless, respuesta JSON
**Endpoint:** `POST https://us-central1-iaprende-1415d.cloudfunctions.net/mcpServer`

Requiere ID token Firebase con perfil admin. El cliente debe enviar Authorization y renovar el token. No implementa OAuth de terceros. Expone **14 herramientas**, un catálogo distinto al stdio:

- Lectura: `get_platform_stats`, `get_group_roster`, `get_student_performance`, `get_course_analytics`, `list_pending_grades`, `get_course_structure`.
- IA: `auto_grade_open_answer`, `generate_knowledge_gap_report`, `answer_instructor_query`, `generate_course_from_topic`.
- Escritura: `submit_grade`, `create_course`, `add_bloque_to_course`, `enroll_student`.

Ambos transportes publican los dos recursos `iaprende://platform/stats` y `iaprende://respuestas/pending`.

---

## 8. ARQUITECTURA TÉCNICA

### 8.1 Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| **Frontend SPA** | React + TypeScript | 19+ / 5.9.3 |
| **Bundler** | Vite | 7.3.1 |
| **Enrutamiento** | React Router DOM | 7.13.0 |
| **Estilos** | Tailwind CSS | 4.2.0 |
| **Estado Global** | Zustand | 5.0.11 |
| **Iconografía** | Lucide React | 0.575.0 |
| **Backend** | Firebase Cloud Functions | Node.js 20 |
| **Base de Datos** | Firestore (NoSQL) | Firebase 12.10.0 |
| **Autenticación** | Firebase Auth | Firebase 12.10.0 |
| **Hosting** | Firebase Hosting | CDN global |
| **IA Principal** | Anthropic Claude API | SDK 0.52.0 |
| **MCP Protocol** | @modelcontextprotocol/sdk | 1.15.0 |
| **Scheduler** | Cloud Scheduler (GCP) | — |

### 8.2 Modelos de IA Utilizados

| Tarea | Modelo | Justificación |
|---|---|---|
| Auto-calificación (SP1) | `claude-sonnet-4-6` | Requiere razonamiento profundo y juicio evaluativo |
| Generación de cursos (SP2) | `claude-sonnet-4-6` | Creación de contenido extenso y estructurado |
| Análisis NL de clase (SP3) | `claude-haiku-4-5-20251001` | Consultas rápidas, baja latencia |
| Brechas de conocimiento (SP4) | `claude-haiku-4-5-20251001` | Análisis de datos tabulares, respuesta rápida |
| Ruta adaptativa (SP5) | `claude-haiku-4-5-20251001` | Generación de texto corto, post-quiz |
| Traducción/simplificación (SP7) | `claude-haiku-4-5-20251001` | Transformación de texto, eficiencia de costo |
| Proxy OpenAI-compatible | `claude-haiku-4-5-20251001` | Tutor IA y TL;DR en frontend |

### 8.3 Arquitectura de Datos (Firestore)

```
Firestore / iaprende-1415d
│
├── usuarios/{uid}          → Perfil de usuario (rol, email, nombre)
├── cursos/{cursoId}        → Metadatos del curso (título, maestro, estado)
├── bloques/{bloqueId}      → Unidades de contenido (tipo + contenido variable)
├── grupos/{grupoId}        → Agrupaciones de alumnos
├── grupo_alumnos/{id}      → Inscripción alumno-grupo
├── curso_grupos/{id}       → Asignación curso-grupo
├── respuestas/{id}         → Respuestas de alumnos a cuestionarios
├── progreso_alumno/{id}    → Progreso detallado por alumno/curso
├── alumno_analytics/{uid}  → Análisis de brechas (SP4) ← solo escribe Cloud Function
├── notificaciones/{id}     → Notificaciones inteligentes (SP6) ← solo escribe Cloud Function
├── solicitudes_inscripcion/{id} → Solicitudes de acceso a grupos
└── caso_etico_respuestas/  → Respuestas colaborativas a dilemas éticos
```

### 8.4 Patrones de Integración con Claude AI

**Patrón 1 — Tool Use Estructurado (SP1, SP2)**
```typescript
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  tools: [{ name: 'grading_result', input_schema: { ... } }],
  tool_choice: { type: 'any' },
  messages: [{ role: 'user', content: prompt }]
})
const toolUse = message.content.find(c => c.type === 'tool_use')
return toolUse.input as AutoGradeResult
```

**Patrón 2 — Chat Simple (SP3, SP4, SP5, SP7)**
```typescript
const message = await anthropic.messages.create({
  model: 'claude-haiku-4-5-20251001',
  messages: [{ role: 'user', content: query }]
})
return message.content[0]?.type === 'text' ? message.content[0].text : ''
```

**Patrón 3 — Proxy OpenAI-Compatible (Tutor IA / TL;DR)**
```typescript
// Frontend llama al proxy sin exponer API keys
fetch(VITE_AI_PROXY_URL, {
  body: JSON.stringify({ model: 'gpt-4o-mini', messages: [...] })
})
// Cloud Function traduce el formato y llama a Claude API
```

### 8.5 Seguridad

| Mecanismo | Implementación |
|---|---|
| **API Keys IA** | Nunca en frontend — solo en Cloud Functions |
| **Autenticación** | Firebase Auth (JWT verificado en cada request) |
| **Autorización Firestore** | Security Rules basadas en rol del usuario |
| **Escritura Analytics** | Solo accesible por Cloud Functions (no cliente) |
| **Simuladores HTML** | Ejecutan en `<iframe sandbox>` — sin acceso al DOM padre |
| **Roles** | Perfil protegido en Firestore; registro solo alumno; cambios de rol por admin |
| **MCP HTTP** | Solo admin con ID token Firebase y cuota; stdio usa IAM local |

---

## 9. VARIABLES DE ENTORNO

### Frontend (VITE_ prefix — incluidas en bundle)

| Variable | Descripción |
|---|---|
| `VITE_FIREBASE_API_KEY` | Clave pública de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de autenticación Firebase |
| `VITE_FIREBASE_PROJECT_ID` | ID del proyecto Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de almacenamiento |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID del remitente de mensajes |
| `VITE_FIREBASE_APP_ID` | ID de la app Firebase |
| `VITE_AI_PROXY_URL` | URL del proxy IA (vacío = Modo Demo) |
| `VITE_AI_MODEL` | Modelo para el proxy (default: gpt-4o-mini) |
| `VITE_AI_CLAUDE_URL` | Base URL de Cloud Functions Claude (SP1-SP7) |
| `VITE_MAIN_APP_URL` | URL del sitio principal |

### Backend (Cloud Functions / MCP Server — solo servidor)

| Variable | Descripción |
|---|---|
| `ANTHROPIC_API_KEY` | Clave secreta de la API de Anthropic |
| `ANTHROPIC_MODEL` | Modelo default (claude-haiku-4-5-20251001) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Service account en base64 (MCP Server) |

---

## 10. SISTEMA DE DISEÑO — HUMANISTA UI

### Filosofía
Diseño cálido y humano en contraposición a la frialdad corporativa tradicional. Inspirado en materiales artesanales, libros físicos y espacios de aprendizaje acogedores.

### Paleta de Colores (Tokens)

| Token | Hex | Uso |
|---|---|---|
| `cream` | `#F9F9F7` | Fondo principal |
| `graphite` | `#333333` | Texto oscuro |
| `orange` | `#E07A5F` | Primario, CTAs, acciones |
| `cobalt` | `#2A4B7C` | Secundario, headers, énfasis |
| `mint` | `#D4E5DF` | Acentos suaves, badges |
| `lavender` | `#E6E1F0` | Fondos de inputs, cards |

### Tipografía
| Rol | Fuente |
|---|---|
| Headings | Libre Baskerville (serif) |
| Body | Inter (sans-serif) |
| Código | JetBrains Mono (monospace) |

---

## 11. ESTRUCTURA DE ARCHIVOS

```
iaprende/
├── src/                          # Frontend React (TypeScript)
│   ├── pages/                    # Vistas principales por rol
│   │   ├── Auth.tsx              # Login y registro
│   │   ├── Dashboards.tsx        # Paneles (alumno/maestro/admin)
│   │   ├── CursoEditor.tsx       # Editor visual de cursos
│   │   ├── CursoViewer.tsx       # Visualización secuencial (alumno)
│   │   ├── ImpartirCurso.tsx     # Modo presentación en vivo
│   │   ├── GradebookMaestro.tsx  # Calificaciones y analytics
│   │   ├── GruposAdmin.tsx       # Gestión de grupos (admin)
│   │   ├── GruposAlumno.tsx      # Solicitudes de inscripción (alumno)
│   │   ├── GestionUsuarios.tsx   # Gestión de usuarios (admin)
│   │   └── CalificacionesAlumno.tsx
│   │
│   ├── components/               # Componentes reutilizables
│   │   ├── TutorWidget.tsx       # Chatbot IA flotante
│   │   ├── TLDRWidget.tsx        # Resumen IA de 3 puntos
│   │   ├── QuizGenerator.tsx     # Generador de cuestionarios
│   │   ├── SimulatorGenerator.tsx # Generador de simuladores HTML
│   │   ├── CourseGeneratorModal.tsx # Modal SP2
│   │   ├── AdaptiveResult.tsx    # Recomendación adaptativa SP5
│   │   ├── AIGradeButton.tsx     # Botón de auto-calificación SP1
│   │   ├── AnalyticsChat.tsx     # Chat NL SP3
│   │   ├── KnowledgeGapCard.tsx  # Card brechas SP4
│   │   ├── NotificationsPanel.tsx # Panel notificaciones SP6
│   │   ├── AppLayout.tsx         # Layout principal
│   │   ├── ImagenConCallouts.tsx # Editor de callouts
│   │   └── bloques/              # 16 componentes de bloques
│   │
│   ├── context/AuthContext.tsx   # Contexto de autenticación
│   ├── store/useStore.ts         # Estado global Zustand + listeners
│   ├── lib/
│   │   ├── firebase.ts           # Inicialización Firebase
│   │   └── ai.ts                 # Servicios IA cliente
│   ├── types/index.ts            # Interfaces TypeScript del dominio
│   ├── App.tsx                   # Router principal
│   └── main.tsx                  # Entry point
│
├── functions/                    # Cloud Functions (Node.js 20)
│   └── src/
│       ├── index.ts              # Exports de todas las functions
│       ├── firebaseAdmin.ts      # Inicialización Admin SDK
│       ├── ai/                   # Superpotencias SP1-SP5, SP7
│       │   ├── autoGrade.ts      # SP1
│       │   ├── courseGenerator.ts # SP2
│       │   ├── analyticsQuery.ts # SP3
│       │   ├── knowledgeGaps.ts  # SP4
│       │   ├── learningPath.ts   # SP5
│       │   └── contentTranslation.ts # SP7
│       ├── proxy/aiProxy.ts      # Proxy OpenAI-compatible → Claude
│       ├── mcp/                  # Servidor MCP HTTP
│       │   ├── server.ts         # Definición del servidor MCP
│       │   ├── mcpHttpFunction.ts # HTTP wrapper
│       │   ├── resources/platformResources.ts
│       │   └── tools/
│       │       ├── aiTools.ts
│       │       ├── dataReadTools.ts
│       │       └── writeTools.ts
│       └── scheduled/dailyDigest.ts # SP6 (Cloud Scheduler)
│
├── mcp-server/                   # Servidor MCP Standalone (Claude Desktop)
│   └── src/index.ts              # Servidor stdio completo
│
├── firebase.json                 # Config Firebase CLI
├── firestore.rules               # Reglas de seguridad Firestore
├── .firebaserc                   # Proyecto Firebase asignado
├── vite.config.ts                # Config Vite
├── tsconfig.json                 # Config TypeScript
├── package.json                  # Dependencias frontend
├── .env.example                  # Plantilla de variables de entorno
└── AUDITORIA_IAPRENDE.md         # Guía de verificación pre-producción
```

---

## 12. COMANDOS DE DESARROLLO Y DESPLIEGUE

```bash
# Desarrollo local
npm install
npm run dev              # http://localhost:5173

# Build producción
npm run build            # → dist/

# Cloud Functions
cd functions && npm install && npm run build

# Deploy completo
firebase deploy

# Deploy solo hosting
firebase deploy --only hosting

# Deploy solo funciones
firebase deploy --only functions

# MCP Server (compilar)
cd mcp-server && npm run build
```

---

## 13. ESTADO ACTUAL Y PRÓXIMOS PASOS

### Implementado en código (requiere validación productiva)
- [x] Autenticación completa (email + Google)
- [x] 3 roles con permisos diferenciados
- [x] 16 tipos de bloques de contenido
- [x] SP1: Auto-calificación
- [x] SP2: Generación de cursos
- [x] SP3: Análisis NL de clase
- [x] SP4: Detección de brechas
- [x] SP5: Ruta adaptativa
- [x] SP6: Digest y notificaciones diarias
- [x] SP7: Traducción y simplificación
- [x] Servidor MCP standalone (Claude Desktop)
- [x] Servidor MCP via HTTP (Cloud Functions)
- [x] Modo Demo (sin IA, respuestas mock)
- [x] Sistema de diseño Humanista UI

### Pendiente / Roadmap
- [ ] Validación de staging con Auth, secretos, IAM y proveedor IA reales
- [ ] Aislamiento por institución/instructor
- [ ] Pantalla `/admin/config`
- [ ] Notificaciones específicas de alumnos (el digest actual es para maestros)
- [ ] Notificaciones push (Firebase Cloud Messaging)
- [ ] Certificados de finalización
- [ ] Integración SSO empresarial (SAML/LDAP)
- [ ] API REST pública documentada
- [ ] Analytics avanzadas con dashboards gráficos
- [ ] Sistema de comentarios en bloques
- [ ] Versiones de curso (historial de cambios)
- [ ] Export de cursos (SCORM)

---

*Documento actualizado por contraste de código y pruebas locales — 2026-10-30*
*iAprende v1.0 · Diseño Humanista UI · Powered by Claude AI*
