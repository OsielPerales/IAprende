# Operación y publicación

## Flujo recomendado

1. Revisa el branch, los cambios y el destino Firebase.
2. Instala dependencias bloqueadas con `npm ci` en el paquete que cambió.
3. Compila frontend, Functions y MCP según el alcance.
4. Revisa reglas, variables públicas y secretos antes de publicar.
5. Publica primero en un proyecto/canal de pruebas y verifica login, lectura/escritura, navegación y llamadas de IA.
6. Despliega producción solo al proyecto intencional y conserva el resultado del build/logs.

Antes de publicar ejecuta `npm run check` y `npm run test:rules`. El workflow `.github/workflows/verify.yml` ejecuta ambos en PR y manualmente, sin credenciales productivas ni deploy. Compilación y emulador no sustituyen una prueba funcional del servicio desplegado.

Los cambios de cliente, Functions y Rules se publican como una versión coordinada en staging: el cliente anterior no envía token y recibirá 401 de las Functions nuevas. Provisiona un admin de confianza antes de retirar el bootstrap por correo. Las Rules deben publicarse para proteger los roles; el código del navegador no basta. Revisa los perfiles privilegiados ya existentes: cerrar el autoescalamiento no revoca roles que se hubieran asignado antes.

## Despliegue con Firebase CLI

La CLI debe estar autenticada en una cuenta autorizada y seleccionada en el proyecto correcto. Confirma el proyecto antes de cualquier operación:

```bash
firebase projects:list
firebase use
```

Compila la aplicación antes de Hosting:

```bash
npm ci
npm run build
```

Despliegue por componente:

```bash
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only functions
```

Puedes combinar componentes cuando ya validaste el alcance. `firebase.json` indica `dist` como carpeta pública, `firestore.rules` como reglas y `functions` como codebase. Comprueba siempre el alias indicado por `.firebaserc`; no despliegues al proyecto configurado sin confirmar que corresponde al entorno esperado.

## Secretos y funciones

El código vincula `ANTHROPIC_API_KEY` en las opciones de todas las Functions IA, incluido MCP y digest. Define su valor con `firebase functions:secrets:set ANTHROPIC_API_KEY` en el proyecto intencional. Al desplegar funciones que consumen IA, define los secretos en el gestor de secretos del proyecto y configura las opciones de Functions para que los reciban. El código lee `ANTHROPIC_API_KEY` y opcionalmente `ANTHROPIC_MODEL` desde el entorno servidor. La credencial Firebase Admin de Cloud Functions debe provenir del entorno de servicio administrado, no de un archivo JSON subido.

El paquete stdio `mcp-server` requiere credenciales por entorno (cuenta de servicio y Anthropic). Úsalo en una máquina de confianza, limita permisos IAM y evita ejecutar utilidades MCP con datos de producción si no es indispensable.

## Verificación posterior

- Confirma la URL y el proyecto desplegado.
- Abre login/registro, comprueba redirección por rol y rutas protegidas.
- Verifica que las lecturas, escrituras y reglas correspondan al rol esperado.
- Prueba una operación de IA con datos no sensibles y observa logs del servidor.
- Comprueba una ruta interna después de recargar la página.
- Si el digest diario está habilitado, confirma la programación de Cloud Scheduler y la zona horaria `America/Mexico_City`.
- Revisa logs y métricas sin copiar tokens, respuestas privadas o datos personales a incidencias públicas.

## Reversión

Mantén identificado el último build conocido y el commit asociado al despliegue. Para Hosting, vuelve a una versión anterior desde Firebase Console/CLI según el procedimiento de tu equipo. Para Functions y reglas, restaura el código/reglas del commit anterior y vuelve a desplegar solo los componentes afectados. Las modificaciones de Firestore pueden alterar datos; no reviertas documentos de producción sin un procedimiento de respaldo y recuperación.

## Operación de documentos

Los materiales de capacitación están en `Documentos EC301 y EC217/` y algunos recursos en `public/`. `public/` se copia directamente al sitio en build; evita poner ahí materiales internos, listas con información personal o documentación operativa privada. Conserva un índice actualizado en `Documentos EC301 y EC217/IAPRENDE_INDEX.md` cuando agregues o retires material.
