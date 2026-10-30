# Contraste de documentación y código — 30 de octubre de 2026

Base revisada: `7eb57d451bc097bf0bfae8e9546e931ed85ec65e` de `main`. Este informe describe las correcciones de la rama de revisión, sin afirmar que estén desplegadas.

| Documento / promesa | Diferencia observada | Solución |
|---|---|---|
| Hoja de producto: JWT en cada request | HTTP IA y MCP no verificaban ID token en sus handlers | Verificación con revocación y perfil protegido; cliente envía Bearer; MCP HTTP solo admin |
| Roles diferenciados | Perfil propio modificable y bootstrap admin por correo público | Alta solo alumno, edición de campos limitada y promoción por admin de confianza |
| Dashboard personal | Listeners completos chocaban con Rules por propietario | Consultas por alumno/destinatario y documento individual de analytics; limpieza al salir |
| Marcar notificaciones leídas | `keys().hasOnly(['leida'])` rechazaba el documento completo | Validación de campos cambiados con `diff()` |
| Progreso del primer acceso | Leer un documento inexistente podía denegarse | Lectura de ausencia permitida; documentos existentes siguen protegidos por dueño |
| Simulador de prompts | Llamaba a dos exports inexistentes y ocultaba errores con demo | `evaluatePromptFn` / `executePromptFn`, validación, auth, cuota y error visible |
| 16 tipos de bloques en visor | Faltaba la rama `imagen` aunque el editor sí la tenía | Visor usa `ImagenConCallouts` con caption y cuadros |
| SP5 personalizado tras quiz | El componente no pasaba alumno/curso; siempre caía en recomendación local | Parámetros conectados al endpoint; conserva fallback local si IA no está disponible |
| Evaluación abierta | El visor inventaba 75% sin preguntas objetivas | Muestra revisión pendiente; restaura respuestas persistidas al volver al bloque |
| SP3 / digest de la clase | `slice(0, 10)` omitía grupos/alumnos; `in []` podía fallar | Consultas por lotes de 30 y manejo de roster vacío |
| Resumen diario 7 a. m. | Cron 13:00 con zona México lo ejecutaba a la 1 p. m. | Cron `0 7 * * *`, zona `America/Mexico_City`; documento diario por instructor evita duplicados |
| Instalación reproducible | MCP sin lockfile; React/ReactDOM no declarados directamente | Tres lockfiles, dependencias React explícitas, requisito frontend Node >=22.12; se repararon tres entradas incompletas de tipos en el lock de Functions |
| Secret Manager | Documentado, sin vincular secreto a Functions | Todas las Functions IA vinculan `ANTHROPIC_API_KEY` |
| MCP HTTP igual a stdio | Catálogos y transporte distintos | Documentados 14 tools HTTP y 7 stdio; ambos con 2 resources |
| Compilación como verificación | Sin suite ni workflow | Vitest, Rules Emulator y workflow de comprobación manual/PR |

## Evidencia local

- `npm test`: 33 pruebas de contratos HTTP, autorización, cuota, cliente, analítica, simulador y visor.
- `npm run test:rules`: 10 pruebas ejecutadas contra Firestore Emulator, sin omitidas.
- `npm run build`, `npm --prefix functions run build` y `npm --prefix mcp-server run build`: compilación de los tres paquetes.
- Se ejecutó `npm ci` en los tres paquetes y también se compiló Functions con Node 20.20.2 / npm 10.
- La suite HTTP usa dobles de Firebase Auth y proveedor IA; la suite Rules usa el emulador real de Firestore. No equivalen a verificar login Google, facturación ni modelos remotos.
- Vite advierte sobre un bundle mayor de 500 kB; no bloquea el build. La división de módulos queda como mejora de rendimiento.

## Alcance que continúa pendiente

- Validación en staging con Auth real, Secret Manager, IAM y proveedor IA; revisión funcional con alumno/maestro/admin y móvil físico. No hubo despliegue ni migración de datos.
- Aislamiento por institución/instructor. El modelo actual permite al personal docente acceso institucional amplio, como lo hacían las Rules existentes. No es una plataforma multiempresa aislada.
- Certificados, SCORM, SSO empresarial, push, versionado de cursos y pantalla `/admin/config` continúan pendientes. Las funciones de IA implementadas en código no acreditan operación productiva.
- SP1 califica preguntas abiertas de cuestionarios; `campo_libre` guarda progreso y no está conectado a SP1. SP7 devuelve `{html, note}` en el visor; no hay herramienta MCP dedicada a traducir.
- El digest actual notifica a maestros sobre entregas recientes/pendientes; no implementa todas las notificaciones de alumnos mencionadas como visión en documentos antiguos.

`AUDITORIA_IAPRENDE.md` se conserva como antecedente histórico. Para operación actual, prevalecen README y `docs/`.
