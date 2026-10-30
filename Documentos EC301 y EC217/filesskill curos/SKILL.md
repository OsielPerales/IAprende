---
título: Producción de Cursos CONOCER · EC0301 + EC0217.01
tipo: skill_maestra
estado: activo
versión: 1.0
creado: 2026-04-18
autor: Osiel Alejandro Perales Jiménez · Desarrollos Elaborados
certificación: EC0301 vía B Smarter (ECE)
tags: [skill, conocer, ec0301, ec0217, iaprende, produccion-cursos]
---

# SKILL · Producción de Cursos CONOCER

**Entry point de la skill.** Esta skill produce, dado un nombre de curso y 3 temas, el paquete completo de artefactos requeridos por los estándares **EC0301** (Diseño de cursos) y **EC0217.01** (Impartición de cursos) de CONOCER, con adaptación obligatoria a la plataforma iAprende y slides duales (Markdown + .pptx).

---

## 1 · Invocación

La skill se invoca cuando el usuario solicita la producción, diseño o generación de un curso nuevo bajo estándar CONOCER, iAprende, o Desarrollos Elaborados (DE). Frases gatillo:

- "Genera el curso de …"
- "Prepara un curso EC0301 sobre …"
- "Necesito un curso iAprende nivel N sobre …"
- "Produce los documentos CONOCER para …"

**Duración canónica del curso producido:** 120 minutos (caso modelo). Distribución fija: Apertura 35′ / Desarrollo 65′ / Cierre 25′ — ver [[references/tiempos-canonicos-120min]].

---

## 2 · Input mínimo

La skill arranca con **dos datos**:

1. **Nombre del curso** (ej. `"IA Estratégica y Diseño de Instrucciones Proactivas"`)
2. **Tres temas** que definen los 3 módulos (M-I, M-II, M-III)

Todo lo demás la skill lo infiere, propone o pregunta en turnos posteriores.

---

## 3 · Output esperado (9 documentos + adaptación + slides = 12 artefactos)

| # | Artefacto | EC0301 | EC0217.01 | Template |
|---|---|:-:|:-:|---|
| 1 | Documento de Planeación del Curso (carta descriptiva) | ✓ | ✓ | [[templates/01-planeacion-carta-descriptiva]] |
| 2 | Lista de Verificación de Requerimientos | — | ✓ | [[templates/02-lista-verificacion-requerimientos]] |
| 3 | Evaluación Diagnóstica | ✓ | ✓ | [[templates/03-eval-diagnostica]] |
| 4 | Evaluación Formativa (Guía de Observación / Lista de cotejo) | ✓ | ✓ | [[templates/04-eval-formativa-guia-observacion]] |
| 5 | Evaluación Sumativa / Final (Proyecto + Rúbrica) | ✓ | ✓ | [[templates/05-eval-sumativa-proyecto-rubrica]] |
| 6 | Evaluación de Satisfacción | embebida en Manual Inst. | ✓ doc suelto | [[templates/06-eval-satisfaccion]] |
| 7 | Manual del Participante | ✓ | — | [[templates/07-manual-participante]] |
| 8 | Manual del Instructor | ✓ | — | [[templates/08-manual-instructor]] |
| 9 | Informe Final | — | ✓ | [[templates/09-informe-final-ec0217]] |
| 10 | Hoja de Adaptación iAprende (bloques + Firestore) | — | — | [[templates/10-hoja-adaptacion-iaprende]] |
| 11 | Storyboard de Slides (Markdown revisable) | — | — | [[templates/11-storyboard-slides]] |
| 12 | Slides finales (.pptx) | — | — | [[templates/12-slides-pptx-brief]] |

Ver matriz completa de cobertura en [[references/entregables-matriz]].

---

## 4 · Flujo de 7 turnos

La skill **no produce todo en un solo turno**. Opera en un pipeline multi-turno con humano en el loop. Cada turno tiene un script asociado en `scripts/`.

```
T1  [Usuario]    → Nombre + 3 temas
T2  [Claude]     → Propuesta estructural:
                     · 3 módulos × 3–4 lecciones
                     · apoyos pedagógicos por lección (tipo bloque iAprende + interactivo)
                     · caso ancla del dominio
                     · objetivos draft Mager
                     · reparto de tiempos 35/65/25
                   Script: scripts/f1-proponer-estructura.md
T3  [ask_user]   → Valida o ajusta estructura/caso/nivel del grupo
                   Script: scripts/f2-validar-con-usuario.md
T4  [Claude+web] → web_search por cada tema → detecta actualizaciones y
                   artículos citables (≥3 fuentes vivas)
                   Script: scripts/f3-verificar-actualidad-web.md
T5  [ask_user]   → Confirma bibliografía viva, aprueba pasar a despacho
T6  [Claude]     → Emite 6 prompts de despacho (uno por agente) listos
                   para ejecutar en Antigravity/Claude Code
                   Scripts: scripts/f4 a f9
T7  [Claude]     → Checklist final de cumplimiento EC0301 + EC0217.01
                   cruzado con los 12 artefactos producidos
                   Script: scripts/f10-empaquetar-y-checklist.md
```

---

## 5 · Arquitectura de agentes

Los turnos T6–T7 no se ejecutan en el chat con Claude. El chat **emite prompts** que el usuario ejecuta en Antigravity / Claude Code localmente. Cada agente produce un artefacto:

| Agente | Produce | Prompt de despacho |
|---|---|---|
| `agent-planeacion` | Planeación + Lista verificación + Informe final (1+2+9) | [[agents/agent-planeacion]] |
| `agent-manual-participante` | Manual del Participante (7) | [[agents/agent-manual-participante]] |
| `agent-manual-instructor` | Manual del Instructor con encuesta satisfacción embebida (8 + 6 embebido) | [[agents/agent-manual-instructor]] |
| `agent-evaluaciones` | Diagnóstica + Formativa + Sumativa + Satisfacción suelta (3+4+5+6) | [[agents/agent-evaluaciones]] |
| `agent-iaprende-bloques` | Hoja de Adaptación iAprende 35-bloque style (10) | [[agents/agent-iaprende-bloques]] |
| `agent-slides` | Storyboard MD + .pptx (11+12) | [[agents/agent-slides]] |

Cada agente recibe como input el JSON compacto producido en T2–T5 y genera su artefacto contra el template correspondiente.

---

## 6 · Reglas duras (non-negotiable)

1. **Objetivos siempre en forma Mager** — Sujeto + Acción (verbo taxonomía Bloom) + Condición + Límite de calidad/tiempo. Ver [[references/redaccion-objetivos-mager]].
2. **Calificación mínima aprobatoria: 80 %.** Distribución fija: Diagnóstica referencial (0 %) + Formativa 50 % + Sumativa 50 %.
3. **Tres técnicas instruccionales CONOCER obligatorias** — Expositiva dialogada (M-I), Demostrativa en vivo (M-II), Diálogo-Discusión (M-III). Más Rompe Hielo, Energizante y Cierre. Ver [[references/tecnicas-instruccionales]].
4. **Caso ancla transversal.** Un solo caso de negocio recorre los 3 módulos para dar continuidad didáctica (patrón "Panadería Pan de Casa" del caso modelo). Ver [[assets/canonicos/caso-ancla-panaderia]].
5. **Saber Convivir como objetivo transversal** — obligatorio por EC0301, en columna "Temas" de la planeación.
6. **Bibliografía viva** — mínimo 3 fuentes citables actualizadas vía web_search en T4. Mínimo 1 referencia CONOCER / estándar oficial.
7. **Branding iAprende + Desarrollos Elaborados.** B Smarter aparece solo como ECE certificador en pie legal, NO en portadas ni encabezados. Ver [[assets/branding/portadas-firmas]].
8. **Auto-auditoría ética** — obligatoria en la Evaluación Sumativa (3 preguntas mínimo).
9. **Adaptación iAprende obligatoria** — todo curso produce su hoja de 35–40 bloques mapeados a Firestore. Ver [[references/firestore-iaprende-schema]].
10. **Sin errores ortográficos** — criterio EC0301/EC0217 literal. Revisión final antes de marcar artefacto como completo.

---

## 7 · Orden de lectura para Claude al invocar la skill

1. Leer este `SKILL.md` (ya estás aquí).
2. Leer `references/entregables-matriz.md` para confirmar alcance.
3. Leer `references/patrones-estructurales.md` para entender qué extraer del input del usuario.
4. Leer `scripts/f1-proponer-estructura.md` y ejecutar T2.
5. Esperar input del usuario (T3). Continuar secuencia.

Durante cualquier turno, consultar references puntuales cuando:
- Hay duda sobre criterios CONOCER → `ec0301-criterios-evaluacion.md` o `ec0217-criterios-evaluacion.md`
- Hay duda sobre redacción de objetivos → `redaccion-objetivos-mager.md`
- Hay duda sobre distribución de tiempos → `tiempos-canonicos-120min.md`
- Hay duda sobre tipos de bloque iAprende → `firestore-iaprende-schema.md`
- Hay duda sobre técnicas instruccionales → `tecnicas-instruccionales.md`

---

## 8 · Caso modelo de referencia

El curso **"IA Estratégica y Diseño de Instrucciones Proactivas"** v2.0 (2h, presencial, certificado EC0301 vía B Smarter) es el ground truth estructural. Ubicación de los 4 artefactos modelo en Drive:

- Manual Participante · `id 1AgAluyVXho6A27M-NGW4aic4eQk8CF1CiNrHT4aWwik`
- Manual Instructor · `id 1n8C6nRq72Wx0BBRvLxog-NIqhPDf4n32mlmYLzVT5Bc`
- Planeación v4 · `id 1WhpNuHLbivAqB6EkJTEVpnyeXWkdN4BA`
- VERIFICACION iAprende N1 v2 · vault local Obsidian

Apuntadores en [[assets/ejemplos-apuntadores/curso-modelo-ia-estrategica]].

---

## 9 · Política de iteración

Cada curso nuevo producido por esta skill debe, al completarse:

1. Pasar por revisión del usuario antes de ser declarado listo para impartir.
2. Ejecutarse al menos una vez en piloto presencial.
3. Documentar en un archivo `VERIFICACION_CURSO_<slug>_v<n>.md` en el vault (patrón del caso modelo) los 35–40 bloques implementados en iAprende.
4. Actualizar esta skill si se encuentran patrones nuevos que generalizar.

**Principio Skin in the Game:** ningún curso se vende ni certifica sin haber sido probado primero en DE o CYD CNC.

---

*SKILL terminada. Iniciar en `scripts/f1-proponer-estructura.md` al recibir input del usuario.*
