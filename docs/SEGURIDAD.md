# Seguridad y datos sensibles

## Secretos del repositorio

Nunca guardes en Git:

- Claves de proveedores de IA, tokens o contraseñas.
- JSON de cuentas de servicio, llaves privadas o variables serializadas con credenciales.
- Archivos `.env`, `.env.local` o cualquier variante con valores reales.
- Exportaciones con información personal de alumnos, resultados o datos de Firebase.

`.gitignore` excluye `.env*` (salvo `.env.example`) y archivos Firebase Admin con nombre `*-firebase-adminsdk-*.json`. Mantén los secretos en Secret Manager, variables de entorno protegidas o un almacén local no versionado. `.env.example` debe contener exclusivamente marcadores vacíos o de demostración.

Si una clave se incluyó accidentalmente en un commit, borrarla en un commit posterior no revoca la exposición: desactívala/rotala inmediatamente en su proveedor, limita IAM, revisa logs y elimina la clave de todo historial publicado mediante el procedimiento aprobado para ese repositorio.

## Configuración Firebase del navegador

Los valores `VITE_*` se incorporan al bundle y son visibles al público. La configuración Firebase web no es un secreto de servidor; la protección depende de reglas correctas, Auth, restricciones de API aplicables, límites y controles contra abuso. Nunca pongas una clave privada de Admin ni una clave Anthropic en una variable `VITE_*`.

## Reglas de Firestore

El archivo `firestore.rules` limita operaciones por rol y propietario en varias colecciones. Antes de usar con usuarios reales, revisa como mínimo:

- **Perfil:** un usuario puede actualizar su propio documento. La regla actual no limita los campos modificables, por lo que el propietario podría intentar cambiar `rol` desde el cliente. Protege el campo de rol con validación de campos/valores o Custom Claims.
- **Respuestas:** la creación liga `alumno_id` al usuario autenticado, pero valida también los campos permitidos y transiciones de estado/calificación.
- **Casos éticos:** la regla actual permite crear y actualizar a cualquier autenticado; confirma que el identificador del autor se valida y que la lectura amplia es aceptable.
- **Solicitudes:** valida que alumno, grupo, estado y campos no se puedan falsificar mediante una actualización permitida.
- **Lectura general:** las reglas permiten lecturas autenticadas amplias para cursos, bloques y grupos, y el perfil es legible por usuarios autenticados. Revisa datos expuestos y limita consultas/documentos según el modelo real.
- **Admin SDK:** Cloud Functions y scripts con Firebase Admin omiten reglas Firestore. Cada endpoint debe comprobar Auth, rol, propietario, formato y autorización del lado servidor.

Las reglas se comportan de forma aditiva por coincidencia de `allow`; una regla permisiva puede abrir acceso aunque otra sea más restrictiva. Valida cambios en Emulator Suite antes de desplegarlos.

## Endpoints HTTP y CORS

`functions/src/index.ts` establece CORS en varios endpoints y acepta solicitudes POST. CORS es una política del navegador; no autentica a la persona ni impide que un cliente alternativo invoque el endpoint. Antes de exponer operaciones que leen/modifican datos o consumen IA:

1. Verifica Firebase ID token en servidor.
2. Valida rol, propiedad de registros y permisos para la acción solicitada.
3. Valida esquema, longitud, cuotas, frecuencia y tamaño de las solicitudes.
4. Aplica límites de gasto/abuso y evita revelar mensajes internos de error.
5. Registra metadatos operativos mínimos, sin secretos ni contenido personal innecesario.

## Protección de información educativa

Las respuestas, calificaciones, progreso, grupos y análisis pueden ser datos personales o educativos. Minimiza el envío a proveedores IA, comunica su tratamiento, aplica controles de acceso y retención y revisa las obligaciones que correspondan a la organización y jurisdicción. No uses datos reales al probar sin autorización.

## Revisión antes de publicar

- Inspecciona los archivos que entrarán al commit y los archivos ignorados que podrían contener secretos.
- Ejecuta un escaneo de claves antes de publicar y revisa también documentos, logs, capturas y muestras.
- Verifica que no se incluyan `.env`, archivos Admin, `node_modules`, `dist` o artefactos de compilación innecesarios.
- Revisa dependencias y sus avisos de seguridad con el proceso que use tu equipo.
- Vuelve a auditar reglas, Functions, IAM y dominios autorizados antes de abrir el servicio al público.
