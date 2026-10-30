# Seguridad y datos sensibles

Estado del código: revisión del 30 de octubre de 2026. Evidencia y límites en [ESTADO_ACTUAL_2026-10-30.md](ESTADO_ACTUAL_2026-10-30.md). Esta revisión no acredita un despliegue de producción.

## Identidad y roles

- Registro por correo y Google: todos los perfiles nuevos nacen como `alumno`. Se eliminó el bootstrap por `VITE_ADMIN_EMAIL`.
- `usuarios/{uid}` conserva `id`, correo y rol ante ediciones del propio usuario. El alumno puede modificar nombre, apellido y avatar; solo un administrador puede cambiar roles.
- El primer administrador debe provisionarse desde Firebase Console o una herramienta Admin SDK de confianza, después de verificar el UID en Auth. Los siguientes cambios de rol pueden hacerse desde Gestión de usuarios. Inicia sesión de nuevo después de cambiar un rol.
- Las Functions HTTP verifican Firebase ID token con comprobación de revocación, rechazan cuentas anónimas y consultan el rol en el perfil protegido. Nunca aceptan el rol del navegador.
- La aplicación es de una institución: maestros y administradores mantienen acceso institucional amplio a cursos, grupos, respuestas y analítica. No hay aislamiento por empresa ni por instructor en las Rules. Los perfiles y las respuestas colaborativas de casos éticos siguen siendo legibles por cuentas registradas. Este modelo debe revisarse antes de alojar instituciones independientes.

## Endpoints HTTP

Todas las operaciones HTTP usan `Authorization: Bearer <Firebase ID token>`; el cliente obtiene el token actual en `src/lib/http.ts`. Solo se admite POST, con OPTIONS para preflight. CORS permite Authorization; no sustituye la autenticación.

| Operación | Permiso |
|---|---|
| `aiProxy`, `translateBlockFn`, `evaluatePromptFn`, `executePromptFn` | Cuenta registrada con perfil válido |
| `autoGradeRespuestaFn`, `generateCourseFromTopicFn`, `queryClassDataFn` | Maestro o administrador |
| Generación/consulta con `maestroId` | Identidad propia; un admin puede seleccionar otro instructor |
| `detectKnowledgeGapsFn`, `getPersonalizedLearningPathFn` | Alumno propio o personal docente/administrador |
| `mcpServer` HTTP | Solo administrador; sus herramientas/recursos son globales |

Los cuerpos HTTP se limitan a 64 KiB; los handlers validan identificadores, longitudes, rangos y enumeraciones antes de llamar al modelo. La cuota persistente compartida entre endpoints y MCP es de 20 solicitudes por minuto y 200 por día UTC por UID (`ai_usage`, transacción Admin SDK). Los errores inesperados no revelan mensajes del proveedor, tokens ni contenido privado. El digest programado usa la identidad administrada de Cloud Scheduler y queda fuera de esa cuota de usuario.

Las cuotas por cuenta no reemplazan presupuestos del proveedor ni controles contra creación masiva de cuentas. MCP stdio se ejecuta con credenciales administrativas locales: solo en máquinas y clientes de confianza; no tiene la cuota del endpoint HTTP. El MCP HTTP no implementa un flujo OAuth para terceros; el cliente debe poder enviar y renovar el ID token Firebase.

## Reglas y cliente Firestore

- El alumno consulta sus respuestas y solicitudes con filtros por UID; la analítica usa su documento individual. Las notificaciones siempre se filtran por destinatario. Al cerrar sesión se vacía el caché de Zustand.
- Las respuestas se crean sin calificación ni retroalimentación docente. Solo personal docente/administrador puede calificar; se valida el rango 0–100.
- Marcar una notificación como leída cambia únicamente `leida` mediante `diff().affectedKeys()`.
- Progreso, casos éticos y solicitudes preservan propietario y referencias. Solo personal docente decide inscripciones; el alumno puede reenviar una solicitud rechazada.
- Analytics y cuotas se escriben exclusivamente mediante Admin SDK. Las Rules no protegen operaciones Admin SDK: los endpoints deben aplicar sus propios controles.

Pruebas reproducibles: `npm test` (contratos HTTP, cliente y contenido) y `npm run test:rules` (Firestore Emulator, proyecto ficticio `demo-iaprende`). No apuntan a datos de producción. Las notas locales de progreso no equivalen a calificaciones oficiales ni a certificados.

## Secretos

Nunca guardes claves IA, tokens, contraseñas, cuentas de servicio ni exportaciones de alumnos en Git. `.env.example` contiene solo marcadores. Los valores `VITE_*` se incorporan al JavaScript público; la configuración web Firebase no es un secreto de servidor.

Configura `ANTHROPIC_API_KEY` con Firebase Secrets/Secret Manager. Las Functions que consumen IA vinculan explícitamente ese secreto en sus opciones. Firebase Admin en Cloud Functions usa credenciales administradas; MCP local puede usar `GOOGLE_APPLICATION_CREDENTIALS` o `FIREBASE_SERVICE_ACCOUNT_JSON` en base64. Base64 no cifra una clave.

Si se expone una credencial, revócala/rota en el proveedor y revisa el historial y logs; borrar el último archivo no revoca la clave. No se ejecutaron llamadas pagadas a IA, cambios de IAM ni despliegues en esta revisión.
