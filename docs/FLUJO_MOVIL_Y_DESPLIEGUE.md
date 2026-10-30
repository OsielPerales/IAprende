# Probar, corregir y publicar iAprende desde el celular

El operador revisa una URL desde su teléfono y comunica el cambio en ChatGPT. El código vive en GitHub y las compilaciones en el servicio de despliegue; no necesita terminal en el celular.

## Tres entornos distintos

| Entorno | Código/servicios | Qué valida |
|---|---|---|
| Revisión visual | Rama del PR, build `review`, adaptador local y datos de ejemplo | Pantallas, navegación y edición en el navegador |
| Staging | Misma rama, SDK Firebase real y proyecto DEV separado | Auth, Rules, persistencia, Functions y modelos reales |
| Producción | Versión revisada, proyecto Firebase productivo explícito | Servicio para usuarios reales |

La revisión visual no valida permisos ni calidad de la IA y no reemplaza staging. Usa las pantallas reales, pero sustituye Firebase por un adaptador local **solo durante la compilación `--mode review`**. Todos los cambios quedan en el navegador de prueba y pueden restablecerse. La barra identifica siempre este modo y permite entrar como alumno, maestro o administrador sin contraseñas reales.

## Flujo del usuario en el teléfono

1. Abrir la URL de revisión que entregue el despliegue.
2. Elegir Alumno, Maestro o Administrador en la barra de revisión.
3. Recorrer cursos, actividades, grupos, editor y calificaciones.
4. Pulsar **Copiar observación** para copiar URL/versión y describir en ChatGPT qué ocurrió y qué esperaba; puede adjuntar una captura.
5. El agente corrige la misma rama y crea una nueva compilación. Volver a abrir el enlace para revisar.
6. Tras validar staging, publicar la versión revisada. El PR y las compilaciones permiten identificar y revertir el código.

La revisión no envía observaciones automáticamente a terceros. En modo revisión la IA de demostración conserva sus límites: generador de curso completo, analítica de servidor, Google Auth y MCP reales se verifican en staging.

## Vercel

Proyecto de revisión creado: `iaprende-review`, dentro de Desarrollos Elaborados, conectado a `OsielPerales/IAprende`. La rama de trabajo es `fix/iaprende-documentacion-seguridad-20261030`.

- Framework: Vite; Node 22.
- Instalación: `npm ci` en raíz, Functions y MCP.
- Compilación: `npm run build:vercel`; ejecuta tests y compila Functions/MCP antes de la interfaz. Las Rules se verifican con emulador en el paso de publicación.
- Salida: `dist`.
- Variable del proyecto de revisión: `VITE_APP_ENV=review` en sus destinos de despliegue. No requiere claves de Firebase ni IA.
- `vercel.json` conserva las rutas de React Router al recargar.
- `/build-info.json` identifica modo y commit cuando Vercel proporciona el SHA.

El primer despliegue de un proyecto Vercel puede etiquetarse como production por Vercel; este proyecto es exclusivamente de revisión y no sustituye el Hosting Firebase del servicio real. No conectar dominios productivos a este proyecto de revisión.

Vercel confirmó READY para el commit `25bd5d1`. Primera versión: https://iaprende-review.vercel.app. Para seguir las correcciones de la rama, usar https://iaprende-review-git-fix-iaprende-b2d3e0-desarrollos-elaborados.vercel.app; Vercel actualiza ese alias cuando una nueva compilación de la rama termina correctamente. El acceso permanece protegido por la cuenta de Vercel del equipo. No se creó un enlace de acceso público temporal.

El primer build detectó que el rango abierto de Node seleccionaba Node 26 pese a la configuración del proyecto; se fijó Node 22 en el código, sus lockfiles y las Functions para alinear CI y servicios. El backend DEV continúa pendiente de conexión Firebase.

## Firebase DEV

No hay sesión Firebase ni complemento conectado en el entorno de esta revisión. El proyecto DEV y sus recursos no se han creado. Tras conectar Firebase:

1. Crear/seleccionar un proyecto DEV independiente y registrar una aplicación web.
2. Habilitar Firestore y Auth (correo y, después, Google); añadir el dominio estable de staging a los dominios autorizados.
3. Configurar `ANTHROPIC_API_KEY` mediante Firebase Secrets sin publicarla en chat/Git.
4. Configurar en staging `VITE_APP_ENV=staging`, las variables `VITE_FIREBASE_*` de DEV, `VITE_AI_CLAUDE_URL` y `VITE_AI_PROXY_URL` de sus Functions. `VITE_USE_EMULATORS=false`.
5. Provisionar administrador/instructor/alumno de prueba desde un entorno de confianza. Revisar los roles privilegiados existentes antes de publicar producción.
6. Desplegar con `npm run deploy:staging`; el script exige el proyecto explícito y ejecuta pruebas antes de modificar Firebase.
7. Ejecutar `npm run test:staging` para verificar que los endpoints rechazan solicitudes sin sesión; completar pruebas con los tres roles y una llamada IA controlada.

Functions/Secret Manager pueden requerir facturación en Google Cloud. No se ha activado ningún plan ni recurso de pago mediante esta preparación.

## Emuladores locales

`firebase.json` incluye Auth 9099, Firestore 8085, Functions 5001 y UI 4000. Para conectarlos al navegador local, usar un proyecto ficticio `demo-`, `VITE_USE_EMULATORS=true` y las URLs de Functions locales. El cliente rechaza esta opción en una URL pública. No hay emuladores hospedados dentro de la preview Vercel.

Las pruebas `npm run test:rules` arrancan solamente Firestore para verificar Rules. No equivalen a probar todo el conjunto de servicios.

## Publicación y reversión

- `npm run build:production` verifica que el entorno sea production, no haya placeholders/emuladores y existan URLs HTTPS de IA. Es una comprobación de configuración, no una aprobación de calidad.
- `npm run deploy:production` ejecuta `npm run check` y Rules Emulator; si falla cualquiera, no despliega. Utiliza `--project` explícito y publica Hosting, Rules y Functions coordinadamente.
- Antes de ejecutarlo, staging debe verificar login/registro, aislamiento entre alumnos, roles, edición/publicación/asignación de curso, entrega/calificación/feedback y al menos una operación IA.
- Mantener el commit y la versión Firebase de Hosting previos. Revertir código/Functions/Rules no restaura automáticamente documentos modificados; respaldar datos cuando el cambio lo requiera.

El workflow de GitHub sigue siendo una verificación sin despliegue automático; el bloqueo de facturación de la cuenta GitHub permanece externo al código. El agente puede ejecutar estas comprobaciones en su entorno antes de publicar, pero debe registrar evidencia equivalente y revisar protección de ramas antes del merge.

## Evidencia de esta preparación

- Compilación normal y revisión separadas; el bundle normal no contiene el adaptador visual.
- Pruebas de contrato, configuración y adaptador local mediante Vitest; Rules con Firestore Emulator.
- Prueba Chromium a 390×844: paneles/cursos/grupos/calificaciones de los tres roles, editor y visor; comprueba errores JS, ancho de paneles y ausencia de llamadas a servicios Firebase/IA reales.
- Detectados y corregidos escapes de JavaScript en dos simuladores del curso incluido; se agregaron pruebas de sintaxis para los cinco scripts embebidos.

Las pruebas de navegador y Rules anteriores se ejecutaron localmente. Vercel confirmó la compilación y publicación de la revisión visual, con tests y builds de Functions/MCP; el contenido remoto protegido no se ha recorrido en navegador. No hay despliegue Firebase DEV ni productivo confirmado.
