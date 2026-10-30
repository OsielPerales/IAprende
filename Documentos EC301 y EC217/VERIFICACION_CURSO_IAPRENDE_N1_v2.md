*-9# DOCUMENTO DE VERIFICACIÓN DE CUMPLIMIENTO
## Curso: IA Estratégica y Diseño de Instrucciones Proactivas — v2.0
**Plataforma:** iAprende · `iaprende-1415d.web.app`  
**Firebase Project:** `iaprende-1415d`  
**Stack:** React + TypeScript + Vite + Firebase (Auth + Firestore + Hosting)  
**Versión del documento:** 1.0 · Abril 2026  
**Autor:** Osiel Alejandro Perales Jiménez · Desarrollos Elaborados  
**Estándar:** EC0301 · Certificado por B Smarter  

---

## INSTRUCCIONES DE USO

Este documento es la **referencia maestra de transcripción e implementación** del curso en la plataforma iAprende. Para cada bloque se especifica:

- `FUENTE` — de dónde proviene el contenido (slide PDF / manual participante / contenido nuevo)
- `CONTENIDO` — texto exacto o descripción precisa a implementar
- `TIPO DE BLOQUE` — tipo en el schema de Firestore
- `COMPONENTE` — componente React a usar o crear
- `INTERACTIVO` — descripción técnica del simulador o elemento dinámico si aplica
- `ESTADO` — `[ ]` pendiente · `[x]` completado

---

## ARQUITECTURA DE ALMACENAMIENTO

### Colecciones Firestore

```
cursos/
  └── c-ia-estrategica-v2/          ← documento del curso
        titulo: "IA Estratégica y Diseño de Instrucciones Proactivas"
        version: "2.0"
        duracion_min: 135
        modulos: ["preambulo", "encuadre", "modulo-1", "modulo-2", "modulo-3", "sumativa", "cierre"]
        activo: true
        created_at: timestamp

bloques/
  └── {bloque_id}/                  ← un documento por bloque
        curso_id: "c-ia-estrategica-v2"
        orden: number
        modulo: string
        tipo: BloqueType             ← ver tipos abajo
        titulo: string
        contenido: object            ← estructura según tipo
        duracion_min: number
        created_at: timestamp

progreso_alumno/
  └── {userId}_{cursoId}/
        bloques_completados: string[]
        bitacora: [{proceso, tiempo, repetitivo, candidato}]  ← guardada en M-I
        rol_construido: string        ← guardado en M-II lección ROL
        contexto_construido: string   ← guardado en M-II lección CONTEXTO
        prompt_maestro: string        ← prompt final del alumno
        calificacion_formativa: number
        calificacion_sumativa: number
        respuestas_diagnostica: object
        compromisos_encuadre: object  ← expectativas iniciales
        auditoria_etica: boolean[]
        updated_at: timestamp

grupos/
  └── {grupo_id}/
        curso_id: string
        alumnos: string[]
        instructor_id: string
        fecha: timestamp
        activo: boolean
```

### Tipos de Bloque (`BloqueType`) — Schema Firestore

```typescript
type BloqueType =
  | "portada"           // slide de apertura de módulo
  | "texto_rico"        // contenido expositivo con markdown
  | "comparador"        // dos columnas comparativas (estático)
  | "infografia"        // imagen con zonas expandibles
  | "tarjetas_flip"     // cards con frente y reverso interactivo
  | "tabla_editable"    // tabla con campos de entrada guardados en Firestore
  | "checklist"         // lista de criterios con toggle
  | "cuestionario"      // preguntas de opción múltiple con calificación
  | "campo_libre"       // área de texto guardada en progreso_alumno
  | "simulador_html"    // HTML embebido en iframe sandbox
  | "simulador_prompt"  // editor de prompt con evaluación vía Claude API
  | "caso_etico"        // narrativa + preguntas colaborativas
  | "resumen_personal"  // resumen generado dinámicamente con datos del alumno
  | "mapa_ecosistema"   // mapa interactivo de cursos siguientes
```

### Alojamiento de Recursos Estáticos

```
Firebase Hosting (iaprende-1415d.web.app)
  └── /assets/
        └── /curso-n1/
              ├── infografia-3-pilares.svg      ← infografía 3 Pilares (editable SVG)
              ├── mapa-moe.svg                  ← diagrama radial MoE
              ├── icono-mod1.svg                ← ícono Módulo I
              ├── icono-mod2.svg                ← ícono Módulo II
              ├── icono-mod3.svg                ← ícono Módulo III
              └── /slides-recicladas/           ← imágenes exportadas del PDF original
                    ├── comparador-buscadores.png
                    ├── tokens-animacion.png
                    └── 5-componentes-mnemónico.png
```

---

## BLOQUES — ESPECIFICACIÓN COMPLETA

---

### ▸ PREÁMBULO (NUEVO)

---

#### BLOQUE P.1 — La Nueva Economía Cognitiva
```
FUENTE:       Nuevo · Infografía existente (imagen adjunta en conversación)
MÓDULO:       preambulo
ORDEN:        1
TIPO:         infografia
DURACIÓN:     5 min
ESTADO:       [ ]
```

**CONTENIDO A IMPLEMENTAR:**

Título principal: `LA NUEVA ECONOMÍA COGNITIVA`  
Subtítulo: `Los 3 Pilares de la Transformación`  
Frase: `Por qué la adopción correcta de la IA no es una ventaja tecnológica, sino un imperativo de supervivencia económica.`

Los 3 pilares como zonas expandibles con tap/click:

**Pilar 01 — DEMOCRATIZACIÓN DEL CONOCIMIENTO** (color: mint `#D4E5DF`)
- Tagline: *El fin de la barrera de entrada a la información experta.*
- Concepto técnico: La IA nos permite indexar y recuperar la totalidad del conocimiento humano, pero con una diferencia crucial: el Contexto.
- Impacto económico: Ya no importa "saberlo todo"; importa saber preguntar. Cualquier empleado, desde el operario hasta el gerente, tiene ahora acceso instantáneo a un consultor experto global.
- Resultado: **Resolución de problemas en tiempo real, sin depender de jerarquías o largas curvas de aprendizaje.**

**Pilar 02 — AUTOMATIZACIÓN DE FLUJOS (WORKFLOWS)** (color: lavanda `#E6E1F0`)  
Badge destacado: **"→ ESTÁS AQUÍ · Este curso"**
- Tagline: *La transición de la ejecución manual a la supervisión estratégica.*
- Concepto técnico: Superamos la automatización rígida. Ahora creamos flujos de trabajo inteligentes que se adaptan. La IA no solo "hace", sino que "decide" en tareas repetitivas basándose en criterios predefinidos.
- Impacto económico: El tiempo humano es el recurso más caro. Al eliminar la carga cognitiva de tareas repetitivas (redacción, cálculo, clasificación), recuperamos horas de alto valor.
- Resultado: **Reducción drástica de costos operativos y eliminación del error humano por fatiga.**

**Pilar 03 — AMPLIFICACIÓN HUMANA** (color: naranja suave derivado de `#E07A5F`)
- Tagline: *El modelo del "Centauro": multiplicando capacidades.*
- Concepto técnico: No se trata de sustitución, sino de Simbiosis. El humano define el "Qué" (Estrategia) y la IA resuelve el "Cómo" (Ejecución Táctica).
- Impacto económico: Nos convertimos en orquestadores de información. Un solo ingeniero, asistido por agentes de IA, puede producir lo que antes requeriría un departamento entero.
- Resultado: **Multiplicación exponencial de la eficiencia y capacidad de producción individual.**

**Nota al pie (siempre visible):**  
*"Este curso cubre el Pilar 2. Al completarlo, sabrás exactamente dónde viven los otros dos y tendrás el mapa para llegar a ellos."*

**INTERACTIVO:**
- Cada pilar es una card que se expande al tocar mostrando concepto técnico + impacto + resultado
- Pilar 2 tiene badge permanente `"→ ESTÁS AQUÍ"`
- Al cerrar las 3 cards aparece un botón `"Comenzar el curso"`

---

### ▸ ENCUADRE (Slides 2–6)

---

#### BLOQUE E.1 — Bienvenida
```
FUENTE:       Slide 2 del PDF · Manual del Participante p.3
MÓDULO:       encuadre
ORDEN:        2
TIPO:         texto_rico
DURACIÓN:     3 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (del slide 2):**

Título: `Bienvenida`  
Subtítulo en cursiva: *Gracias por estar aquí. Este no es un curso teórico.*

Cuerpo:  
> En las próximas 2 horas vas a construir un **Asistente de IA real** adaptado a un proceso concreto de tu trabajo o negocio. No vas a salir con apuntes. Vas a salir con una herramienta.

Recuadro destacado (mint):  
**NUESTRA FILOSOFÍA · SKIN IN THE GAME**  
*No enseñamos nada que no hayamos probado antes en nuestra propia operación. Todo lo que verás hoy ha sido validado en empresas reales del norte de México.*

---

#### BLOQUE E.2 — Objetivo General
```
FUENTE:       Slide 3 del PDF · Manual del Participante p.5
MÓDULO:       encuadre
ORDEN:        3
TIPO:         texto_rico
DURACIÓN:     2 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR:**

Título: `Objetivo General`  
Subtítulo: *Qué habrás logrado al salir de esta sala*

Recuadro principal:  
> *El participante diseñará instrucciones estratégicas (prompts) para motores de razonamiento basados en IA, aplicando la Estructura Maestra del Prompt y principios éticos, de modo que pueda resolver procesos reales de su negocio o entorno profesional.*

Recuadro secundario (lavanda):  
**VERBOS CLAVE DEL OBJETIVO**  
`DISEÑAR` (nivel taxonómico alto) · `APLICAR` (estructura) · `RESOLVER` (proceso real). No es «conocer», no es «entender». Es producir una herramienta.

**INTERACTIVO:**  
Cada verbo clave (`DISEÑAR`, `APLICAR`, `RESOLVER`) es un chip tocable que al presionar despliega un tooltip con su significado taxonómico (Bloom).

---

#### BLOQUE E.3 — Mapa del Curso
```
FUENTE:       Slide 4 del PDF (Objetivos Particulares) + NUEVO (visualización de ruta)
MÓDULO:       encuadre
ORDEN:        4
TIPO:         infografia
DURACIÓN:     2 min
ESTADO:       [ ]
```

**CONTENIDO A IMPLEMENTAR:**

Línea de tiempo horizontal con nodos tocables:

```
[ENCUADRE 15'] → [MÓDULO I 30'] → [MÓDULO II 50'] → [MÓDULO III 15'] → [SUMATIVA 10'] → [CIERRE 5']
```

Al tocar cada nodo aparece tarjeta con:
- Nombre del módulo
- Técnica instruccional
- Competencia que desarrolla
- Número de actividades

Contenido de cada nodo (del slide 4):
- **Módulo I:** COMPRENDER · De buscadores a motores de razonamiento · 3 lecciones · Expositiva Dialogada
- **Módulo II:** APLICAR · Estructura Maestra del Prompt · 4 lecciones + práctica · Demostrativa en vivo
- **Módulo III:** DESARROLLAR · Sesgos, alucinaciones y ética · 3 lecciones + discusión · Diálogo-Discusión

---

#### BLOQUE E.4 — Expectativas y Compromisos
```
FUENTE:       Slide 5 del PDF · Manual del Participante p.6
MÓDULO:       encuadre
ORDEN:        5
TIPO:         tabla_editable
DURACIÓN:     4 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR:**

Instrucción: *Antes de abrir el Módulo I, responde estas 3 preguntas. Tus respuestas se recuperarán al final del curso.*

Campos de texto libre guardados en `progreso_alumno.compromisos_encuadre`:
1. ¿Qué proceso de tu trabajo te consume más tiempo y quisieras automatizar?
2. ¿Cuál es tu nivel actual de uso de IA? (selector: Nunca / Básico / Intermedio / Avanzado)
3. ¿Qué compromiso estás dispuesto a asumir para aplicar lo aprendido?

**ALMACENAMIENTO:** `progreso_alumno/{userId}_{cursoId}.compromisos_encuadre`  
**RECUPERACIÓN:** Se muestra en el Bloque C.1 (Cierre) como espejo de crecimiento.

---

#### BLOQUE E.5 — Evaluación Diagnóstica
```
FUENTE:       Slide 6 del PDF · Manual del Participante p.16
MÓDULO:       encuadre
ORDEN:        6
TIPO:         cuestionario
DURACIÓN:     3 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (5 preguntas del manual p.16):**

Instrucción: *No hay respuestas correctas o incorrectas. Solo referencial — no cuenta para calificación.*

| # | Pregunta | Tipo de respuesta |
|---|---|---|
| 1 | ¿Qué es la Inteligencia Artificial para ti en este momento? | Texto libre |
| 2 | ¿Has usado herramientas de IA (ChatGPT, Gemini, Copilot, etc.)? ¿Con qué frecuencia? | Selector: Nunca / Raramente / Semana / Diario |
| 3 | ¿Qué diferencia encuentras entre buscar en Google y preguntar a ChatGPT? | Texto libre |
| 4 | ¿Qué es un "prompt" para ti? | Texto libre |
| 5 | Nombra al menos un proceso de tu trabajo que crees podría automatizarse con IA. | Texto libre |

**ALMACENAMIENTO:** `progreso_alumno/{userId}_{cursoId}.respuestas_diagnostica`  
**PANEL INSTRUCTOR:** Respuestas visibles en tiempo real en `ImpartirCurso`.

---

### ▸ MÓDULO I — Encuadre y Fundamentos (Slides 7–12)

---

#### BLOQUE M1.0 — Portada Módulo I
```
FUENTE:       Slide 7 del PDF
MÓDULO:       modulo-1
ORDEN:        7
TIPO:         portada
DURACIÓN:     1 min
ESTADO:       [ ]
```

**CONTENIDO:**  
Badge: `MÓDULO I`  
Título: `Encuadre y Fundamentos`  
Subtítulo: *De motores de búsqueda a motores de razonamiento*  
Meta: `30 minutos · 3 lecciones · Técnica: Expositiva Dialogada`

---

#### BLOQUE M1.1 — De Buscadores a Motores de Razonamiento
```
FUENTE:       Slide 8 del PDF · Manual del Participante p.7
MÓDULO:       modulo-1
ORDEN:        8
TIPO:         comparador
DURACIÓN:     8 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 8):**

Título: `De Buscadores a Motores de Razonamiento`  
Subtítulo: *El cambio de paradigma que estás viviendo ahora mismo*

Columna izquierda — **BUSCADORES TRADICIONALES** (Google, Bing):
- Te entregan una lista de enlaces
- TÚ eres el analista
- TÚ filtras, comparas, sintetizas
- La información está afuera

Columna derecha — **MOTORES DE RAZONAMIENTO** (Claude, ChatGPT, Gemini, Perplexity):
- Te entregan un producto listo
- La IA es el analista
- Procesa, redacta, adapta al contexto
- La respuesta está construida

Frase ancla: *Punto clave · El usuario pasa de ser buscador a ser director de orquesta.*

**INTERACTIVO — Drag & Drop:**  
Se presentan 8 características mezcladas. El participante las arrastra al lado correcto (Buscador / Motor de Razonamiento). Al soltar cada una: verde si correcto, rojo si incorrecto. Al completar los 8: mensaje de refuerzo.

Características a clasificar (del manual p.7 tabla):
1. "Te da una lista de links" → Buscador
2. "Te da una respuesta elaborada" → Motor
3. "Tú buscas y filtras la información" → Buscador
4. "La IA procesa y sintetiza por ti" → Motor
5. "Responde con lo que existe en la web" → Buscador
6. "Razona, redacta, analiza y genera contenido" → Motor
7. "No tiene memoria del contexto" → Buscador
8. "Mantiene el contexto de la conversación" → Motor

---

#### BLOQUE M1.2 — ¿Cómo Funciona Realmente la IA? Tokens
```
FUENTE:       Slide 9 del PDF · Manual del Participante p.7
MÓDULO:       modulo-1
ORDEN:        9
TIPO:         simulador_html
DURACIÓN:     5 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 9):**

Título: `¿Cómo funciona realmente la IA?`  
Subtítulo: *Predicción probabilística de tokens*

Diagrama de flujo: `El gato` → `está` → `durmiendo` → `?`  
*Predicción: ¿cuál es la palabra más probable después de lo anterior?*

Recuadro PUNTO CLAVE (lavanda):  
*La IA no «piensa». Predice la siguiente palabra más probable con base en billones de textos de entrenamiento.*

Recuadro CONSECUENCIA (naranja suave):  
*Por eso puede «alucinar»: inventar datos que suenan creíbles pero no son verdaderos. Ya lo veremos en el Módulo III.*

**Párrafo adicional del manual p.7** (texto a incluir bajo el diagrama):  
*Los modelos de lenguaje como GPT o Gemini funcionan mediante predicción probabilística de tokens (palabras o fragmentos de palabras). La IA no "piensa" como un humano: analiza patrones en billones de textos para predecir la siguiente palabra más probable dado un contexto.*

**Conexión con prompt (NUEVO — observación de impartición):**  
Recuadro destacado al pie:  
*"Un prompt bien construido no es solo una pregunta. Es un vector que sesga la probabilidad de predicción hacia la salida de alta calidad que necesitas. A mejor prompt, mayor precisión del vector."*

**INTERACTIVO — Simulador de Tokenización:**  
- Campo de texto donde el participante escribe cualquier frase
- La frase se divide visualmente en tokens con colores alternados
- Contador de tokens en tiempo real
- Nota: *"Cada token tiene un costo en APIs de pago. Prompts precisos = menos tokens = menor costo."*
- Implementación: HTML/JS con tokenizador simple por espacios y signos de puntuación

---

#### BLOQUE M1.3 — Arquitectura MoE
```
FUENTE:       Slide 10 del PDF · Manual del Participante p.8
MÓDULO:       modulo-1
ORDEN:        10
TIPO:         simulador_html
DURACIÓN:     6 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 10):**

Título: `Arquitectura MoE — Mezcla de Expertos`  
Subtítulo: *Por qué decirle a la IA «actúa como…» cambia la calidad de la respuesta*

Diagrama radial: nodo central `PROMPT` → 5 nodos externos: Legal / Finanzas / Marketing / Técnico / RRHH. El nodo "Finanzas" está iluminado en el ejemplo.

Nota del instructor (del slide): *«Actúa como contador público con 15 años de experiencia en PYMES» activa nodos de finanzas. La especificidad del ROL dispara la precisión.*

Texto del manual p.8:  
*Los modelos modernos de IA utilizan una arquitectura llamada Mixture of Experts (MoE o Mezcla de Expertos). En lugar de usar todos sus parámetros para cada consulta, el modelo activa solo los «expertos» más relevantes para la tarea. Cuando le asignas un ROL específico a la IA, activas los nodos especializados del modelo.*

Dato destacado: *GPT-4 tiene aproximadamente 8 expertos activos de 16 totales en cada llamada. Asignar un rol bien definido es como contratar al especialista correcto en lugar de preguntarle a un generalista.*

**INTERACTIVO — Diagrama Radial Reactivo:**  
- El diagrama MoE con 5 nodos externos se muestra estático
- Campo de texto: "¿A qué experto le preguntarías para tu proceso?"
- El participante escribe un rol (ej: "contador", "abogado", "marketero")
- Al escribir, el nodo correspondiente se ilumina en el diagrama
- Mapeo simple: palabras clave → nodo (Legal, Finanzas, Marketing, Técnico, RRHH)
- Mensaje de refuerzo: "Correcto — cuanto más específico el rol, más preciso el experto activado."

---

#### BLOQUE M1.4 — Los 3 Modos de Uso de IA *(NUEVO)*
```
FUENTE:       NUEVO — observación de impartición
MÓDULO:       modulo-1
ORDEN:        11
TIPO:         tarjetas_flip
DURACIÓN:     4 min
ESTADO:       [ ]
```

**CONTENIDO (nuevo, no existe en slides ni manual — debe crearse):**

Título: `¿Cómo se usa realmente la IA?`  
Subtítulo: *Tres modos distintos. Este curso vive en el Modo 2.*

**Tarjeta 1 — MODO CONSULTA**  
Frente: ícono de búsqueda + título "Modo 1: Consulta Puntual"  
Reverso:
- Descripción: Le haces una pregunta, te responde. Interacción única, no repetible.
- Ejemplo: "¿Cuánto cuesta exportar a EE.UU.?"
- Límite: La respuesta es para ese momento, no escala.
- Aprende esto en: Pilar 1 · Democratización del Conocimiento

**Tarjeta 2 — MODO HERRAMIENTA** (badge: `→ FOCO DE ESTE CURSO`)  
Frente: ícono de engranaje + título "Modo 2: Herramienta Diseñada"  
Reverso:
- Descripción: Diseñas una instrucción estructurada que ejecuta una función específica siempre igual. La herramienta trabaja por ti cada vez.
- Ejemplo: "Asistente de cotizaciones que siempre entrega propuestas en el mismo formato."
- Resultado: Prompt repetible → salida consistente y de alta calidad en cada uso.
- Esto es lo que construyes hoy.

**Tarjeta 3 — MODO COLABORACIÓN**  
Frente: ícono de dos personas + título "Modo 3: Amplificación Humana"  
Reverso:
- Descripción: Trabajo iterativo. Tú y la IA construyen algo juntos, prompt a prompt, refinando en cada vuelta.
- Ejemplo: Un ingeniero y la IA diseñando un sistema complejo en sesiones de trabajo colaborativas.
- Nivel: Requiere dominar el Modo 2 primero.
- Aprende esto en: Pilar 3 · Amplificación Humana · Cursos avanzados iAprende

**Nota al pie:** *"El Modo 2 que aprenderás hoy también aplica al Modo 1 — un prompt bien estructurado mejora cualquier consulta puntual."*

**INTERACTIVO:**  
3 cards físicamente flip-ables al tocar. Al voltear las 3: aparece mensaje "Tienes el mapa. Ahora construyamos tu herramienta."

---

#### BLOQUE M1.5 — Identificación de Puntos de Dolor
```
FUENTE:       Slide 11 del PDF · Manual del Participante p.8
MÓDULO:       modulo-1
ORDEN:        12
TIPO:         checklist
DURACIÓN:     5 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 11):**

Título: `Identificación de Puntos de Dolor`  
Subtítulo: *Qué procesos son realmente candidatos para automatizar*

4 criterios como checklist interactivo:
1. **CONSUME TIEMPO** — Más de 30 min/semana en total.
2. **SE REPITE** — Mínimo una vez por semana.
3. **PATRÓN PREDECIBLE** — Sigue una estructura recurrente.
4. **GENERA FRICCIÓN** — Te frustra o bloquea otras tareas.

Frase ancla: *Si el proceso cumple con los 4 criterios, es un candidato ideal para IA.*

**INTERACTIVO — Checklist reactivo:**  
El participante marca cada criterio pensando en el proceso que identificará en la Bitácora. Al marcar los 4: badge verde animado `"✓ Candidato ideal para IA"` + mensaje: *"Ese proceso es tu proyecto para el resto del curso."*

Tip del slide: *Pregúntate: «¿Qué haría yo con 4 horas extra a la semana?» El proceso que te libera esas horas es tu candidato #1.*

---

#### BLOQUE M1.6 — Bitácora de Procesos *(Actividad)*
```
FUENTE:       Slide 12 del PDF · Manual del Participante p.8
MÓDULO:       modulo-1
ORDEN:        13
TIPO:         tabla_editable
DURACIÓN:     6 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 12):**

Título: `Actividad · Bitácora de Procesos`  
Subtítulo: *3 min de reflexión individual · 3 min de puesta en común*

Instrucción: *Completa al menos 3 filas con procesos que realizas regularmente.*

Tabla con 5 filas editables, 4 columnas:

| Proceso o tarea | ¿Cuánto tiempo/sem? | ¿Se repite? | Candidato IA |
|---|---|---|---|
| (campo libre) | (campo + selector h) | (Sí/No) | (Auto: Alto/Medio/Bajo) |

Ejemplos pre-cargados como placeholder (del slide 12):
- Fila 1: "Responder correos de cotización" / 5h / Sí / Alto
- Fila 2: "Redactar reportes semanales" / 3h / Sí / Alto

Tip: *«¿Qué haría yo con 4 horas extra a la semana?» El proceso que te libera esas horas es tu candidato #1.*

**ALMACENAMIENTO:** `progreso_alumno/{userId}_{cursoId}.bitacora`  
**RECUPERACIÓN:** El primer proceso marcado como "Alto" se pre-carga en los campos del Módulo II.

---

### ▸ MÓDULO II — Estructura Maestra del Prompt (Slides 13–22)

---

#### BLOQUE M2.0 — Portada Módulo II
```
FUENTE:       Slide 13 del PDF
MÓDULO:       modulo-2
ORDEN:        14
TIPO:         portada
DURACIÓN:     1 min
ESTADO:       [ ]
```

**CONTENIDO:**  
Badge: `MÓDULO II`  
Título: `Estructura Maestra del Prompt`  
Subtítulo: *Los 5 componentes que transforman la calidad de tu respuesta*  
Meta: `50 minutos · 4 lecciones + práctica integrada · Técnica: Demostrativa en vivo`  
Dato personalizado: *"Tu candidato #1 de la Bitácora: [proceso del alumno recuperado de Firestore]"*

---

#### BLOQUE M2.1 — Los 5 Componentes (Mapa)
```
FUENTE:       Slide 14 del PDF · Manual del Participante p.9
MÓDULO:       modulo-2
ORDEN:        15
TIPO:         infografia
DURACIÓN:     4 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 14):**

Título: `Los 5 Componentes del Prompt Maestro`  
Subtítulo: *Memorízalos en este orden · Son tu mapa durante todo el módulo*

5 columnas (del slide 14 + manual p.9):

| # | Componente | Definición corta |
|---|---|---|
| 1 | **ROL** | Quién es la IA |
| 2 | **CONTEXTO** | Qué ya sabe |
| 3 | **INSTRUCCIÓN** | Qué debe hacer |
| 4 | **RESTRICCIONES** | Qué no hacer |
| 5 | **FORMATO** | Cómo entregarlo |

Mnemónico al pie: `RO · CO · IN · RE · FO`

**INTERACTIVO:**  
Mapa expandible. Tap en cada componente → despliega definición completa del manual + ejemplo contextualizado + error más común. La barra `RO·CO·IN·RE·FO` actúa como indicador de progreso durante todo el Módulo II.

---

#### BLOQUE M2.2 — Lección ROL
```
FUENTE:       Slide 15 del PDF · Manual del Participante p.9-10
MÓDULO:       modulo-2
ORDEN:        16
TIPO:         campo_libre
DURACIÓN:     7 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slides 15-16 + manual p.10):**

Título: `El ROL — Activa los Expertos Correctos`  
Subtítulo: *Componente 1 de 5*

Comparador:
- ROL GENÉRICO ✗: *"Ayúdame con un tema de contabilidad."*
- ROL ESPECÍFICO ✓: *"Actúa como contador público con 15 años de experiencia en PYMES del sector manufactura en México."*

Recuadro fórmula (lavanda):  
`TÍTULO PROFESIONAL + ESPECIALIDAD + CONTEXTO (industria/región) + AÑOS DE EXPERIENCIA`

Tip del instructor (slide 15):  
*Si no sabes qué experto pedir, pregúntale a la IA: «¿Qué rol debería asumir para responder mejor [mi problema]?».*

Ejemplos del manual p.10:
- *«Actúa como gerente de ventas industriales, especializado en metalmecánica, sector automotriz norte de México, con 12 años de experiencia.»*
- *«Actúa como analista de RRHH, especializado en reclutamiento técnico, con 8 años en PyMEs.»*

**CAMPO DE PRÁCTICA:**  
Template pre-llenado con proceso de Bitácora:  
`Actúa como _____________, especializado en _____________, en el sector _____________, con ___ años de experiencia.`

**ALMACENAMIENTO:** `progreso_alumno/{userId}_{cursoId}.rol_construido`

---

#### BLOQUE M2.3 — Lección CONTEXTO
```
FUENTE:       Slide 17 del PDF · Manual del Participante p.10-11
MÓDULO:       modulo-2
ORDEN:        17
TIPO:         campo_libre
DURACIÓN:     7 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 17 + manual p.11):**

Título: `CONTEXTO — Tu Mesa de Trabajo`  
Subtítulo: *Componente 2 de 5 · Lo que pones sobre la mesa antes de pedir la solución*

Texto introductorio:  
*Imagina que contratas a un consultor de alto nivel para resolver un problema. Si llegas sin información, sin datos, sin detalles de tu empresa, el consultor solo puede darte respuestas genéricas. Lo mismo ocurre con la IA.*

4 elementos del contexto (slide 17):
- **Quién eres** — Rol, empresa, sector
- **Qué necesitas** — Objetivo, problema
- **Datos relevantes** — Cifras, ejemplos, docs
- **Restricciones reales** — Tiempo, presupuesto

Dato técnico: *Ventana de contexto actual: 128K a 2M tokens (equivalente a cientos de páginas de texto).*

Advertencia de seguridad (manual p.11):  
⚠️ *NUNCA incluyas en el contexto datos personales reales de clientes (nombres, correos, teléfonos, RFC, cuentas bancarias). Usa datos ficticios o anonimizados en tu entrenamiento.*

**CAMPO DE PRÁCTICA:**  
Área de texto: *"Mi CONTEXTO personalizado (datos de mi negocio/situación — sin información confidencial real):"*

**ALMACENAMIENTO:** `progreso_alumno/{userId}_{cursoId}.contexto_construido`

---

#### BLOQUE M2.4 — Lección INSTRUCCIÓN
```
FUENTE:       Slide 18 del PDF · Manual del Participante p.11-12
MÓDULO:       modulo-2
ORDEN:        18
TIPO:         simulador_html
DURACIÓN:     6 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 18 + manual p.11-12):**

Título: `INSTRUCCIÓN — El Corazón del Prompt`  
Subtítulo: *Componente 3 de 5 · Empieza con un verbo de acción imperativo*

Comparador Pasivo/Activo (slide 18):

PASIVO · DÉBIL ✗: *«me gustaría que...»* / *«podrías hacer...»* / *«quiero ver si puedes...»* / *«sería bueno que...»*

ACTIVO · PROACTIVO ✓: Redacta · Analiza · Diseña / Compara · Clasifica · Genera / Resume · Traduce · Corrige / Propón · Prioriza · Valida

Tip (slide 18):  
*Lee tu prompt en voz alta. Si empieza con un verbo de acción directo («Redacta...», «Diseña...»), vas bien. Si empieza con una duda o una disculpa, reescríbelo.*

**INTERACTIVO — Validador de Verbo:**  
- Campo de texto: "Escribe tu instrucción aquí"
- Al escribir, detector en tiempo real que evalúa si el primer token es verbo fuerte
- Lista de verbos fuertes: Redacta, Analiza, Diseña, Compara, Clasifica, Genera, Resume, Traduce, Corrige, Propón, Prioriza, Valida, Sintetiza, Evalúa, Crea, Describe, Identifica, Extrae
- Verbo débil detectado → badge rojo + sugerencia de reemplazo
- Verbo fuerte → badge verde + "¡Instrucción proactiva!"
- Implementación: HTML/JS con array de verbos fuertes/débiles

---

#### BLOQUE M2.5 — Lección FORMATO + Multimodal
```
FUENTE:       Slide 19 del PDF · Manual del Participante p.12 · AMPLIADO (nuevo)
MÓDULO:       modulo-2
ORDEN:        19
TIPO:         texto_rico
DURACIÓN:     5 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 19 + manual p.12):**

Título: `FORMATO — Cómo Entregar la Respuesta`  
Subtítulo: *Componente 4 de 5 · Elige el formato correcto para no editar después*

6 tipos de formato (slide 19) como cards seleccionables:
1. **Lista numerada** — Pasos, ranking
2. **Tabla comparativa** — Opciones, criterios
3. **Markdown** — Documentos digitales
4. **JSON** — Integración con sistemas
5. **Email listo** — Comunicación directa
6. **Secciones nombradas** — Reportes, propuestas

Frase ancla: *Si especificas el formato, la IA entrega una respuesta copy-paste lista para usar.*

**SECCIÓN AMPLIADA — Más Allá del Texto (NUEVO):**

Subtítulo: *¿Sabías que la IA también puede recibir y entregar imágenes, audio y video?*

Bloque expandible "Entradas multimodales":
- 📷 **Imagen** — Puedes subir una foto y pedir análisis, descripción, extracción de datos
- 🎵 **Audio** — Algunos modelos transcriben y analizan conversaciones de voz
- 🎬 **Video** — Puedes subir un video y pedir un resumen o análisis de contenido
- 📄 **Documento** — PDFs, Word, hojas de cálculo como contexto

Bloque expandible "Salidas multimodales — Suite Google":
- 🖼️ **Imagen 4** (Google) — Generación de imágenes desde texto con alta fidelidad
- 🎬 **Veo 3.1** — Video 1080p hasta 60 segundos con audio nativo incorporado
- 🎵 **Lyria 3 Pro** — Música original hasta 3 minutos con control granular de estilo
- 🗣️ **Voz vía Gemini** — Narración y síntesis de voz con tono natural

CTA expandible al pie:  
*"¿Te interesa dominar estas herramientas? iAprende tiene talleres especializados en creación audiovisual con IA. Pregunta al instructor al finalizar."*

---

#### BLOQUE M2.6 — Lección RESTRICCIONES
```
FUENTE:       Slide 20 del PDF · Manual del Participante p.12
MÓDULO:       modulo-2
ORDEN:        20
TIPO:         texto_rico
DURACIÓN:     4 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 20 + manual p.12):**

Título: `RESTRICCIONES — Los Límites`  
Subtítulo: *Componente 5 de 5 · Lo que la IA NO debe hacer*

4 tipos de restricción (slide 20):
- **Longitud** — «Máximo 150 palabras»
- **Tono** — «Formal, sin tecnicismos»
- **Alcance** — «No menciones precios»
- **Seguridad** — «No inventes datos»

Nota sobre tokens (slide 20):  
*1 token ≈ 0.75 palabras en español. Prompts precisos con restricciones generan mejores respuestas con menos tokens → menos costo en APIs de pago.*

---

#### BLOQUE M2.7 — Demo Prompt Maestro en Acción
```
FUENTE:       Slide 21 del PDF · Manual del Participante p.10
MÓDULO:       modulo-2
ORDEN:        21
TIPO:         simulador_html
DURACIÓN:     5 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 21 + manual p.10):**

Título: `Prompt Maestro en Acción`  
Subtítulo: *Demostración · Caso de cotización industrial · Los 5 componentes integrados*

Prompt completo con color-coding por componente (del slide 21):

```
[ROL] Actúa como gerente de ventas industrial, especializado en metalmecánica 
en el norte de México, con 12 años de experiencia.

[CONTEXTO] Corte y Diseño CNC recibe una solicitud de cotización para 500 
piezas de MDF 18mm, corte CNC con acabado melamina blanca.

[INSTRUCCIÓN] Redacta un correo de respuesta que incluya tiempo estimado de 
entrega, condiciones de pago y un diferenciador de valor.

[RESTRICCIONES] Máximo 180 palabras. Tono profesional cercano. Sin jerga técnica 
innecesaria. No prometas fechas sin confirmar stock.

[FORMATO] Correo electrónico con asunto, saludo, cuerpo en 3 párrafos cortos 
y cierre con datos de contacto.
```

**INTERACTIVO:**
- El prompt se muestra con cada componente en un color diferente (ROL=azul, CONTEXTO=verde, INSTRUCCIÓN=naranja, RESTRICCIONES=rojo suave, FORMATO=lavanda)
- Botón primario: `"Ver resultado de este prompt"` → despliega respuesta de IA pre-generada (texto estático guardado en Firestore — no llamada API en vivo en este bloque)
- Botón secundario: `"Pasar a construir el mío"` → navega al Bloque M2.8

---

#### BLOQUE M2.8 — Simulador de Prompt Maestro *(componente estrella)*
```
FUENTE:       NUEVO — componente principal interactivo
MÓDULO:       modulo-2
ORDEN:        22
TIPO:         simulador_prompt
DURACIÓN:     8 min
ESTADO:       [ ]
```

**DESCRIPCIÓN TÉCNICA:**

Editor de prompt dividido en 5 secciones coloreadas y etiquetadas. Los campos ROL y CONTEXTO se pre-cargan con lo que el alumno construyó en los bloques anteriores (recuperado de `progreso_alumno`).

Campos:
```
┌─ ROL (azul) ─────────────────────────────────────┐
│ [pre-cargado de progreso_alumno.rol_construido]   │
└───────────────────────────────────────────────────┘
┌─ CONTEXTO (verde) ───────────────────────────────┐
│ [pre-cargado de progreso_alumno.contexto_construido] │
└───────────────────────────────────────────────────┘
┌─ INSTRUCCIÓN (naranja) ──────────────────────────┐
│ [campo libre + validador de verbo en tiempo real] │
└───────────────────────────────────────────────────┘
┌─ RESTRICCIONES (rojo suave) ─────────────────────┐
│ [campo libre]                                     │
└───────────────────────────────────────────────────┘
┌─ FORMATO (lavanda) ──────────────────────────────┐
│ [campo libre + chips de formato rápido]           │
└───────────────────────────────────────────────────┘
```

Botones de acción:
1. `"Evaluar mi prompt"` → llama Claude API con system prompt de evaluación → retorna retroalimentación estructurada: qué componentes están bien, cuáles faltan, cómo mejorar. Muestra resultado en panel lateral.
2. `"Ejecutar en IA"` → envía prompt completo a Claude API → muestra respuesta real en panel inferior
3. `"Guardar mi prompt"` → guarda en `progreso_alumno.prompt_maestro`

**SYSTEM PROMPT DEL EVALUADOR (para Claude API):**
```
Eres un evaluador pedagógico del curso iAprende Nivel 1. 
Analiza el prompt del participante y evalúa si contiene los 5 componentes 
de la Estructura Maestra: ROL, CONTEXTO, INSTRUCCIÓN, RESTRICCIONES, FORMATO.
Para cada componente indica: Presente / Ausente / Puede mejorar.
Da retroalimentación específica y constructiva en máximo 100 palabras.
Responde en JSON con esta estructura:
{"componentes": {"ROL": "presente|ausente|mejorar", ...}, 
 "puntuacion": 0-5, 
 "retroalimentacion": "texto"}
```

**ALMACENAMIENTO:** `progreso_alumno/{userId}_{cursoId}.prompt_maestro`  
**PANEL INSTRUCTOR:** El prompt de cada alumno visible en tiempo real en `ImpartirCurso`.

---

#### BLOQUE M2.9 — Evaluación Formativa (50%)
```
FUENTE:       Slide 22 del PDF · Manual del Participante p.17-18
MÓDULO:       modulo-2
ORDEN:        23
TIPO:         checklist
DURACIÓN:     10 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 22 + manual p.17):**

Título: `Mi Prompt Maestro Completo`  
Subtítulo: *Evaluación Formativa · 50% de tu calificación*

Instrucción: *7 min individuales · 3 min puesta en común · 60 puntos máx (10 por criterio)*

6 criterios como checklist interactivo (del slide 22):
1. ROL incluye profesión + especialidad + años de experiencia
2. CONTEXTO describe empresa, objetivo y datos relevantes
3. INSTRUCCIÓN empieza con verbo imperativo
4. RESTRICCIONES están explícitas (longitud, tono, alcance)
5. FORMATO especifica estructura de salida
6. El prompt resuelve un proceso real de tu Bitácora

Para acreditar: *Necesitas al menos 4 de los 6 criterios presentes.*

**INTERACTIVO:**  
- Al marcar 4+: badge verde animado `"✓ Listo para acreditar"` + barra de progreso al 50%
- Al marcar menos de 4: indicador naranja con mensaje específico de qué corregir
- Notificación push al instructor con el prompt y checklist del alumno

**ALMACENAMIENTO:** `progreso_alumno/{userId}_{cursoId}.calificacion_formativa`

---

### ▸ MÓDULO III — Sesgos, Alucinaciones y Ética (Slides 23–27)

---

#### BLOQUE M3.0 — Portada Módulo III
```
FUENTE:       Slide 23 del PDF
MÓDULO:       modulo-3
ORDEN:        24
TIPO:         portada
DURACIÓN:     1 min
ESTADO:       [ ]
```

**CONTENIDO:**  
Badge: `MÓDULO III`  
Título: `Sesgos, Alucinaciones y Ética`  
Subtítulo: *Tu filtro humano es la última línea de defensa*  
Meta: `15 minutos · 3 lecciones + discusión · Técnica: Diálogo-Discusión`

---

#### BLOQUE M3.1 — Alucinaciones
```
FUENTE:       Slide 24 del PDF · Manual del Participante p.13
MÓDULO:       modulo-3
ORDEN:        25
TIPO:         simulador_html
DURACIÓN:     5 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 24 + manual p.13):**

Título: `¿Qué es una Alucinación en IA?`  
Subtítulo: *Cuando la IA inventa datos que suenan creíbles*

Definición (manual p.13):  
*Una 'alucinación' en IA ocurre cuando el modelo genera información que parece completamente plausible y bien redactada, pero que es factualmente incorrecta o simplemente inventada.*

3 causas (slide 24):
1. **Contexto insuficiente** — No diste suficiente información para responder con precisión
2. **Prompt mal definido** — La instrucción es vaga o ambigua
3. **Datos poco comunes** — El modelo no tenía suficiente data de entrenamiento

Ejemplo del manual p.13:
- Pregunta sin contexto: *"¿Cuál es el precio actual del dólar en México?"*
- Respuesta con alucinación: *"El tipo de cambio actual es de $17.85 pesos por dólar."* (Dato inventado o desactualizado)
- Solución: *Siempre que necesites datos actuales, verifica en fuentes oficiales. Usa la IA para analizar datos que TÚ le proporcionas, no para obtener datos que no están en su ventana de contexto.*

**INTERACTIVO — Detector de Alucinación (gamificado):**  
- Se presenta un prompt vago y una respuesta de IA con 3 afirmaciones
- Una de las 3 afirmaciones es una alucinación obvia (dato inventado)
- El participante debe identificar cuál es la alucinación tocándola
- Correcto: puntos + explicación de por qué es alucinación
- Incorrecto: explicación de qué la hace real o falsa
- Implementación: HTML estático con 3 casos predefinidos, uno por intento

---

#### BLOQUE M3.2 — Tipos de Sesgos
```
FUENTE:       Slide 25 del PDF · Manual del Participante p.14
MÓDULO:       modulo-3
ORDEN:        26
TIPO:         texto_rico
DURACIÓN:     5 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 25 + manual p.14):**

Título: `Tipos de Sesgos en los Prompts`  
Subtítulo: *Distorsiones sistemáticas que heredas sin saberlo*

3 sesgos como acordeón expandible (slide 25 + manual p.14):

**Sesgo de Confirmación:**
- Qué es: Formulas la pregunta para que la IA te dé la respuesta que ya quieres escuchar.
- Ejemplo: *«¿Por qué esta estrategia es mejor?»* en lugar de *«Compara pros y contras»*
- Corrección: Formula la pregunta de manera neutral o pide explícitamente pros y contras.

**Sesgo Cultural:**
- Qué es: El modelo favorece perspectivas mayoritarias (mayormente anglosajonas) en sus datos.
- Ejemplo: Referencias que no aplican a Latinoamérica o a tu industria local.
- Corrección: *"Basa la respuesta en el contexto de México / norte de México / sector manufactura."*

**Sesgo de Autoridad (del manual p.14 — "Sesgo de Autoridad"):**
- Qué es: Das más peso a la respuesta solo porque "lo dijo la IA".
- Ejemplo: Publicar un dato estadístico sin verificarlo porque la IA lo presentó con confianza.
- Corrección: Valida datos importantes con fuentes humanas y primarias siempre.

---

#### BLOQUE M3.3 — El Filtro Humano
```
FUENTE:       Slide 26 del PDF · Manual del Participante p.14-15
MÓDULO:       modulo-3
ORDEN:        27
TIPO:         checklist
DURACIÓN:     4 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 26 + manual p.15):**

Título: `El Filtro Humano`  
Subtítulo: *La IA es la herramienta. Tú eres el responsable final.*

4 responsabilidades (slide 26):
- La veracidad de la información que publicas o entregas
- El impacto de los textos que generas
- El respeto a la privacidad de datos de terceros
- La transparencia sobre el uso de IA cuando sea relevante

Regla de Oro: *Nunca publiques, envíes ni tomes decisiones importantes con contenido generado por IA sin revisarlo tú mismo. La IA propone. Tú dispones.*

Los 3 principios del manual p.15:
1. **VERIFICAR:** Nunca publiques datos generados por IA sin verificarlos en fuentes primarias.
2. **PROTEGER:** Nunca incluyas datos personales reales de clientes, empleados o proveedores en un prompt.
3. **TRANSPARAR:** Cuando el contexto lo requiera, sé transparente sobre el uso de IA en tus producciones.

**INTERACTIVO — Toggle de compromiso:**  
Los 4 principios son toggles que el participante activa como compromiso personal. Al activar los 4: animación de confirmación.  
**ALMACENAMIENTO:** `progreso_alumno/{userId}_{cursoId}.auditoria_etica`

---

#### BLOQUE M3.4 — Caso Ético (Discusión Grupal)
```
FUENTE:       Slide 27 del PDF · Manual del Participante p.15
MÓDULO:       modulo-3
ORDEN:        28
TIPO:         caso_etico
DURACIÓN:     5 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 27):**

Título: `Discusión Grupal · Caso Ético`  
Subtítulo: *Equipos de 3-4 personas · 3 min de análisis · 2 min de puesta en común*

Caso (del slide 27):  
*Un empleado utiliza IA para redactar el reporte anual de la empresa. La IA inventa una cifra de ahorro energético del 23%. El reporte se publica en LinkedIn y circula entre clientes. Uno de ellos cita el dato en un contrato.*

3 preguntas:
1. ¿Quién es responsable del error: el empleado, la empresa o la IA?
2. ¿Qué controles habrían evitado que la cifra llegara al cliente?
3. ¿Qué harías si descubrieras el error después de publicado?

**INTERACTIVO — Respuestas colaborativas:**  
- Cada pregunta tiene un campo de texto editable
- En modo sesión grupal activa: las respuestas de todos los alumnos se agregan en Firestore en tiempo real y el instructor las ve en `ImpartirCurso`
- Al cerrar el bloque: se muestra un resumen anónimo de las respuestas del grupo

---

### ▸ EVALUACIÓN SUMATIVA (Slides 28–31)

---

#### BLOQUE S.0 — Portada Sumativa
```
FUENTE:       Slide 28 del PDF
MÓDULO:       sumativa
ORDEN:        29
TIPO:         portada
DURACIÓN:     1 min
ESTADO:       [ ]
```

**CONTENIDO:**  
Badge: `EVALUACIÓN SUMATIVA`  
Título: `Tu Asistente IA Aplicado`  
Subtítulo: *50% de tu calificación · 2 partes: Práctica + Teoría*  
Meta: `10 minutos totales · Evaluación final del curso`

---

#### BLOQUE S.1 — Desafío del Asistente (Práctica)
```
FUENTE:       Slide 29 del PDF · Manual del Participante p.19-20
MÓDULO:       sumativa
ORDEN:        30
TIPO:         simulador_prompt
DURACIÓN:     6 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 29 + manual p.19):**

Título: `Parte I · El Desafío del Asistente`  
Instrucción: *«Contrata» a la IA para resolver el problema de tu Bitácora*

5 tipos de asistente como cards visuales seleccionables (slide 29):

| Opción | Asistente IA | Utilidad práctica |
|---|---|---|
| 1 | **Redactor Comercial** | Correos, propuestas, cotizaciones |
| 2 | **Analista de Datos** | Interpreta reportes y cifras |
| 3 | **Coach de Producto** | Entrevistas de clientes, features |
| 4 | **Editor de Contenido** | Redes sociales, blog, marketing |
| 5 | **Consultor de Procesos** | Diagnóstico y mejora operativa |

El editor de prompt (mismo componente `simulador_prompt` del Bloque M2.8) se abre con el proceso de la Bitácora pre-cargado. El alumno construye su prompt final.

**ALMACENAMIENTO:** `progreso_alumno/{userId}_{cursoId}.prompt_maestro` (sobreescribe o crea v2)

---

#### BLOQUE S.2 — Validación de Conceptos (Teoría)
```
FUENTE:       Slide 30 del PDF · Manual del Participante p.20
MÓDULO:       sumativa
ORDEN:        31
TIPO:         cuestionario
DURACIÓN:     3 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 30 + manual p.20):**

Título: `Parte II · Validación de Conceptos`  
Instrucción: *3 preguntas · Selecciona la mejor opción*

Preguntas con respuestas correctas:

**1. ¿Por qué es mejor pedirle a la IA que «actúe como un experto»?**  
a) Para que sea más educada  
b) ✓ Activa la arquitectura MoE y prioriza información relevante  
c) No tiene efecto real  

**2. La IA inventó un dato estadístico que no le proporcionaste. Esto se llama:**  
a) Creatividad computacional  
b) ✓ Una alucinación  
c) Un error de conexión  

**3. ¿Quién es el responsable final de la veracidad del contenido generado?**  
a) La empresa creadora de la IA  
b) La computadora  
c) ✓ El usuario (tú), como filtro humano  

**INTERACTIVO:** Animación de resultado inmediato por pregunta. Calificación automática: 1 punto por respuesta correcta (0–3 pts).

**ALMACENAMIENTO:** `progreso_alumno/{userId}_{cursoId}.calificacion_sumativa` (parcial)

---

#### BLOQUE S.3 — Auto-Auditoría Ética
```
FUENTE:       Slide 31 del PDF · Manual del Participante p.20
MÓDULO:       sumativa
ORDEN:        32
TIPO:         checklist
DURACIÓN:     1 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 31 + manual p.20):**

Título: `Auto-Auditoría Ética`  
Instrucción: *Antes de entregar tu Asistente, marca cada criterio*

5 toggles (del slide 31):
1. No solicito información que viole la privacidad de terceros
2. No genero contenido que pueda desinformar o dañar
3. Reviso y valido los datos antes de usarlos
4. Declaro el uso de IA cuando el contexto lo requiere
5. Mantengo el control humano sobre las decisiones importantes

Al activar los 5: animación de aprobación + texto: *"Tu Asistente está listo para operar de forma responsable."*

---

### ▸ CIERRE (Slides 32–34)

---

#### BLOQUE C.1 — Lo Que Te Llevas Hoy (Resumen Personalizado)
```
FUENTE:       Slide 32 del PDF + datos dinámicos del alumno
MÓDULO:       cierre
ORDEN:        33
TIPO:         resumen_personal
DURACIÓN:     3 min
ESTADO:       [ ]
```

**CONTENIDO BASE (slide 32):**

Título: `Lo Que Te Llevas Hoy`  
Subtítulo: *Herramientas concretas para aplicar desde mañana*

**CONTENIDO DINÁMICO — generado con datos del alumno en Firestore:**

```
Tu proceso elegido:    [progreso_alumno.bitacora[0].proceso]
Tu ROL construido:     [progreso_alumno.rol_construido]
Tu prompt guardado:    [progreso_alumno.prompt_maestro — preview 100 chars]
Tu calificación:       [formativa + sumativa]
Tu compromiso inicial: [progreso_alumno.compromisos_encuadre.compromiso]
```

Frase cierre (del slide 32): *"Primero te enseñamos a pensar con IA. Después construyes con ella."*

---

#### BLOQUE C.2 — Siguientes Pasos · 72 Horas
```
FUENTE:       Slide 33 del PDF
MÓDULO:       cierre
ORDEN:        34
TIPO:         checklist
DURACIÓN:     3 min
ESTADO:       [ ]
```

**CONTENIDO A TRANSCRIBIR (slide 33):**

Título: `Siguientes Pasos · 72 Horas`  
Subtítulo: *Para que lo aprendido no se pierda*

3 compromisos con timer (slide 33):

**24 h — Aplica tu prompt 3 veces**  
Con tres variaciones del contexto. Afina lo que funciona.

**48 h — Construye 2 asistentes más**  
Para otros procesos de tu Bitácora. Crea tu biblioteca personal.

**72 h — Comparte con un colega**  
Enséñale a alguien de tu equipo. Enseñar es la mejor forma de fijar.

**INTERACTIVO:**  
Checklist persistente. El alumno puede regresar a la app en los próximos 3 días y marcar cada compromiso completado. El estado se guarda en Firestore.  
**ALMACENAMIENTO:** `progreso_alumno/{userId}_{cursoId}.compromisos_72h`

---

#### BLOQUE C.3 — Ecosistema iAprende y Siguiente Nivel
```
FUENTE:       Slide 34 del PDF + NUEVO (mapa de ecosistema)
MÓDULO:       cierre
ORDEN:        35
TIPO:         mapa_ecosistema
DURACIÓN:     3 min
ESTADO:       [ ]
```

**CONTENIDO BASE (slide 34):**

Texto de cierre: *"Acabas de construir una herramienta real."*  
Datos de contacto: WhatsApp · 866 116 0704 · osiel.perales@desarrolloselaborados.com

**CONTENIDO NUEVO — Mapa de Ecosistema:**

Los 3 Pilares nuevamente, ahora con cursos mapeados en cada uno:

**Pilar 1 — Democratización:** Curso avanzado de consulta estratégica y pensamiento sistémico con IA
**Pilar 2 — Automatización (aquí estuviste):** ✓ Este curso · Próximo: Automatización de procesos específicos por industria
**Pilar 3 — Amplificación Humana:** Agentes de IA · Flujos multi-modelo · Orquestación colaborativa

CTA principal: `[WhatsApp 866-116-0704]` — botón directo a chat

---

## RESUMEN DE ESTADO DE IMPLEMENTACIÓN

| Bloque | Tipo | Fuente | Estado |
|---|---|---|---|
| P.1 — 3 Pilares | infografia | NUEVO | [ ] |
| E.1 — Bienvenida | texto_rico | Slide 2 | [ ] |
| E.2 — Objetivo General | texto_rico | Slide 3 | [ ] |
| E.3 — Mapa del Curso | infografia | Slide 4 + NUEVO | [ ] |
| E.4 — Expectativas | tabla_editable | Slide 5 | [ ] |
| E.5 — Diagnóstica | cuestionario | Slide 6 | [ ] |
| M1.0 — Portada I | portada | Slide 7 | [ ] |
| M1.1 — Buscadores vs Motores | comparador | Slide 8 | [ ] |
| M1.2 — Tokens | simulador_html | Slide 9 | [ ] |
| M1.3 — MoE | simulador_html | Slide 10 | [ ] |
| M1.4 — 3 Modos de Uso | tarjetas_flip | NUEVO | [ ] |
| M1.5 — Puntos de Dolor | checklist | Slide 11 | [ ] |
| M1.6 — Bitácora | tabla_editable | Slide 12 | [ ] |
| M2.0 — Portada II | portada | Slide 13 | [ ] |
| M2.1 — 5 Componentes | infografia | Slide 14 | [ ] |
| M2.2 — ROL | campo_libre | Slides 15-16 | [ ] |
| M2.3 — CONTEXTO | campo_libre | Slide 17 | [ ] |
| M2.4 — INSTRUCCIÓN | simulador_html | Slide 18 | [ ] |
| M2.5 — FORMATO + Multimodal | texto_rico | Slide 19 + NUEVO | [ ] |
| M2.6 — RESTRICCIONES | texto_rico | Slide 20 | [ ] |
| M2.7 — Demo Prompt | simulador_html | Slide 21 | [ ] |
| M2.8 — Simulador Prompt ★ | simulador_prompt | NUEVO | [ ] |
| M2.9 — Formativa 50% | checklist | Slide 22 | [ ] |
| M3.0 — Portada III | portada | Slide 23 | [ ] |
| M3.1 — Alucinaciones | simulador_html | Slide 24 | [ ] |
| M3.2 — Sesgos | texto_rico | Slide 25 | [ ] |
| M3.3 — Filtro Humano | checklist | Slide 26 | [ ] |
| M3.4 — Caso Ético | caso_etico | Slide 27 | [ ] |
| S.0 — Portada Sumativa | portada | Slide 28 | [ ] |
| S.1 — Desafío Asistente | simulador_prompt | Slide 29 | [ ] |
| S.2 — Teoría 3 preguntas | cuestionario | Slide 30 | [ ] |
| S.3 — Auto-Auditoría | checklist | Slide 31 | [ ] |
| C.1 — Resumen Personal | resumen_personal | Slide 32 + dinámico | [ ] |
| C.2 — 72 Horas | checklist | Slide 33 | [ ] |
| C.3 — Ecosistema | mapa_ecosistema | Slide 34 + NUEVO | [ ] |

**Total: 35 bloques · 9 tipos distintos · 4 bloques completamente nuevos · 3 bloques ampliados**

---

## COMPONENTES REACT A CREAR / REGISTRAR

```typescript
// src/components/bloques/
├── BloquePortada.tsx          // existe o trivial
├── BloqueTextoRico.tsx        // existe
├── BloqueComparador.tsx       // existe o trivial
├── BloqueInfografia.tsx       // NUEVO — zonas expandibles con tap
├── BloqueTarjetasFlip.tsx     // NUEVO — flip cards
├── BloqueTablaEditable.tsx    // NUEVO — tabla con campos + Firestore write
├── BloqueChecklist.tsx        // existe o trivial
├── BloqueCuestionario.tsx     // existe
├── BloqueCampoLibre.tsx       // existe o trivial
├── BloqueSimuladorHtml.tsx    // existe
├── BloqueSimuladorPrompt.tsx  // NUEVO — componente estrella (Claude API)
├── BloqueCasoEtico.tsx        // NUEVO — respuestas colaborativas Firestore
└── BloqueResumenPersonal.tsx  // NUEVO — genera resumen dinámico del alumno
```

---

*Documento generado: Abril 2026 · Desarrollos Elaborados · iAprende*  
*Actualizar el campo `ESTADO` de cada bloque conforme se implemente en Antigravity / Claude Code*
