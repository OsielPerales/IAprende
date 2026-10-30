> **Archivo de referencia histórico (abril de 2026).** Su contenido y pasos de consola no necesariamente reflejan el código actual. No ejecutes instrucciones de permisos, promoción de roles ni despliegue sin validarlas con `docs/SEGURIDAD.md` y el entorno vigente. Se retiraron valores de configuración sensibles de esta copia.

# AUDITORÍA Y PUESTA EN MARCHA — iAprende
**Proyecto:** `iaprende-1415d` · `iaprende-1415d.web.app`  
**Stack:** React 18 + TypeScript + Vite + Firebase (Auth + Firestore) + Tailwind  
**Objetivo:** Dejar la plataforma 100% funcional para impartir el curso el 16 de abril.  
**Ejecutar en:** Claude Code / Antigravity — desde la raíz del proyecto iAprende

---

## FASE 0 — PREPARACIÓN DEL ENTORNO
> Antes de tocar código, verificar que el entorno local está alineado con producción.

```bash
# 1. Verificar versiones
node -v          # debe ser >= 18
npm -v
npx firebase --version   # debe ser >= 13

# 2. Instalar dependencias
npm install

# 3. Verificar que existe el .env.local con las variables correctas
cat .env.local
# Debe contener todas las VITE_FIREBASE_* variables
# Si no existe, crear con los valores del proyecto iaprende-1415d
```

**Variables requeridas en `.env.local`:**
```
VITE_FIREBASE_API_KEY=[REDACTED: configure Firebase in a local environment]
VITE_FIREBASE_AUTH_DOMAIN=iaprende-1415d.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=iaprende-1415d
VITE_FIREBASE_STORAGE_BUCKET=iaprende-1415d.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=748219195080
VITE_FIREBASE_APP_ID=1:748219195080:web:0a9eb099cd5c46aa014ffd
VITE_AI_PROXY_URL=https://REGION-iaprende-1415d.cloudfunctions.net/aiProxy
VITE_AI_MODEL=gpt-4o-mini
VITE_MAIN_APP_URL=https://desarrolloselaborados.com
```

```bash
# 4. Levantar en local para verificar que compila
npm run dev
# Abrir http://localhost:5173 y verificar que la pantalla de login carga
```

---

## FASE 1 — AUDITORÍA DE AUTENTICACIÓN
> Verificar que Auth funciona y que existe al menos un usuario admin.

### 1.1 Revisar la consola de Firebase Auth
```
URL: https://console.firebase.google.com/project/iaprende-1415d/authentication/users
```
**Verificar:**
- [ ] ¿Existe al menos un usuario (tu cuenta admin)?
- [ ] ¿El usuario tiene email verificado?
- [ ] Si no existe ningún usuario → registrar desde `http://localhost:5173/registro`

### 1.2 Verificar que el registro crea el documento en Firestore
Al registrarse, el sistema debe crear un documento en `usuarios/{uid}` con estructura:
```json
{
  "id": "uid-del-usuario",
  "email": "osiel@...",
  "nombre": "Osiel",
  "apellido": "Perales",
  "rol": "alumno",
  "created_at": "2026-..."
}
```
**Problema frecuente:** Si Auth funciona pero Firestore no recibe el documento, el usuario queda sin rol y la app redirige en loop.

**Verificar en:** `https://console.firebase.google.com/project/iaprende-1415d/firestore/data/usuarios`

### 1.3 Promover usuario a admin
Si el usuario está en Firestore con `rol: "alumno"`, cambiar manualmente a `"admin"`:
```
Firebase Console → Firestore → usuarios → {tu_uid} → Editar campo rol → "admin"
```
O ejecutar desde la consola del navegador (si estás logueado):
```js
// Pegar en la consola del navegador en localhost:5173
const uid = firebase.auth().currentUser.uid
firebase.firestore().collection('usuarios').doc(uid).update({ rol: 'admin' })
```

---

## FASE 2 — AUDITORÍA DE FIRESTORE
> Verificar reglas de seguridad y estructura de colecciones.

### 2.1 Revisar reglas de Firestore
```
URL: https://console.firebase.google.com/project/iaprende-1415d/firestore/rules
```

**Reglas mínimas requeridas** (si están en modo bloqueado o vacías, reemplazar):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuarios autenticados pueden leer su propio documento
    match /usuarios/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'admin';
    }

    // Cursos y bloques: lectura autenticada, escritura solo admin/maestro
    match /cursos/{cursoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['admin', 'maestro'];
    }

    match /bloques/{bloqueId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['admin', 'maestro'];
    }

    // Grupos: lectura autenticada, escritura admin/maestro
    match /grupos/{grupoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['admin', 'maestro'];
    }

    match /grupo_alumnos/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['admin', 'maestro'];
    }

    // Respuestas: el alumno escribe las suyas, maestro/admin leen todas
    match /respuestas/{respId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['admin', 'maestro'];
    }
  }
}
```

### 2.2 Verificar colecciones existentes
Ir a Firestore Console y confirmar que existen (o están vacías):
- [ ] `usuarios` 
- [ ] `cursos`
- [ ] `bloques`
- [ ] `grupos`
- [ ] `grupo_alumnos`
- [ ] `respuestas`

---

## FASE 3 — AUDITORÍA DEL BUILD DE PRODUCCIÓN
> El deploy puede fallar silenciosamente si el build tiene errores de TypeScript o Vite.

```bash
# 1. Build limpio
npm run build
# Si hay errores de TypeScript: leer el output y corregir
# Errores comunes: imports sin usar, tipos faltantes, env vars no definidas

# 2. Preview local del build de producción
npm run preview
# Abrir http://localhost:4173 y probar el flujo completo:
# → Login → Dashboard → Ver cursos → (si hay curso) entrar al viewer
```

**Checklist visual del preview:**
- [ ] Login carga sin pantalla en blanco
- [ ] Registro funciona y redirige
- [ ] Dashboard del rol correcto aparece
- [ ] No hay errores en consola del navegador (F12)

---

## FASE 4 — CARGAR EL CURSO EN FIRESTORE
> Ejecutar el seed del curso "IA Estratégica" (16 bloques).

**Opción A — Usar el archivo HTML (recomendado, sin código):**
1. Abrir `seed-iaprende.html` en Chrome
2. Login con la cuenta admin
3. Click "Cargar Curso IA Estratégica"
4. Verificar en Firestore Console que aparecen 1 curso y 16 bloques

**Opción B — Desde el código (si Opción A falla):**
```bash
# Crear script temporal de seed
cat > seed.mjs << 'EOF'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const config = {
  apiKey: "[REDACTED: configure Firebase in a local environment]",
  authDomain: "iaprende-1415d.firebaseapp.com",
  projectId: "iaprende-1415d",
}
const app = initializeApp(config)
const db = getFirestore(app)
const auth = getAuth(app)

// Importar seed data
import { cursoIA, bloquesIA } from './src/store/seedCursoIA.ts'

const EMAIL = process.argv[2]
const PASS  = process.argv[3]
if (!EMAIL || !PASS) { console.log('Uso: node seed.mjs email password'); process.exit(1) }

await signInWithEmailAndPassword(auth, EMAIL, PASS)
console.log('Autenticado ✓')

await setDoc(doc(db, 'cursos', cursoIA.id), cursoIA)
console.log('Curso escrito ✓')

for (let i = 0; i < bloquesIA.length; i += 10) {
  const batch = writeBatch(db)
  bloquesIA.slice(i, i+10).forEach(b => batch.set(doc(db, 'bloques', b.id), b))
  await batch.commit()
  console.log(`Bloques ${i+1}-${Math.min(i+10, bloquesIA.length)} ✓`)
}
console.log('¡Seed completo!')
process.exit(0)
EOF

node seed.mjs osiel.alejandro94@gmail.com TU_PASSWORD
```

---

## FASE 5 — CONFIGURAR LA SESIÓN DEL 16 DE ABRIL
> Crear grupo, agregar participantes y asignar curso. Todo desde la UI admin.

### 5.1 Crear el grupo
```
URL: iaprende-1415d.web.app/admin/grupos
→ "Crear grupo" → Nombre: "Sesión EC0301 — 16 Abr 2026"
→ Maestro: tu usuario (Osiel)
```

### 5.2 Registrar participantes
Enviar a cada participante el link:
```
https://iaprende-1415d.web.app/registro
```
Instrucciones para los participantes:
- Crear cuenta con su nombre real y correo
- Ya están listos — no necesitan hacer nada más antes del 16

### 5.3 Agregar participantes al grupo
```
URL: iaprende-1415d.web.app/admin/grupos
→ Seleccionar el grupo → "Agregar alumno" → buscar por email
→ Repetir para los 4 participantes
```

### 5.4 Asignar el curso al grupo
```
Mismo panel de grupos → "Asignar curso" → "IA Estratégica y Diseño de Instrucciones"
```

---

## FASE 6 — DEPLOY A PRODUCCIÓN
> Solo ejecutar cuando Fases 1–5 estén completas y verificadas en local/preview.

```bash
# 1. Login Firebase CLI
npx firebase login
# Seleccionar cuenta Google con acceso a iaprende-1415d

# 2. Verificar proyecto activo
npx firebase use iaprende-1415d
# Si el proyecto no aparece: npx firebase use --add → seleccionar iaprende-1415d

# 3. Build final
npm run build

# 4. Deploy solo del hosting (no tocar Functions si no se modificaron)
npx firebase deploy --only hosting

# Salida esperada:
# ✔  Deploy complete!
# Project Console: https://console.firebase.google.com/project/iaprende-1415d/overview
# Hosting URL: https://iaprende-1415d.web.app
```

### 6.1 Verificación post-deploy
```bash
# Abrir en Chrome (incógnito para simular usuario nuevo):
https://iaprende-1415d.web.app/login
```
- [ ] La página carga (no pantalla en blanco)
- [ ] Login con cuenta admin funciona
- [ ] Se ve el curso "IA Estratégica" en el dashboard
- [ ] Entrar al curso como alumno: todos los 16 bloques navegan
- [ ] Los cuestionarios registran respuestas
- [ ] Vista "Impartir Curso" muestra panel de resultados en vivo

---

## FASE 7 — PRUEBA DE HUMO COMPLETA (día antes del 16)
> Simular exactamente la sesión del examen. Hacerlo el 15 de abril.

```
DISPOSITIVOS:
□ Tu laptop/PC → iaprende-1415d.web.app/maestro/curso/{id}/impartir
□ Tu celular  → iaprende-1415d.web.app/registro (crear cuenta de prueba alumno)

FLUJO A PROBAR:
1. Alumno de prueba se registra en el celular
2. Tú lo agregas al grupo desde admin
3. En su celular: ve el curso, navega bloques, responde diagnóstica
4. En tu laptop: ves el resultado en vivo en el panel "Resultados"
5. Alumno llega al Bloque 11 (Formativa) y envía
6. Tú lo ves en tiempo real
7. Alumno completa Bloque 15 (Evaluación Final) y envía
8. Tú revisas calificación en /maestro/calificaciones

Si todo pasa → estás listo para el 16.
```

---

## PROBLEMAS FRECUENTES Y SOLUCIONES

| Síntoma | Causa probable | Solución |
|---|---|---|
| Pantalla en blanco en prod | Error de build silencioso | `npm run build` en local y ver errores |
| Login funciona pero redirige a `/` en loop | Usuario sin documento en `usuarios/` | Crear doc manualmente en Firestore Console |
| "Permission denied" en Firestore | Reglas bloquean escritura | Revisar y actualizar reglas (Fase 2.1) |
| Curso no aparece para el alumno | Curso no publicado o no asignado al grupo | `publicado: true` en el doc del curso + asignar al grupo |
| Respuestas no aparecen en vivo | `onSnapshot` no conecta | Verificar reglas de lectura en `respuestas/` |
| Deploy falla con "project not found" | Firebase CLI apunta al proyecto equivocado | `npx firebase use iaprende-1415d` |
| Variables de entorno undefined en prod | `.env.local` no se incluye en build | Crear `.env.production` con las mismas vars |

---

## RESUMEN DE PRIORIDADES

```
HOY (9 Apr)  → Fase 0 + Fase 1 (verificar auth + primer usuario admin)
HOY          → Enviar correo al evaluador (ya está el borrador en Gmail)
10 Apr       → Fase 2 + Fase 3 (reglas Firestore + build limpio)
10 Apr       → Fase 4 (cargar curso con seed-iaprende.html)
11 Apr       → Fase 5 (crear grupo + mandar link de registro a participantes)
12-14 Apr    → Fase 6 (deploy final)
15 Apr       → Fase 7 (prueba de humo completa)
16 Apr 17:00 → EVALUACIÓN OFICIAL
```

---

---

# FASE 8 — SUPERPODERES AI + SERVIDOR MCP

> Implementación de Cloud Functions con Claude AI y servidor MCP para iAprende.  
> Estas funciones son **opcionales** — la app sigue funcionando sin ellas.  
> Para activarlas se requiere una clave de API de Anthropic.

---

## 8.0 Arquitectura general

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Vite)                     │
│  VITE_AI_PROXY_URL → proxy OpenAI (funciones existentes) │
│  VITE_AI_CLAUDE_URL → Cloud Functions Claude (SP1-SP7)   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
        ┌──────────────┴──────────────┐
        │    Firebase Cloud Functions  │
        │  functions/src/index.ts      │
        │                              │
        │  aiProxy        (migrado)    │
        │  autoGradeRespuestaFn  (SP1) │
        │  generateCourseFromTopicFn   │ (SP2)
        │  queryClassDataFn      (SP3) │
        │  detectKnowledgeGapsFn (SP4) │
        │  getPersonalizedLearningPath │ (SP5)
        │  dailyDigestFn  (scheduler)  │ (SP6)
        │  translateBlockFn      (SP7) │
        │  mcpServer             (MCP) │
        └──────────────┬──────────────┘
                       │ firebase-admin
                       ▼
                   Firestore
        ┌──────────────────────────────┐
        │  usuarios / cursos / bloques │
        │  grupos / grupo_alumnos      │
        │  respuestas                  │
        │  alumno_analytics  (SP4 NEW) │
        │  notificaciones    (SP6 NEW) │
        └──────────────────────────────┘

  ┌──────────────────────────────────────────────────┐
  │  mcp-server/ (standalone para Claude Desktop)    │
  │  StdioServerTransport → 10 tools + 5 resources   │
  └──────────────────────────────────────────────────┘
```

---

## 8.1 Variables de entorno requeridas

### Frontend (`.env.local`)
```bash
# Añadir a las variables existentes de Firebase:

# URL base de las Cloud Functions ya desplegadas
# Formato: https://REGION-PROJECT_ID.cloudfunctions.net
VITE_AI_CLAUDE_URL=https://us-central1-iaprende-1415d.cloudfunctions.net

# El proxy existente puede seguir apuntando a OpenAI O migrar a Claude
# (el nuevo aiProxy ya traduce el formato)
VITE_AI_PROXY_URL=https://us-central1-iaprende-1415d.cloudfunctions.net/aiProxy
```

### Cloud Functions (Firebase Console → Functions → Environment variables)
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-haiku-4-5-20251001    # para funciones rápidas
# Para auto-grading y generación de cursos se usa claude-sonnet-4-6 hardcodeado
```

### Standalone MCP Server (variables de entorno del proceso)
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
# Opción A: Service account codificada en base64
[REDACTED FOR PUBLICATION: configure credentials locally or in Secret Manager]
# Opción B: Ruta al archivo (ADC)
GOOGLE_APPLICATION_CREDENTIALS=/ruta/al/service-account.json
```

---

## 8.2 Setup de Cloud Functions

```bash
# 1. Instalar dependencias del workspace de Functions
cd functions
npm install

# 2. Compilar TypeScript → JavaScript
npm run build
# Genera: functions/lib/index.js + todos los módulos

# 3. Verificar que compila sin errores
# Si hay errores de tipos, revisar functions/src/ y corregir imports

# 4. Volver a la raíz
cd ..
```

**Estructura generada tras el build:**
```
functions/
├── lib/               ← JavaScript compilado (no editar)
├── src/
│   ├── index.ts       ← punto de entrada — exporta todas las functions
│   ├── firebaseAdmin.ts
│   ├── proxy/
│   │   └── aiProxy.ts         ← Proxy migrado a Claude API
│   ├── ai/
│   │   ├── autoGrade.ts       ← SP1: calificación automática
│   │   ├── courseGenerator.ts ← SP2: generación de cursos NL
│   │   ├── analyticsQuery.ts  ← SP3: consultas en lenguaje natural
│   │   ├── knowledgeGaps.ts   ← SP4: detección de brechas
│   │   ├── learningPath.ts    ← SP5: ruta adaptativa con Claude
│   │   └── contentTranslation.ts ← SP7: traducción/simplificación
│   ├── scheduled/
│   │   └── dailyDigest.ts     ← SP6: digest diario (Cloud Scheduler)
│   └── mcp/
│       ├── server.ts          ← MCP Server (tools + resources)
│       ├── tools/
│       │   ├── dataReadTools.ts
│       │   ├── aiTools.ts
│       │   └── writeTools.ts
│       ├── resources/
│       │   └── platformResources.ts
│       └── mcpHttpFunction.ts ← Wrapper HTTP para Firebase
└── package.json
```

---

## 8.3 Deploy de Cloud Functions

```bash
# Desde la raíz del proyecto:

# Solo funciones (más rápido)
npx firebase deploy --only functions

# Functions + Hosting juntos
npx firebase deploy --only functions,hosting

# Salida esperada (8 functions):
# ✔  functions[aiProxy]
# ✔  functions[autoGradeRespuestaFn]
# ✔  functions[generateCourseFromTopicFn]
# ✔  functions[queryClassDataFn]
# ✔  functions[detectKnowledgeGapsFn]
# ✔  functions[getPersonalizedLearningPathFn]
# ✔  functions[translateBlockFn]
# ✔  functions[dailyDigestFn]
# ✔  functions[mcpServer]
```

> **Nota:** El deploy de Functions puede tardar 3-5 minutos la primera vez.

---

## 8.4 Nuevas colecciones de Firestore

Tras el deploy se crean automáticamente cuando las Functions las usan por primera vez.  
Las reglas de seguridad ya están actualizadas en `firestore.rules`.

```bash
# Desplegar las reglas actualizadas:
npx firebase deploy --only firestore:rules
```

### `alumno_analytics/{alumnoId}` — SP4
```json
{
  "gaps": ["Nombre de los temas débiles del alumno"],
  "strengths": ["Áreas donde tiene buen desempeño"],
  "priorityTopics": ["Temas prioritarios a estudiar esta semana"],
  "summary": "Resumen motivador personalizado en español",
  "updatedAt": "2026-04-14T13:00:00.000Z"
}
```
- **Quién escribe:** solo Cloud Functions (Admin SDK)
- **Quién lee:** el propio alumno + maestros/admins
- **Se actualiza:** cuando el alumno envía una evaluación y cuando usa el botón "Actualizar análisis"

### `notificaciones/{notifId}` — SP6
```json
{
  "destinatario_id": "uid-del-maestro",
  "tipo": "digest_diario",
  "titulo": "🌅 Tu resumen de hoy",
  "cuerpo": "Buenos días Carlos, tienes 3 evaluaciones pendientes...",
  "leida": false,
  "created_at": "2026-04-14T13:00:00.000Z"
}
```
- **Quién escribe:** solo `dailyDigestFn` (Cloud Scheduler)
- **Quién lee:** solo el destinatario
- **Quién actualiza:** el propio destinatario (solo campo `leida`)

---

## 8.5 Los 7 Superpoderes AI

### SP1 — Auto-Calificación de Respuestas Abiertas
**Problema resuelto:** Las preguntas abiertas quedaban en "Pendiente" indefinidamente.

**Dónde se ve:** `Calificaciones` → expandir quiz → fila de alumno con respuesta pendiente.

**Flujo:**
1. El maestro ve el botón **"IA"** (azul, con icono BrainCircuit) junto a la nota `—`
2. Clic → Claude analiza la respuesta con el contexto de la pregunta
3. Se pre-llena el campo de nota con la sugerencia + badge de confianza (Alta/Media/Baja)
4. El maestro hace clic en **Save** para confirmar (siempre requiere confirmación humana)

**Function:** `autoGradeRespuestaFn` → `POST { respuestaId, rubric? }`  
**Modelo:** `claude-sonnet-4-6`  
**Archivo:** [functions/src/ai/autoGrade.ts](functions/src/ai/autoGrade.ts)

---

### SP2 — Generación de Cursos desde Lenguaje Natural
**Problema resuelto:** Crear un curso requería agregar bloques manualmente uno a uno.

**Dónde se ve:** `Mis Cursos` → botón **"Generar con IA"** (junto a "Nuevo Curso").

**Flujo:**
1. El maestro escribe el tema del curso y el contexto industrial
2. Selecciona el número de módulos (3-6)
3. Claude genera: título, descripción, N-1 bloques de texto HTML + 1 quiz final
4. El curso se guarda en Firestore como borrador (`publicado: false`)
5. La app navega automáticamente al editor para revisar y editar antes de publicar

**Function:** `generateCourseFromTopicFn` → `POST { topic, industryContext, maestroId, numBloques? }`  
**Modelo:** `claude-sonnet-4-6`  
**Archivo:** [functions/src/ai/courseGenerator.ts](functions/src/ai/courseGenerator.ts)

---

### SP3 — Analytics Chat: Consultas NL sobre la Clase
**Problema resuelto:** Los maestros no tenían forma de hacer preguntas agregadas sobre su clase.

**Dónde se ve:** `Panel Docente (Dashboard del maestro)` → card colapsable **"Consulta tus datos con IA"**.

**Ejemplos de consultas:**
- "¿Quién tiene el promedio más bajo?"
- "¿Cuántas evaluaciones están pendientes de calificar?"
- "¿Qué alumno ha entregado más evaluaciones?"
- "¿Cuál es el promedio general de mis grupos?"

**Function:** `queryClassDataFn` → `POST { query, maestroId }`  
**Modelo:** `claude-haiku-4-5-20251001`  
**Archivo:** [functions/src/ai/analyticsQuery.ts](functions/src/ai/analyticsQuery.ts)

---

### SP4 — Detección de Brechas de Conocimiento
**Problema resuelto:** Los alumnos veían su nota pero no sabían qué conceptos debían reforzar.

**Dónde se ve:** `Mi Dashboard (alumno)` → card **"Tu análisis de aprendizaje"**.

**Muestra:**
- Lista de áreas de mejora (temas con más errores)
- Lista de fortalezas
- Temas prioritarios a estudiar esta semana
- Resumen motivador personalizado

**Cuándo se actualiza:** Con el botón de refresh en la tarjeta. También puede configurarse para ejecutarse automáticamente tras cada envío de quiz (llamando a `detectKnowledgeGapsFn`).

**Function:** `detectKnowledgeGapsFn` → `POST { alumnoId }`  
**Modelo:** `claude-haiku-4-5-20251001`  
**Archivo:** [functions/src/ai/knowledgeGaps.ts](functions/src/ai/knowledgeGaps.ts)

---

### SP5 — Ruta de Aprendizaje Adaptativa Real (Claude)
**Problema resuelto:** `getAdaptiveRecommendation` era lógica determinista local (score ≥ 90 → "excelente", etc.).

**Dónde se ve:** Al terminar un quiz → componente `AdaptiveResult` (pantalla de resultados).

**Sin cambio de UI.** La misma interfaz ahora recibe recomendaciones genuinas basadas en:
- El historial completo de evaluaciones del alumno
- El patrón de desempeño (no solo la nota más reciente)
- La estructura del curso (cuántos módulos quedan)

**Degradación grácil:** Si `VITE_AI_CLAUDE_URL` no está configurado O si la Function falla, se usa el fallback determinista original automáticamente.

**Function:** `getPersonalizedLearningPathFn` → `POST { alumnoId, cursoId, recentScore, courseTitle, quizTitle }`  
**Modelo:** `claude-haiku-4-5-20251001`  
**Archivo:** [functions/src/ai/learningPath.ts](functions/src/ai/learningPath.ts)

---

### SP6 — Notificaciones Inteligentes para Maestros
**Problema resuelto:** Los maestros debían entrar a la app para saber qué calificar.

**Dónde se ve:** Icono de campana 🔔 en la barra de navegación superior (solo visible para maestros y admins).

**El digest incluye:**
- Número de evaluaciones pendientes de calificar
- Nuevas entregas en las últimas 24 horas
- Resumen motivador personalizado por Claude

**Cuándo se genera:** Cloud Scheduler — todos los días a las **7:00 AM hora de México** (`America/Mexico_City`).

**Para activar manualmente en desarrollo:**
```bash
# Invocar la function directamente desde Firebase CLI:
npx firebase functions:shell
# En el shell:
dailyDigestFn({})
```

**Function:** `dailyDigestFn` (onSchedule: `0 13 * * *` UTC)  
**Modelo:** `claude-haiku-4-5-20251001`  
**Archivo:** [functions/src/scheduled/dailyDigest.ts](functions/src/scheduled/dailyDigest.ts)

---

### SP7 — Traducción y Simplificación de Contenido
**Problema resuelto:** Contenido con niveles de complejidad diferentes para trabajadores con distintas trayectorias educativas.

**Backend listo.** El toggle de UI en `CursoViewer` puede activarse llamando al endpoint.

**Niveles de simplificación:**
- `same` — Solo traducir, mantener complejidad
- `simpler` — Lenguaje de preparatoria, términos técnicos con explicación breve
- `basic` — Máxima simplificación, pasos muy cortos, vocabulario cotidiano

**Function:** `translateBlockFn` → `POST { bloqueId, targetLanguage?, simplifyLevel? }`  
**Modelo:** `claude-haiku-4-5-20251001`  
**Archivo:** [functions/src/ai/contentTranslation.ts](functions/src/ai/contentTranslation.ts)

---

## 8.6 Servidor MCP

El servidor MCP expone los datos y capacidades de iAprende como herramientas para Claude Desktop u otros agentes de IA.

### Modo 1: HTTP (Firebase Function — producción)

La function `mcpServer` ya está desplegada junto con las demás.  
URL: `https://us-central1-iaprende-1415d.cloudfunctions.net/mcpServer`

Configurar en Claude Desktop (`~/.config/claude/claude_desktop_config.json` en Mac/Linux, o `%APPDATA%\Claude\claude_desktop_config.json` en Windows):

```json
{
  "mcpServers": {
    "iaprende": {
      "url": "https://us-central1-iaprende-1415d.cloudfunctions.net/mcpServer"
    }
  }
}
```

### Modo 2: Stdio (standalone — desarrollo local)

```bash
# 1. Instalar dependencias
cd mcp-server
npm install

# 2. Compilar
npm run build

# 3. Configurar variables de entorno y ejecutar
ANTHROPIC_API_KEY=sk-ant-... \
[REDACTED FOR PUBLICATION: configure credentials locally or in Secret Manager]
node lib/index.js
```

Configurar en Claude Desktop:
```json
{
  "mcpServers": {
    "iaprende-local": {
      "command": "node",
      "args": ["C:/ruta/al/proyecto/mcp-server/lib/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-...",
        "FIREBASE_SERVICE_ACCOUNT_JSON": "<base64>"
      }
    }
  }
}
```

### Herramientas disponibles (10 tools)

| Herramienta | Tipo | Descripción |
|-------------|------|-------------|
| `get_platform_stats` | Lectura | Estadísticas globales: usuarios, cursos, grupos, respuestas |
| `get_group_roster` | Lectura | Alumnos de un grupo con promedios |
| `get_student_performance` | Lectura | Perfil completo de un alumno |
| `get_course_analytics` | Lectura | Distribución de puntuaciones por quiz |
| `list_pending_grades` | Lectura | Todas las respuestas sin calificar |
| `get_course_structure` | Lectura | Bloques de un curso en orden |
| `auto_grade_open_answer` | IA | Califica respuesta abierta con Claude |
| `generate_course_from_topic` | IA | Genera curso completo desde descripción |
| `generate_knowledge_gap_report` | IA | Detecta brechas de conocimiento de un alumno |
| `answer_instructor_query` | IA | Responde preguntas NL sobre datos de la clase |
| `submit_grade` | Escritura | Escribe calificación en Firestore |
| `create_course` | Escritura | Crea curso borrador |
| `add_bloque_to_course` | Escritura | Agrega bloque a un curso |
| `enroll_student` | Escritura | Inscribe alumno a un grupo |

### Recursos disponibles (5 resources)

| URI | Descripción |
|-----|-------------|
| `iaprende://platform/stats` | Estadísticas globales en tiempo real |
| `iaprende://respuestas/pending` | Todas las evaluaciones sin calificar |
| `iaprende://curso/{curso_id}` | Detalle completo de un curso |
| `iaprende://grupo/{grupo_id}/performance` | Desempeño de un grupo |
| `iaprende://alumno/{alumno_id}/profile` | Perfil y analytics de un alumno |

### Verificar el MCP con el inspector

```bash
# Instalar el inspector de MCP (si no lo tienes)
npm install -g @modelcontextprotocol/inspector

# Probar el servidor standalone
ANTHROPIC_API_KEY=sk-ant-... \
FIREBASE_SERVICE_ACCOUNT_JSON=<base64> \
npx @modelcontextprotocol/inspector node mcp-server/lib/index.js
# Abre http://localhost:5173 con interfaz para llamar tools manualmente
```

---

## 8.7 Migración del Proxy AI (OpenAI → Claude)

El proxy existente (`aiProxy`) ha sido migrado a Claude API manteniendo compatibilidad con el formato de request/response de OpenAI.

**Cómo funciona la migración:**
- El frontend envía requests en formato OpenAI (sin cambios)
- El proxy los traduce internamente al formato Claude
- La respuesta se devuelve en formato OpenAI (sin cambios en el frontend)

**Resultado:** Las 4 funciones AI existentes (`askTutor`, `generateQuiz`, `generateTLDR`, `generateSimulator`) funcionan con Claude sin modificar el código del frontend.

**Variable de control:** `ANTHROPIC_MODEL` en Cloud Functions (default: `claude-haiku-4-5-20251001`).

---

## 8.8 Checklist de activación

```
□ npm install && cd functions && npm install && npm run build
□ cd ../mcp-server && npm install && npm run build && cd ..
□ npx firebase deploy --only functions
□ npx firebase deploy --only firestore:rules
□ Configurar ANTHROPIC_API_KEY en Firebase Console → Functions → Environment variables
□ Agregar VITE_AI_CLAUDE_URL a .env.local
□ npm run build (del frontend)
□ npx firebase deploy --only hosting
□ Verificar en prod: Maestro → Calificaciones → botón "IA" visible en respuestas abiertas
□ Verificar en prod: Maestro → Mis Cursos → botón "Generar con IA" visible
□ Verificar en prod: Maestro → Dashboard → panel "Consulta tus datos con IA" visible
□ Verificar en prod: Alumno → Dashboard → card "Tu análisis de aprendizaje" visible
□ Verificar en prod: Navbar maestro → ícono campana 🔔 visible
□ (Opcional) Configurar Claude Desktop con mcp-server → probar get_platform_stats
```

---

## 8.9 Costos estimados de API Anthropic

| Feature | Modelo | Tokens aprox. | Costo aprox. |
|---------|--------|---------------|--------------|
| Auto-calificación | claude-sonnet-4-6 | ~800 input + 200 output | ~$0.005 / respuesta |
| Generación de curso | claude-sonnet-4-6 | ~500 input + 2000 output | ~$0.02 / curso |
| Analytics Chat | claude-haiku-4-5 | ~2000 input + 200 output | ~$0.001 / consulta |
| Brechas de conocimiento | claude-haiku-4-5 | ~1000 input + 300 output | ~$0.001 / análisis |
| Ruta adaptativa | claude-haiku-4-5 | ~500 input + 150 output | ~$0.0005 / quiz |
| Digest diario | claude-haiku-4-5 | ~300 input + 100 output | ~$0.0002 / maestro/día |

> Para un uso típico de 20 alumnos + 2 maestros: **< $1 USD/mes**.
