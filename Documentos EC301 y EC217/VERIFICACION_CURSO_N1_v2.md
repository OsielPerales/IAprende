---
título: Verificación de Cumplimiento — Curso N1 v2.0
tipo: verificacion_curso
estado: referencia_maestra
version: 2.0
fecha: 2026-04-20
proyecto_firebase: iaprende-1415d
url_produccion: https://iaprende-1415d.web.app
estandar: EC0301
certificadora: B Smarter
evaluador: Iván Téllez López
slug_curso: c-ia-estrategica-v2
mnemónico: RO·CO·IN·RE·FO
bloques_total: 45
tags: [iaprende, verificacion, ec0301, curso-n1, bloques, firestore]
relacionado: [[IAPRENDE_INDEX]], [[IAPRENDE_PRODUCTO]], [[_skills/conocer/SKILL]]
---

# Verificación de Cumplimiento
## Curso: IA Estratégica y Diseño de Instrucciones Proactivas — v2.0

**Plataforma:** iAprende · `iaprende-1415d.web.app`
**Firebase Project:** `iaprende-1415d`
**Estándar:** EC0301 · Certificado por B Smarter · Evaluador: Iván Téllez López
**Autor:** Osiel Alejandro Perales Jiménez · Desarrollos Elaborados
**Estado:** ✅ Publicado · 45 bloques implementados

> **Uso de este documento:** Referencia maestra de estructura. Los `[ ]` son el estado canónico de plantilla para replicación. Al implementar un nuevo curso basado en este, duplicar y marcar `[x]` en la copia de trabajo — no aquí.

---

## Estructura del Curso

```
Duración:   135 min
Páginas:    5 (separadas por pag.inicio)
Módulos:    Preámbulo · Encuadre · Módulo I · Módulo II · Módulo III · Evaluación Final
Bloques:    45
Mnemónico: RO·CO·IN·RE·FO
```

**Esquema de evaluación EC0301:**

| Instrumento | Peso | Bloque |
|---|---|---|
| Diagnóstica | Referente (0%) | #7 |
| Formativa | 50% | #28 (6 criterios checklist) |
| Sumativa | 50% | #39 (proyecto) + #40 (4 preguntas) |
| Mínimo aprobatorio | 80% | — |

---

## Colecciones Firestore

```
cursos/
  └── c-ia-estrategica-v2/
        titulo: "IA Estratégica y Diseño de Instrucciones Proactivas"
        version: "2.0"
        duracion_min: 135
        activo: true

bloques/
  └── {bloque_id}/
        curso_id: "c-ia-estrategica-v2"
        orden: number (1–45)
        tipo: BloqueType
        titulo: string
        contenido: object
        duracion_min: number

progreso_alumno/
  └── {userId}_{cursoId}/
        bloques_completados: string[]
        acuerdos_trabajo: boolean[]           ← bloque #6
        respuestas_diagnostica: object        ← bloque #7
        bitacora: [{proceso, tiempo, repetitivo, candidato}]  ← bloque #16
        rol_construido: string                ← bloque #20
        contexto_construido: string           ← bloque #22
        prompt_maestro: string                ← bloque #27
        calificacion_formativa: number        ← bloque #28
        reflexiones_caso_etico: object        ← bloque #37
        prompt_evaluacion: string             ← bloque #39
        calificacion_sumativa: number         ← bloque #40
        auditoria_etica: boolean[]            ← bloque #41
        compromisos_72h: boolean[]            ← bloque #44
```

---

## Tipos de Bloque Utilizados (14)

```typescript
type BloqueType =
  | "portada"           // #1, #8, #17, #29, #38
  | "texto_rico"        // #3,4,9,12,19,21,23,30,33,35,45
  | "infografia"        // #2, #5, #18
  | "checklist"         // #6, #15, #28, #36, #41, #44
  | "cuestionario"      // #7, #40
  | "comparador"        // #10
  | "simulador_html"    // #11, #13, #24, #25, #31
  | "tarjetas_flip"     // #14, #26, #34
  | "tabla_editable"    // #16
  | "campo_libre"       // #20, #22
  | "simulador_prompt"  // #27, #39
  | "mapa_ecosistema"   // #32, #43
  | "caso_etico"        // #37
  | "resumen_personal"  // #42
```

---

## Bloques — Especificación Completa

### ▸ PREÁMBULO + ENCUADRE — Página 1 (#1–#7)

#### #1 — Portada de Bienvenida
```
TIPO: portada · ESTADO: [ ]
```
Título: `IA Estratégica y Diseño de Instrucciones Proactivas`
Subtítulo: `Curso-Taller · 135 min · Estándar EC0301`
Facilitador: Osiel Alejandro Perales Jiménez

---

#### #2 — La Nueva Economía Cognitiva
```
TIPO: infografia · ESTADO: [ ]
```
Título: `La Nueva Economía Cognitiva`
Subtítulo: *Tres fuerzas están redefiniendo el valor del trabajo humano.*

3 cards expandibles:
- 🌐 **Democratización del Conocimiento** (mint `#D4E5DF`)
- ⚙️ **Automatización de Flujos** (lavanda `#E6E1F0`) · Badge permanente: `→ ESTÁS AQUÍ`
- 🚀 **Amplificación Humana** (naranja suave `#E07A5F`)

Al cerrar las 3 cards → botón `"Comenzar el curso"`

---

#### #3 — Bienvenida al Curso
```
TIPO: texto_rico · ESTADO: [ ]
```
Tagline: *"Hablarle correctamente a la Inteligencia Artificial."*

Incluye: lista de 4 logros del taller + tabla de estructura de 135 min + tabla de esquema de evaluación EC0301.

---

#### #4 — Objetivo General
```
TIPO: texto_rico · ESTADO: [ ]
```
Objetivo Mager completo con verbos: **DISEÑARÁ · APLICARÁ · AUTOMATIZARÁ**
Explicación de cada verbo en nivel Bloom (3–4). Nota pedagógica EC0301 visible.

---

#### #5 — Mapa del Curso
```
TIPO: infografia · ESTADO: [ ]
```
3 fases expandibles:
- 🔭 Fase 1 — Encuadre y Fundamentos (0–45 min)
- 🏗️ Fase 2 — Estructura Maestra (45–95 min) · Badge `★ NÚCLEO`
- 🎯 Fase 3 — Ética y Evaluación (95–135 min)

---

#### #6 — Nuestros Acuerdos de Trabajo
```
TIPO: checklist · ALMACENAMIENTO: acuerdos_trabajo · ESTADO: [ ]
```
4 compromisos. Gate recomendado: el alumno debe marcar todos para continuar.
1. Silencio y sin distractores durante bloques de práctica
2. Comparto mis experiencias reales
3. Pregunto cuando no entiendo
4. Al terminar, aplico un prompt en las próximas 72 horas

---

#### #7 — Evaluación Diagnóstica
```
TIPO: cuestionario · PESO: 0% (referente) · ALMACENAMIENTO: respuestas_diagnostica · ESTADO: [ ]
```
5 preguntas abiertas de punto de partida. No impactan calificación.

---

### ▸ MÓDULO I — Fundamentos de la IA — Página 2 (#8–#16)

#### #8 — Portada Módulo I
```
TIPO: portada · ESTADO: [ ]
```
`1 · Módulo I · Fundamentos de la IA`
Subtítulo: *De buscadores a motores de razonamiento · Tokens · Arquitectura MoE · Tus procesos*

---

#### #9 — Lección 1.1: De Buscadores a Motores de Razonamiento
```
TIPO: texto_rico · ESTADO: [ ]
```
Tabla comparativa 5 filas: Buscador (Google) vs Motor de Razonamiento (ChatGPT/Claude).
Sección integrada: "¿Cómo funciona la IA? — Los Tokens" (predicción probabilística).
Implicación práctica: prompt rico = patrones correctos activados.

---

#### #10 — Actividad: Clasifica las Características
```
TIPO: comparador · ESTADO: [ ]
```
8 características drag & drop hacia 2 columnas: 🔍 Buscador Tradicional / 🤖 Motor de Razonamiento IA.
Sin calificación, formativa.

---

#### #11 — Simulador de Tokens
```
TIPO: simulador_html · ESTADO: [ ]
```
Input libre → tokenización visual en tiempo real.

---

#### #12 — Lección 1.2: La Arquitectura MoE
```
TIPO: texto_rico · ESTADO: [ ]
```
Diagrama conceptual sin ROL vs con ROL.
Dato clave: GPT-4 activa ~8 de 16 expertos por consulta.
Conexión directa con bloque #20 (construcción del ROL).

---

#### #13 — Simulador MoE
```
TIPO: simulador_html · ESTADO: [ ]
```
Campo de ROL → diagrama radial que ilumina nodos activados.

---

#### #14 — Los 3 Modos de Uso de la IA
```
TIPO: tarjetas_flip · ESTADO: [ ]
```
3 flip cards:
- Consulta puntual (pregunta directa, decisiones rápidas)
- Herramienta diseñada (prompt estructurado, procesos repetibles)
- Colaboración iterativa (multi-turno, proyectos complejos)

---

#### #15 — ¿Es automatizable con IA?
```
TIPO: checklist · ESTADO: [ ]
```
4 criterios de elegibilidad antes de la Bitácora:
1. Frecuencia ≥ 2 veces/semana
2. Output textual
3. Consume > 30 min/semana
4. Tengo acceso a los datos que necesita la IA

---

#### #16 — Bitácora de Procesos
```
TIPO: tabla_editable · ALMACENAMIENTO: bitacora[] · ESTADO: [ ]
```
4 columnas: Proceso / Tiempo por semana / ¿Se repite? / Candidato IA.
Alimenta pre-carga de bloques #20 y #22.

---

### ▸ MÓDULO II — La Estructura Maestra del Prompt — Página 3 (#17–#28)

#### #17 — Portada Módulo II
```
TIPO: portada · ESTADO: [ ]
```
`2 · Módulo II · La Estructura Maestra del Prompt`
Subtítulo: *RO · CO · IN · RE · FO — Cinco componentes para prompts que funcionan*

---

#### #18 — La Estructura Maestra: RO·CO·IN·RE·FO
```
TIPO: infografia · ESTADO: [ ]
```
5 componentes en 3 grupos visuales:
- 🎭 RO + CO (fundamentos)
- ⚡ IN (★ núcleo)
- 📐 RE + FO (output shapers)

---

#### #19 — RO — ROL
```
TIPO: texto_rico · ESTADO: [ ]
```
Anatomía: título profesional + especialización + años + contexto organizacional.
Ejemplo débil ❌ vs fuerte ✅ con caso contador RESICO.

---

#### #20 — Construye tu ROL
```
TIPO: campo_libre · ALMACENAMIENTO: rol_construido · ESTADO: [ ]
```
Placeholder: `"Actúa como un..."`
Tip de especificidad. Pre-carga automática en bloque #27.

---

#### #21 — CO — CONTEXTO
```
TIPO: texto_rico · ESTADO: [ ]
```
La ventana de contexto como "mesa de trabajo". ¿Qué incluir?
⚠️ Advertencia crítica PII: nunca nombres, correos, RFC, CURP, cuentas.
Menciona ventanas de 128K–2M tokens.

---

#### #22 — Construye tu CONTEXTO
```
TIPO: campo_libre · ALMACENAMIENTO: contexto_construido · ESTADO: [ ]
```
Placeholder estructurado: empresa ficticia + tipo de negocio + proceso.
Pre-carga automática en bloque #27.

---

#### #23 — IN · RE · FO
```
TIPO: texto_rico · ESTADO: [ ]
```
IN: lenguaje de ruego ❌ vs verbos imperativos ✅ (Genera / Redacta / Analiza / Sintetiza).
RE: 4 tipos — longitud / tono / exclusiones / idioma.
FO: 6 tipos con icono — lista / tabla / markdown / correo / JSON / texto libre.

---

#### #24 — Validador de Instrucción Proactiva
```
TIPO: simulador_html · ESTADO: [ ]
```
Detecta si la instrucción inicia con verbo imperativo fuerte.
Lista de verbos sugeridos clickeables para insertar.

---

#### #25 — Demo: Prompt Maestro Completo en Acción
```
TIPO: simulador_html · ESTADO: [ ]
```
Prompt industrial pre-cargado con RO·CO·IN·RE·FO visibles.
Botón "Ver resultado" muestra respuesta generada paso a paso.

---

#### #26 — Memoriza la Estructura RO·CO·IN·RE·FO
```
TIPO: tarjetas_flip · ESTADO: [ ]
```
5 flip cards — una por componente.
Reverso: guía de construcción rápida por componente.

---

#### #27 — Construye tu Prompt Maestro ★
```
TIPO: simulador_prompt · ALMACENAMIENTO: prompt_maestro · ESTADO: [ ]
```
**Componente estrella.** Pre-carga `rol_construido` (#20) y `contexto_construido` (#22) desde Firestore.
El alumno completa IN + RE + FO.
Botón "Probar con Claude" → Claude API tiempo real.
Botón "Guardar Prompt" → persiste en Firestore.

---

#### #28 — Autoevaluación Formativa (50%)
```
TIPO: checklist · PESO: 50% · ALMACENAMIENTO: calificacion_formativa · ESTADO: [ ]
```
6 criterios EC0301:
1. ROL con título + especialidad + contexto
2. CONTEXTO sin PII
3. INSTRUCCIÓN con verbo de acción fuerte
4. RESTRICCIONES con longitud + tono
5. FORMATO definido
6. Prompt coherente que resuelve el proceso de la Bitácora

---

### ▸ MÓDULO III — Sesgos, Alucinaciones y Ética — Página 4 (#29–#37)

#### #29 — Portada Módulo III
```
TIPO: portada · ESTADO: [ ]
```
`3 · Módulo III · Sesgos, Alucinaciones y Ética`
Subtítulo: *Usa la IA con criterio, responsabilidad y filtro humano*

---

#### #30 — Lección 3.1: ¿Qué es una Alucinación?
```
TIPO: texto_rico · ESTADO: [ ]
```
Mecanismo: predicción probabilística ≠ verdad.
Ejemplo real: precio nopal inventado.
Solución: **GROUNDING** — proporcionar datos en el CONTEXTO en lugar de pedir que los invente.

---

#### #31 — Detective de Alucinaciones
```
TIPO: simulador_html · ESTADO: [ ]
```
Por ronda: 3 afirmaciones, 1 es alucinación.
Botón "Revelar" con explicación técnica de por qué ese dato es inventable.

---

#### #32 — El Ecosistema de Herramientas IA
```
TIPO: mapa_ecosistema · ESTADO: [ ]
```
5 categorías con herramientas representativas:
- Conversación y Texto (ChatGPT, Claude, Gemini, Llama, Mistral)
- Imágenes y Diseño (Midjourney, GPT-Imagen, Adobe Firefly, Canva AI)
- Productividad (Copilot, Google Workspace AI, Notion AI)
- Audio y Video (ElevenLabs, Sora, Runway, HeyGen)
- Código y Datos (GitHub Copilot, Cursor, Replit AI)

---

#### #33 — Lección 3.2: Tipos de Sesgos
```
TIPO: texto_rico · ESTADO: [ ]
```
Tabla 3 sesgos: Confirmación / Alucinación Factual / Sesgo Implícito.
Cada uno con: descripción + prompt de mitigación.

---

#### #34 — Identifica los Sesgos en la Práctica
```
TIPO: tarjetas_flip · ESTADO: [ ]
```
Flip cards — frente: nombre + situación. Reverso: cómo corregir en el prompt.

---

#### #35 — Lección 3.3: El Filtro Humano
```
TIPO: texto_rico · ESTADO: [ ]
```
3 principios con icono:
- 🔍 VERIFICAR — datos, estadísticas, citas
- 🛡️ PROTEGER — PII de clientes y empleados
- 📢 TRANSPARAR — informar uso de IA en contextos profesionales

---

#### #36 — Mi Filtro Humano — 4 Compromisos Éticos
```
TIPO: checklist · ESTADO: [ ]
```
4 compromisos con icono. Sin gate.

---

#### #37 — Caso Ético Grupal
```
TIPO: caso_etico · ALMACENAMIENTO: reflexiones_caso_etico · ESTADO: [ ]
```
Narrativa: Directora de RRHH que usa IA para generar datos ficticios en informe al Consejo.
3 preguntas de discusión grupal (respuestas abiertas guardadas en Firestore).

---

### ▸ EVALUACIÓN FINAL — Página 5 (#38–#45)

#### #38 — Portada Evaluación Final
```
TIPO: portada · ESTADO: [ ]
```
`4 · Evaluación Final · Demuestra lo que Aprendiste`
Subtítulo: *El Desafío del Asistente · Validación de Conceptos · Auto-Auditoría Ética*

---

#### #39 — S.1 Desafío del Asistente
```
TIPO: simulador_prompt · ALMACENAMIENTO: prompt_evaluacion · ESTADO: [ ]
```
Prompt RO·CO·IN·RE·FO desde cero. **Sin pre-carga** de datos anteriores.
Mide competencia sin apoyo del historial.

---

#### #40 — Validación de Conceptos
```
TIPO: cuestionario · PESO: parte del 50% sumativo · ALMACENAMIENTO: calificacion_sumativa · ESTADO: [ ]
```
4 preguntas de opción múltiple · 25 pts cada una.

---

#### #41 — Auto-Auditoría Ética
```
TIPO: checklist · ALMACENAMIENTO: auditoria_etica · ESTADO: [ ]
```
5 compromisos (el #5 adicional vs #36: "Compartiré con al menos una persona de mi equipo esta semana").

---

#### #42 — Lo Que Te Llevas Hoy
```
TIPO: resumen_personal · ESTADO: [ ]
```
Dinámico — lee de Firestore:
- `bitacora[0].proceso`
- `rol_construido`
- `prompt_maestro` (preview 100 chars)
- `calificacion_formativa` + `calificacion_sumativa`
- `acuerdos_trabajo[3]` (compromiso 72h)

---

#### #43 — Tu Ruta de Continuidad en iAprende
```
TIPO: mapa_ecosistema · ESTADO: [ ]
```
- Nivel 1 — Este Curso ✓
- Nivel 2 — Automatización de Flujos + Agentes + RAG (próximamente)
- Comunidad iAprende — WhatsApp + biblioteca de prompts

---

#### #44 — Mis Compromisos de las Próximas 72 Horas
```
TIPO: checklist · ALMACENAMIENTO: compromisos_72h · ESTADO: [ ]
```
3 compromisos con seguimiento persistente:
1. Aplicar Prompt Maestro en al menos un proceso real
2. Mejorar el prompt basándome en resultados
3. Compartir el aprendizaje con un colega o familiar

---

#### #45 — ¡Felicidades!
```
TIPO: texto_rico · ESTADO: [ ]
```
🎓 Cierre con: logro construido + 5 puntos de aprendizaje + sugerencias de continuidad.
Firma: Osiel Alejandro Perales Jiménez · Plataforma iAprende · Estándar EC0301.

---

## Resumen de Estado — 45 Bloques

| # | Tipo | Título | Estado |
|---|---|---|---|
| 1 | portada | Bienvenida | [ ] |
| 2 | infografia | 3 Pilares Nueva Economía | [ ] |
| 3 | texto_rico | Bienvenida + Estructura + Evaluación | [ ] |
| 4 | texto_rico | Objetivo General | [ ] |
| 5 | infografia | Mapa del Curso | [ ] |
| 6 | checklist | Acuerdos de Trabajo | [ ] |
| 7 | cuestionario | Diagnóstica (0%) | [ ] |
| 8 | portada | Portada M-I | [ ] |
| 9 | texto_rico | Buscadores vs Motores + Tokens | [ ] |
| 10 | comparador | Clasifica las Características | [ ] |
| 11 | simulador_html | Simulador Tokens | [ ] |
| 12 | texto_rico | Arquitectura MoE | [ ] |
| 13 | simulador_html | Simulador MoE | [ ] |
| 14 | tarjetas_flip | 3 Modos de Uso | [ ] |
| 15 | checklist | ¿Es automatizable con IA? | [ ] |
| 16 | tabla_editable | Bitácora de Procesos | [ ] |
| 17 | portada | Portada M-II | [ ] |
| 18 | infografia | Estructura RO·CO·IN·RE·FO | [ ] |
| 19 | texto_rico | RO — ROL | [ ] |
| 20 | campo_libre | Construye tu ROL | [ ] |
| 21 | texto_rico | CO — CONTEXTO | [ ] |
| 22 | campo_libre | Construye tu CONTEXTO | [ ] |
| 23 | texto_rico | IN · RE · FO | [ ] |
| 24 | simulador_html | Validador de Instrucción | [ ] |
| 25 | simulador_html | Demo Prompt Maestro | [ ] |
| 26 | tarjetas_flip | Memoriza RO·CO·IN·RE·FO | [ ] |
| 27 | simulador_prompt | Construye tu Prompt ★ | [ ] |
| 28 | checklist | Formativa 50% | [ ] |
| 29 | portada | Portada M-III | [ ] |
| 30 | texto_rico | Alucinaciones + GROUNDING | [ ] |
| 31 | simulador_html | Detective Alucinaciones | [ ] |
| 32 | mapa_ecosistema | Ecosistema Herramientas IA | [ ] |
| 33 | texto_rico | Tipos de Sesgos | [ ] |
| 34 | tarjetas_flip | Sesgos en la Práctica | [ ] |
| 35 | texto_rico | El Filtro Humano | [ ] |
| 36 | checklist | 4 Compromisos Éticos | [ ] |
| 37 | caso_etico | Caso Ético: El Reporte | [ ] |
| 38 | portada | Portada Evaluación Final | [ ] |
| 39 | simulador_prompt | Desafío del Asistente | [ ] |
| 40 | cuestionario | Validación de Conceptos | [ ] |
| 41 | checklist | Auto-Auditoría Ética | [ ] |
| 42 | resumen_personal | Lo Que Te Llevas Hoy | [ ] |
| 43 | mapa_ecosistema | Ruta de Continuidad | [ ] |
| 44 | checklist | Compromisos 72 Horas | [ ] |
| 45 | texto_rico | ¡Felicidades! | [ ] |

**45 bloques · 14 tipos · 5 páginas (pag.inicio)**

---

## Distribución por Tipo

| Tipo | Cantidad | Bloques |
|---|---|---|
| texto_rico | 11 | 3,4,9,12,19,21,23,30,33,35,45 |
| checklist | 6 | 6,15,28,36,41,44 |
| portada | 5 | 1,8,17,29,38 |
| simulador_html | 5 | 11,13,24,25,31 |
| tarjetas_flip | 3 | 14,26,34 |
| infografia | 3 | 2,5,18 |
| cuestionario | 2 | 7,40 |
| campo_libre | 2 | 20,22 |
| simulador_prompt | 2 | 27,39 |
| mapa_ecosistema | 2 | 32,43 |
| comparador | 1 | 10 |
| tabla_editable | 1 | 16 |
| caso_etico | 1 | 37 |
| resumen_personal | 1 | 42 |

---

*Referencia maestra — no modificar `[ ]` en este archivo*
*Para curso nuevo: duplicar → renombrar slug → marcar `[x]` conforme avance en Antigravity*
*Abril 2026 · Desarrollos Elaborados · iAprende · EC0301 vía B Smarter*
