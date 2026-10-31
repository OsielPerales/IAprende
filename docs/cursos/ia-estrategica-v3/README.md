# IA Estratégica y Diseño de Instrucciones Proactivas — piloto interactivo v3.0

**Fecha:** 2026-10-30  
**Estado:** borrador técnico-pedagógico, `publicado: false`  
**Fuente de bloques:** [`src/store/cursoIAInteractivoV3.ts`](../../../src/store/cursoIAInteractivoV3.ts)  
**Curso de referencia:** `src/store/seedCursoIA.ts` + `Documentos EC301 y EC217/VERIFICACION_CURSO_N1_v2.md` (sin reemplazarlos).

## Resultado observable

El participante **diseñará, probará y revisará** una instrucción repetible para una tarea real, con contexto sintético, salida verificable y tres pruebas (caso normal, datos faltantes y entrada adversarial), y documentará por lo menos una corrección fundada. El instructor comprobará utilidad, verificabilidad y uso responsable mediante una rúbrica; una conversación vistosa con IA no basta para demostrar el logro.

**Audiencia:** personal operativo, pequeños negocios, emprendedores y administrativos con conocimientos digitales básicos.  
**Modalidad prevista:** presencial con apoyo móvil/iAprende, 135 minutos.  
**Caso ancla:** taller ficticio de fabricación personalizada que responde solicitudes de cotización sin inventar precios. Se permite una variante de tarea de cada participante siempre que no incorpore datos confidenciales reales.

## Mapa de tiempos y actividades

| Etapa | Minutos | Experiencias | Evidencia |
|---|---:|---|---|
| Encuadre | 15 | Filosofía, objetivo de desempeño, diagnóstico, modos de uso | Línea base (sin ponderación) |
| Explorar | 25 | Comparador de búsqueda/generación, corrección de mitos, simulador, tarjetas, bitácora | Proceso elegido y oportunidades |
| Diseñar | 55 | Plantilla de 5 piezas, campos rol/contexto, simulaciones, comparadores, prompt revisado, cuestionario | Instrucción editable + pruebas diseñadas |
| Validar | 20 | Verificación de datos, auditor, dilema ético grupal, checklist | Criterios de seguridad y validación |
| Cierre | 20 | Proyecto integrador, evaluación de conceptos, resumen personalizado, transferencia | Producto final y plan de aplicación |
| **Total** | **135** | **33 bloques** | |

Los bloques son unidades didácticas, no 33 diapositivas que deban leerse. La modalidad presencial integra diálogo, demostración y revisión entre pares. El desglose exacto de minutos por bloque consta en `mapaDidacticoIAInteractivoV3`.

## Secuencia de aprendizaje

1. **Detectar un problema del trabajo:** escribir tres tareas en la bitácora `bitacora`; elegir una mediante criterios de utilidad y riesgo.
2. **Construir el primer borrador:** guardar `rol_construido` y `contexto_construido` con el formulario disponible.
3. **Diseñar una salida reproducible:** especificar tarea, restricciones, formato y criterios para pedir datos faltantes.
4. **Probar tres escenarios:** A (normal), B (sin datos suficientes), C (adversarial o solicitud inapropiada).
5. **Revisar y corregir:** registrar una falla concreta con su cambio; guardar la versión final en `prompt_maestro`.
6. **Revisar con otra persona:** explicar el resultado y discutir riesgos/criterios de aprobación.
7. **Transferir:** recuperar el resumen personal, conservar pruebas por separado y aplicar en una tarea autorizada dentro de 72 horas.

### Interacción real vs. interacción simulada

| Interacción | En el prototipo | Persistencia |
|---|---|---|
| Comparador drag/drop | Ejercicio en la interfaz existente | No es evidencia guardada |
| Tarjetas flip / infografía | Exploración visual | No es evidencia guardada |
| Simuladores HTML | Ejercicios locales autocontenidos, sin llamadas remotas | No guardan intentos |
| Tabla de oportunidades | `BloqueTablaEditable` existente | Guarda en `progreso_alumno.bitacora` |
| Campos rol / contexto / versión | `BloqueCampoLibre` existente | Guardan en los campos tipados indicados |
| Simulador de prompts | Componente preexistente; puede caer en modo demo | **No confiar en una puntuación demo** |
| Cuestionarios | Respuestas enviadas a colección `respuestas` | Revisar confirmación y calificación real |
| Caso ético | Componente actual envía respuestas a Firestore | Verificar reglas, consentimiento y visibilidad |
| Resumen personalizado | Recupera rol/contexto/prompt del progreso | Muestra lo que se guardó |

**Importante:** incluir un componente interactivo NO significa que su resultado sea recuperable o que haya sido evaluado automáticamente. Los simuladores de HTML de este curso indican explícitamente que son prácticas locales. El componente de prompts consulta `evaluatePromptFn` y `executePromptFn`; esos exports no aparecen en `functions/src/index.ts` de la rama revisada, por lo que las evaluaciones de IA pueden quedar en modo demo. No presentar resultados simulados como una calificación oficial.

## Evaluación de aprendizaje

La meta **80/100** y el reparto **50% formativa + 50% sumativa** son **decisiones internas de esta edición del taller**; no deben atribuirse como ponderaciones obligatorias a EC0301 o EC0217.01.

- **Diagnóstico (0%):** tres preguntas de entrada; el profesor observa ideas previas. Si la UI muestra un puntaje o ruta adaptativa, se identifica como *orientativo* y no se usa para acreditación.
- **Formativa (50% del resultado interno):** respuesta a cuatro preguntas de 25 puntos **más** revisión del proceso elegido y de la versión de trabajo. La nota debe confirmarse contra las evidencias; no basta con el puntaje visual del `AdaptiveResult`.
- **Sumativa (50% del resultado interno):** proyecto de 100 puntos conforme a la rúbrica de abajo. El cuestionario final complementa la discusión; no sustituye la revisión del producto ni constituye por sí solo un 50%.
- **Calificación final:** 0.5 × formativa aprobada por el instructor + 0.5 × proyecto evaluado por el instructor; referencia de dominio a partir de 80/100. La aplicación **no automatiza todavía esta fórmula de manera fiable**.

### Rúbrica del proyecto (100 puntos)

| Criterio | Puntos | Evidencia verificable |
|---|---:|---|
| Problema y valor | 15 | Tarea, frecuencia, objetivo y criterio de éxito |
| Instrucciones y formato | 20 | Rol/contexto/tarea/restricciones/salida coherentes |
| Pruebas e iteración | 30 | Tres entradas, tres salidas o incidencias y al menos una corrección |
| Verificación factual | 20 | Precios, cálculos o hechos comprobados y pendientes identificados |
| Ética y privacidad | 15 | Datos ficticios, límites explícitos, control humano |
| **Total** | **100** | |

Para cada criterio, el maestro registra puntos otorgados, breve justificación y evidencia de soporte. Si el alumno no tiene acceso a un modelo real, documenta la prueba pendiente y se evalúa lo observable, **sin inventar resultados ni certificar que funciona**.

### Instrumento de prueba (para entregar fuera del simulador hasta crear registro genérico)

| Prueba | Entrada sintética | Resultado observado | Problema | Corrección | Segunda comprobación |
|---|---|---|---|---|---|
| A: normal | Cotización con todos los campos necesarios | | | | |
| B: incompleta | Falta precio/material/medida | | | | |
| C: adversarial | Solicitud de ignorar reglas o revelar datos | | | | |

## Actualizaciones técnicas y pedagógicas

- **Tokens:** ya no se equiparan a palabras ni se representa el tokenizador por espacios como medición real.
- **Mezcla de expertos:** no atribuir de manera general arquitecturas o números de expertos no verificados a todos los modelos; un «rol» no activa garantizadamente un subsistema interno.
- **Roles:** representan una estrategia de contextualización, no autoridad profesional ni garantía de precisión.
- **Prompts:** la estructura de cinco piezas es una *plantilla didáctica*, no una norma universal. Se añade validación y pruebas como práctica obligatoria.
- **Seguridad:** no incluir datos identificables de clientes; considerar inyección de instrucciones y aprobación humana.
- **Actualización de fuentes:** priorizar guías técnicas oficiales vigentes y criterios CONOCER; actualizar fecha/modelos antes de cada ciclo.

### Fuentes para el instructor

- OpenAI, *Prompt engineering*: https://developers.openai.com/api/docs/guides/prompt-engineering
- Anthropic, *Prompting best practices*: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables
- CONOCER, estándar **EC0301**: https://conocer.gob.mx/RENEC/fichaEstandar.do?idEstandar=1544&method=obtenerPDFEstandar
- CONOCER, estándar **EC0217.01**: https://www.conocer.gob.mx/contenido/publicaciones_dof/2021/EC0217.01.pdf

**Aviso:** estos estándares se refieren al diseño y la impartición presencial de cursos. Que el curso use sus criterios de calidad no significa certificación oficial, reconocimiento o aval. La comprobación del expediente se realiza por separado.

## Integración: NO modificar producción

El archivo de datos se exporta como `cursoIAInteractivoV3`, `bloquesIAInteractivoV3` y `mapaDidacticoIAInteractivoV3`. **No se importa** en `App.tsx`, no se habilita en una ruta, no reemplaza el seed v2, no activa cargas de Firestore ni realiza una migración automática. Está marcado `publicado: false`.

Para convertirlo en curso pilotable:

1. Ejecutar comprobación estática de IDs, tipos, secuencia y tiempos con `node scripts/validate-curso-ia-v3.mjs`.
2. Probar `npm ci && npm run build` y completar los tests de interfaz en un entorno local/DEV.
3. Revisar `firestore.rules` y los endpoints de IA/MCP; exigir autorización por usuario/curso, validación, límites y registro.
4. Crear un importador **explícito** a Firestore DEV con validación de esquema, `dry-run` inicial, ID de curso nuevo y prueba de rollback. No usar credenciales de producción en el repositorio ni ejecutar importaciones a producción sin aprobación.
5. Verificar las rutas **maestro y alumno** en móvil, guardado/relectura, navegación, reanudación, resultados de preguntas, caso ético y privacidad de datos entre grupos.
6. Corregir o desactivar la calificación demo y registrar rúbricas del proyecto con evidencia persistente antes de emitir calificaciones finales.
7. Impartir un piloto, recoger tiempos reales, dificultades y evidencia de aprendizaje, y ajustar la versión.

## Criterios de aceptación

- El alumno puede pausar, reanudar y recuperar `bitacora`, `rol_construido`, `contexto_construido` y `prompt_maestro`.
- El instructor puede localizar y revisar las evidencias del alumno autorizado.
- Cada simulador indica si es local/demo o usa IA real, sin puntuaciones engañosas.
- El curso usa ejemplos plausibles, sin cifras comerciales inventadas ni datos reales de terceros.
- Los contenidos funcionan en móvil, con controles accesibles por teclado/tacto.
- El producto final se puede copiar y se acompaña de pruebas y revisión humana.
- El curso original, las inscripciones existentes y producción permanecen intactos.

## Próximos desarrollos recomendados para escalar esta metodología

- `actividad_respuesta` genérica ligada a `bloque_id` y `curso_id`, no campos hard-coded por actividad.
- Registro de intentos, entradas, salidas, observaciones y versiones del prompt por alumno.
- Rúbrica persistente y motor de evaluación docente; prohibir fallback demo en calificaciones.
- Integración confiable de simuladores con la plataforma mediante mensajes validados y guardado autorizado (no escritura directa desde iframe arbitrario).
- Generación con IA de bloques variados y planes de evaluación, en vez de limitarse a `texto + cuestionario`.
