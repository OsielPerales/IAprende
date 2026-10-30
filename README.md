# iAprende

iAprende es una aplicación web para organizar cursos, grupos, actividades y evaluaciones de capacitación. El producto combina un LMS con herramientas de apoyo basadas en IA y una interfaz en español diseñada desde una perspectiva humanista: contenido legible, interacción directa y adaptación a distintos tamaños de pantalla.

Este repositorio contiene la aplicación React, las reglas de Firestore, Firebase Cloud Functions, un servidor MCP y documentación de producto y operación. Está configurado para Firebase Hosting y Cloud Functions. La configuración del proyecto Firebase se encuentra en `.firebaserc`; revisa el destino antes de desplegar.

## Qué incluye

- **Alumno:** panel, cursos asignados, visualización de lecciones, grupos, avance y calificaciones.
- **Maestro:** creación y edición de cursos, impartición en vivo, grupos, libro de calificaciones y herramientas de IA.
- **Administrador:** gestión de usuarios, roles, grupos, cursos y vistas administrativas.
- **Contenido interactivo:** portada, tarjetas, tablas, mapas, infografías, comparadores, listas de verificación, casos éticos, campos abiertos y simuladores, entre otros bloques implementados en `src/components/bloques/`.
- **IA:** tutor y generación de cursos/cuestionarios/simuladores desde la interfaz; Cloud Functions para generación, análisis de grupo, detección de brechas, rutas adaptativas, calificación, traducción y digest diario.
- **MCP:** herramientas y recursos para consultar e interactuar con iAprende desde clientes compatibles, tanto por stdio como mediante Cloud Function HTTP.
- **Firebase:** Authentication, Firestore, reglas de acceso, Hosting y Cloud Functions de segunda generación.

Consulta [la arquitectura](docs/ARQUITECTURA.md), [la instalación](docs/INSTALACION.md), [la operación y despliegue](docs/OPERACION.md), [seguridad](docs/SEGURIDAD.md) y [la hoja de producto](PRODUCT_SHEET.md). Los materiales de capacitación y verificación se catalogan en [Documentos EC301 y EC217/IAPRENDE_INDEX.md](Documentos%20EC301%20y%20EC217/IAPRENDE_INDEX.md).

## Tecnologías

| Capa | Tecnología |
|---|---|
| Interfaz | React, TypeScript, Vite, Tailwind CSS 4, React Router |
| Estado | Zustand y contexto de autenticación |
| Identidad y datos | Firebase Authentication y Cloud Firestore |
| Backend | Firebase Cloud Functions v2, Node.js 22, TypeScript |
| IA | Anthropic SDK en servidor; adaptador compatible con formato OpenAI |
| Integración de asistentes | Model Context Protocol (MCP), SDK oficial |
| Alojamiento | Firebase Hosting |

## Inicio rápido

Requisitos: Node.js 22 para frontend, herramientas y Cloud Functions, npm y acceso a un proyecto Firebase propio.

```bash
npm ci
Copy-Item .env.example .env.local
# Completa .env.local con la configuración Firebase de tu aplicación web.
npm run dev
```

La aplicación local abre normalmente en `http://localhost:5173`. Sin configuración Firebase, el cliente inicializa valores de marcador de posición y las funciones remotas no estarán disponibles. No uses credenciales de producción en un equipo o entorno no confiable.

Para compilar la interfaz:

```bash
npm run build
```

Para compilar Functions y MCP:

```bash
npm --prefix functions ci
npm --prefix functions run build
npm --prefix mcp-server ci
npm --prefix mcp-server run build
```

Los comandos de build están declarados en los respectivos `package.json`. Revisa las notas de [instalación](docs/INSTALACION.md) antes de conectar Firebase o proveedores de IA.

## Estructura del proyecto

```text
src/                  Aplicación React, páginas, componentes y estado
functions/src/        Firebase Cloud Functions y lógica de IA/MCP
mcp-server/src/       Servidor MCP de stdio para ejecución local
public/               Recursos servidos directamente por Vite
scripts/              Utilidades de datos
Documentos EC301.../  Materiales de cursos y documentos de referencia
docs/                 Guías técnicas y operativas
firestore.rules       Reglas de seguridad de Firestore
firebase.json         Configuración de Hosting, reglas y Functions
```

## Rutas principales

| Área | Rutas |
|---|---|
| Acceso público | `/login`, `/registro` |
| Alumno | `/app`, `/app/cursos`, `/app/curso/:id`, `/app/grupos`, `/app/calificaciones` |
| Maestro | `/maestro`, `/maestro/cursos`, `/maestro/curso/:id/editar`, `/maestro/grupos`, `/maestro/calificaciones`, `/maestro/impartir` |
| Administrador | `/admin`, `/admin/usuarios`, `/admin/grupos`, `/admin/cursos`, `/admin/calificaciones`, `/admin/config` |

La protección visual de rutas usa `RoleGuard`; la autorización real de los datos debe verificarse además en Firestore y en los endpoints. Consulta [seguridad](docs/SEGURIDAD.md).

## Servicios de IA

Las funciones se exportan desde `functions/src/index.ts`. Entre ellas se encuentran `aiProxy`, `autoGradeRespuestaFn`, `generateCourseFromTopicFn`, `queryClassDataFn`, `detectKnowledgeGapsFn`, `getPersonalizedLearningPathFn`, `translateBlockFn`, `dailyDigestFn` y `mcpServer`. La lista y el propósito de cada una están en [arquitectura](docs/ARQUITECTURA.md).

Las claves de Anthropic pertenecen únicamente al servidor. En producción, configura secretos mediante Firebase/Google Cloud Secret Manager y vincúlalos a las funciones que los usan. No guardes claves en el frontend, el repositorio, capturas o archivos `.env.example`.

## Revisión desde el celular

Guía y estado de configuración: [Flujo móvil y despliegue](docs/FLUJO_MOVIL_Y_DESPLIEGUE.md).

```bash
npm run dev:review
npm run build:review
```

El modo review abre las pantallas con datos de ejemplo en este navegador y no usa Firebase/IA reales. Para validar permisos y servicios se requiere Firebase DEV. El build normal excluye el adaptador de revisión.

## Estado y límites conocidos

Contraste de código, correcciones y evidencia: [Estado actual — 30 oct 2026](docs/ESTADO_ACTUAL_2026-10-30.md).

Verificación reproducible (requiere instalar los tres paquetes):

```bash
npm run check
npm run test:rules
```

`test:rules` usa Firestore Emulator y el proyecto ficticio `demo-iaprende`; requiere Java 17+ (Java 21 en CI).


- El frontend y backend están separados en raíz y `functions/`; el servidor MCP stdio es un paquete independiente.
- Todas las llamadas HTTP de IA verifican Firebase ID token y perfil; MCP HTTP requiere admin. Registro crea alumnos; el primer admin se provisiona desde un entorno de confianza. Las Rules y Functions nuevas deben desplegarse explícitamente para tener efecto; consulta [seguridad](docs/SEGURIDAD.md).
- La aplicación actual es de una sola institución: maestros tienen permisos institucionales amplios. No hay aislamiento multiempresa. `/admin/config` sigue siendo una pantalla pendiente.
- No se publica un conjunto de datos de muestra ni credenciales de Firebase. Para una instalación nueva se requiere configurar Auth, Firestore, secretos y reglas en un proyecto propio.
- Los archivos PDF/DOCX de cursos son materiales del producto y no son necesarios para compilar el código.

## Documentación adicional

- [Arquitectura, roles, rutas, colecciones y funciones](docs/ARQUITECTURA.md)
- [Instalación local y variables de entorno](docs/INSTALACION.md)
- [Operación, publicación y resolución de problemas](docs/OPERACION.md)
- [Seguridad y tratamiento de secretos](docs/SEGURIDAD.md)
- [Auditoría histórica del producto](AUDITORIA_IAPRENDE.md)
- [Hoja de producto](PRODUCT_SHEET.md)

## Licencia y uso

No se encontró un archivo de licencia en el repositorio. Todos los derechos sobre el código y los materiales permanecen con sus titulares; solicita autorización antes de redistribuirlos o reutilizarlos. Los datos y las claves de los servicios externos no forman parte de esta publicación.
