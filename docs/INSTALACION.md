# Instalación y configuración local

## Requisitos

- Node.js 22 para Vite, herramientas y Cloud Functions; `.nvmrc` fija esta versión principal.
- Java 17+ para el emulador incluido (CI usa Java 21).
- npm compatible con los archivos `package-lock.json`.
- Cuenta y proyecto Firebase con Authentication, Firestore, Hosting y Cloud Functions habilitados para las funciones que se vayan a usar.
- Para generar las capacidades de IA: clave de Anthropic guardada en el entorno servidor, además de la configuración Firebase.

La región Firebase y el plan de facturación pueden afectar la disponibilidad y costo de Functions/Cloud Scheduler. Confirma estos requisitos en el proyecto Firebase de destino.

## Instalar dependencias

Desde la raíz del repositorio:

```powershell
npm ci
npm --prefix functions ci
npm --prefix mcp-server ci
```

Cada paquete tiene un `package-lock.json` independiente. Vuelve a ejecutar `npm ci` en el paquete cuya dependencia cambió.

## Configurar el frontend

```powershell
Copy-Item .env.example .env.local
```

Completa `.env.local` con la configuración de la aplicación web que obtuviste desde la consola Firebase:

| Variable | Propósito |
|---|---|
| `VITE_FIREBASE_API_KEY` | Identificador de la aplicación web Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio para Auth |
| `VITE_FIREBASE_PROJECT_ID` | Proyecto Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket del proyecto |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Remitente Firebase |
| `VITE_FIREBASE_APP_ID` | ID de la aplicación web |
| `VITE_AI_PROXY_URL` | URL opcional de la función proxy |
| `VITE_AI_CLAUDE_URL` | URL base opcional de funciones de IA |
| `VITE_AI_MODEL` | Nombre de modelo que espera el cliente legado del proxy |
| `VITE_MAIN_APP_URL` | URL de retorno a la app principal |

Los identificadores de cliente Firebase no sustituyen reglas de seguridad. Las variables con prefijo `VITE_` se publican dentro del bundle del navegador. No pongas contraseñas, tokens privados ni claves de cuenta de servicio en ellas.

## Ejecutar en desarrollo

```powershell
npm run dev
```

Vite muestra la URL local en la terminal (normalmente `http://localhost:5173`). Para que login, lecturas y guardado funcionen, habilita los proveedores de Auth y despliega/configura Firestore en el proyecto elegido. Sin configuración, la app usa valores de marcador de posición y no conecta a los servicios reales.

## Compilar

```powershell
npm run build
npm --prefix functions run build
npm --prefix mcp-server run build
```

El build del frontend ejecuta `tsc` y después Vite. Functions y MCP compilan con TypeScript. Estos comandos comprueban compilación; no prueban reglas remotas, usuarios, llamadas a modelos ni comportamiento en producción.

## Configurar Functions y secretos

Configura secretos para el entorno servidor usando Secret Manager/Firebase Secrets y vincúlalos explícitamente a las Functions que los consumen. Variables de desarrollo comunes:

- `ANTHROPIC_API_KEY`: clave privada del proveedor Anthropic.
- `ANTHROPIC_MODEL`: modelo servidor (el código tiene un default, configurable por entorno).
- `GOOGLE_APPLICATION_CREDENTIALS`: ruta local a una cuenta de servicio limitada, si se requiere localmente.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: alternativa base64 usada por el proceso stdio MCP.

Usa credenciales de mínimo privilegio y separa desarrollo, staging y producción. No copies claves de la máquina del mantenedor ni el archivo JSON de cuenta de servicio al repositorio.

## Firebase Emulator Suite

`firebase.json` configura Firestore en `127.0.0.1:8085`. Ejecuta las pruebas con proyecto ficticio:

```bash
npm test
npm run test:rules
```

El segundo comando arranca y detiene el emulador; no requiere claves de IA ni datos reales. La interfaz de desarrollo todavía usa el proyecto de sus variables `VITE_FIREBASE_*`; este comando de pruebas no redirige automáticamente el navegador ni configura Auth/Functions Emulator.

## Primer administrador y autenticación HTTP

Registra la cuenta normalmente (nace como alumno). Desde Firebase Console o Admin SDK autorizado, verifica el UID y cambia `usuarios/{uid}.rol` a `admin`. Vuelve a iniciar sesión. No hay bootstrap por correo.

El frontend envía ID token Firebase en Authorization. Un cliente MCP HTTP requiere el mismo encabezado, perfil admin y renovación de token; no basta con configurar la URL. Stdio usa sus propias credenciales administrativas de entorno.

## Solución de problemas comunes

- **La página carga pero no hay sesión:** verifica los proveedores habilitados de Auth y los valores `VITE_FIREBASE_*`.
- **`permission-denied`:** comprueba que el usuario tenga un documento de perfil con rol válido y que las reglas permitan esa operación. Los guardas visuales no amplían permisos de Firestore.
- **La llamada de IA devuelve 500:** verifica el secreto Anthropic asignado, la URL de la Function y el formato del cuerpo; consulta logs de Functions sin registrar claves o datos sensibles.
- **No aparece una ruta al recargar:** Hosting debe conservar la reescritura `**` → `/index.html` indicada en `firebase.json`.
- **La app compila pero apunta al proyecto equivocado:** revisa `.firebaserc` y variables `.env.local` antes de desplegar.
