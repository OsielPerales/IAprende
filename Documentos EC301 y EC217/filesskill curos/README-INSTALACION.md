# Skill · Producción de Cursos CONOCER EC0301 + EC0217.01

Skill maestra para Desarrollos Elaborados / iAprende que produce, dado un nombre de curso y 3 temas, el paquete completo de 12 artefactos requeridos por los estándares CONOCER EC0301 (Diseño) y EC0217.01 (Impartición), más adaptación a la plataforma iAprende y slides finales.

---

## Instalación en el vault Obsidian

1. Descomprimir este paquete en el vault Obsidian de DE.
2. Copiar la carpeta `conocer/` dentro de `_skills/`. Ruta final esperada:

```
<vault-DE>/_skills/conocer/
  ├── SKILL.md                    ← entry point
  ├── README-INSTALACION.md       ← este archivo
  ├── references/                 (10 archivos · conocimiento normativo)
  ├── templates/                  (12 archivos · plantillas rellenables)
  ├── scripts/                    (10 archivos · prompts por fase del flujo)
  ├── agents/                     (6 archivos · identidad de cada agente)
  └── assets/
      ├── branding/               (3 archivos)
      ├── canonicos/              (3 archivos)
      └── ejemplos-apuntadores/   (2 archivos)
```

3. Abrir `_skills/conocer/SKILL.md` en Obsidian y verificar que los `[[wikilinks]]` resuelven correctamente a los 46 archivos restantes.

---

## Uso rápido desde Claude

Cuando quieras producir un curso nuevo:

```
Osiel: Genera un curso EC0301 llamado "{NOMBRE}" con estos 3 temas:
       1. {TEMA 1}
       2. {TEMA 2}
       3. {TEMA 3}
```

La skill arranca el flujo de 7 turnos:

| Turno | Quién | Qué pasa |
|:-:|---|---|
| T1 | Usuario | Input: nombre + 3 temas |
| T2 | Claude | Propuesta estructural (módulos, lecciones, apoyos pedagógicos, caso ancla, objetivos draft) |
| T3 | Usuario | Valida o ajusta (ask_user_input_v0) |
| T4 | Claude + web | Verificación en línea + bibliografía viva (≥3 fuentes) |
| T5 | Usuario | Confirma bibliografía |
| T6 | Claude | Emite 5 prompts de despacho para ejecutar en Antigravity |
| T7 | Claude | Checklist final EC0301 + EC0217.01 |

El detalle de cada turno está en `scripts/f1` a `scripts/f10`.

---

## Inventario de la skill (47 archivos)

### SKILL.md
Entry point con flujo, reglas duras, arquitectura de agentes.

### references/ (10)
Conocimiento normativo, no se modifica al producir un curso:
- `ec0301-criterios-evaluacion.md` · Los 3 elementos E1023/E1024/E1025 con todos los sub-criterios literales del PDF oficial CONOCER
- `ec0217-criterios-evaluacion.md` · Entregables EC0217.01
- `entregables-matriz.md` · Matriz 9 docs × 2 estándares
- `patrones-estructurales.md` · Invariantes extraídos del corpus modelo
- `tiempos-canonicos-120min.md` · Reparto 35/65/25 con etapas finas
- `tecnicas-instruccionales.md` · 3 técnicas CONOCER + 3 grupales
- `redaccion-objetivos-mager.md` · Sujeto+Acción+Condición+Límite
- `evaluaciones-y-rubricas.md` · Patrones de los 4 instrumentos
- `firestore-iaprende-schema.md` · 14 tipos de bloque + colecciones
- `glosario-conocer.md` · 20+ términos oficiales

### templates/ (12)
Plantillas rellenables, una por artefacto:
- 01 Planeación / Carta descriptiva
- 02 Lista de Verificación de Requerimientos
- 03 Evaluación Diagnóstica
- 04 Evaluación Formativa (Guía de Observación)
- 05 Evaluación Sumativa (Proyecto + Rúbrica)
- 06 Evaluación de Satisfacción
- 07 Manual del Participante (18 secciones)
- 08 Manual del Instructor (14 secciones)
- 09 Informe Final (EC0217.01 post-impartición)
- 10 Hoja de Adaptación iAprende (35-40 bloques Firestore)
- 11 Storyboard de Slides (Markdown revisable)
- 12 Slides .pptx (brief para skill pptx)

### scripts/ (10)
Prompts por fase del flujo conversacional:
- f1 Proponer estructura
- f2 Validar con usuario
- f3 Verificar actualidad web
- f4 Generar objetivos Mager
- f5 Despacho agent-planeacion
- f6 Despacho agent-evaluaciones
- f7 Despacho agent-manuales (dos en uno)
- f8 Despacho agent-iaprende-bloques
- f9 Despacho agent-slides
- f10 Empaquetar y checklist final

### agents/ (6)
Identidad y reglas de cada agente que se ejecuta en Antigravity:
- agent-planeacion (produce artefactos 1+2+9)
- agent-manual-participante (7)
- agent-manual-instructor (8, con satisfacción embebida)
- agent-evaluaciones (3+4+5+6)
- agent-iaprende-bloques (10)
- agent-slides (11+12)

### assets/
Recursos estáticos compartidos por toda la skill:

`branding/` (3):
- paleta-tipografia-DE-iAprende.md · colores + fuentes oficiales
- portadas-firmas.md · patrón de portadas sin B Smarter
- pie-legal-creditos.md · mención B Smarter solo como ECE certificador

`canonicos/` (3):
- caso-ancla-panaderia.md · plantilla de caso transversal
- verbos-accion-fuertes.md · verbos Bloom por dominio
- banco-sesgos-y-alucinaciones.md · casos para Módulo III

`ejemplos-apuntadores/` (2):
- curso-modelo-ia-estrategica.md · apuntador al ground truth (Drive IDs)
- curso-modelo-bsmarter-estilos.md · referencia cruzada del ECE

---

## Qué necesita Claude para operar esta skill

1. Acceso al vault Obsidian (conector Obsidian o lectura manual de archivos).
2. `web_search` activo (para T4 verificación en línea).
3. `ask_user_input_v0` activo (para T3 y T5).
4. Conector Google Drive activo (opcional, para leer el corpus modelo).

El **paso T6 (ejecución de agentes)** NO se corre en el chat de Claude — se hace en **Antigravity o Claude Code localmente**, donde Claude tiene acceso al sistema de archivos y puede escribir .md + .docx + .pptx en `/cursos/{slug}/`.

---

## Reglas duras (non-negotiable)

1. Objetivos en forma Mager completa (Sujeto + Acción + Condición + Límite).
2. Calificación mínima aprobatoria: 80 %. Distribución fija: Diagnóstica ref (0 %) + Formativa 50 % + Sumativa 50 %.
3. 3 técnicas CONOCER obligatorias (Expositiva M-I, Demostrativa M-II, Diálogo-Discusión M-III) + 3 grupales (Rompe Hielo, Energizante, Cierre).
4. Caso ancla transversal — un solo caso recorre los 3 módulos.
5. Saber Convivir como objetivo transversal (obligatorio EC0301).
6. Bibliografía viva — ≥3 fuentes citables actualizadas en últimos 24 meses.
7. Branding iAprende + Desarrollos Elaborados. B Smarter solo en pie legal como ECE.
8. Auto-auditoría ética en Sumativa (3+ items).
9. Adaptación iAprende obligatoria (35-40 bloques Firestore).
10. Cero errores ortográficos (criterio literal EC0301/EC0217).

---

## Principio Skin in the Game

Ningún curso producido por esta skill se vende ni se certifica sin haber sido **impartido primero como piloto en Desarrollos Elaborados o Corte y Diseño CNC**. El paso `f10-empaquetar-y-checklist.md` recuerda este principio al cierre de cada producción.

---

## Mantenimiento de la skill

- **Frecuencia de revisión:** trimestral o tras cada cambio de versión de los estándares CONOCER.
- **Casos de actualización mayor:**
  - Cambio en EC0301 o EC0217.01 por parte de CONOCER
  - Feedback de Iván Téllez / B Smarter tras evaluación de un expediente
  - Aparición de un nuevo tipo de bloque en iAprende (actualizar references/firestore-iaprende-schema.md)
  - Nuevos modelos de IA o herramientas que cambien el corpus del curso modelo IA Estratégica

---

*Skill v1.0 · Abril 2026 · Desarrollos Elaborados · iAprende · Osiel Alejandro Perales Jiménez*
*Certificación operada por B Smarter (ECE CONOCER · Iván Téllez López evaluador)*
