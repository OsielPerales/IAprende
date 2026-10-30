---
título: iAprende — Índice del Proyecto
tipo: proyecto_index
estado: produccion
version: 1.0
fecha: 2026-04-19
proyecto_firebase: iaprende-1415d
url_produccion: https://iaprende-1415d.web.app
division: iAprende · División III Académica
autor: Osiel Alejandro Perales Jiménez
tags: [iaprende, lms, produccion, indice, division-iii]
---

# iAprende — Índice del Proyecto

> Plataforma LMS en producción. React + TypeScript + Firebase + Claude AI.
> **Estado:** ✅ Producción v1.0 · `iaprende-1415d.web.app`

---

## Documentos del Proyecto

| Documento | Tipo | Estado |
|---|---|---|
| [[IAPRENDE_PRODUCTO]] | Hoja técnica de producto | ✅ v1.0 |
| [[VERIFICACION_CURSO_N1_v2]] | Estándar de 35 bloques — Curso N1 | 📐 Referencia maestra |
| [[iAprende GTM]] | Plan de go-to-market | 🔄 Activo |

## Skill de Producción de Cursos

| Archivo | Ruta en vault |
|---|---|
| Entry point | `_skills/conocer/SKILL.md` |
| Instalación | `_skills/conocer/README-INSTALACION.md` |

---

## Arquitectura Rápida

```
iaprende-1415d (Firebase)
  ├── Hosting      → iaprende-1415d.web.app
  ├── Auth         → email + Google OAuth
  ├── Firestore    → cursos / bloques / progreso_alumno / grupos
  └── Functions    → SP1–SP7 (Cloud Functions Node 20)
```

**Roles:** Alumno · Maestro · Admin  
**Bloques de contenido:** 16 tipos  
**Superpotencias IA:** 7 (SP1–SP7 con `claude-sonnet-4-6` / `claude-haiku-4-5-20251001`)

---

## Curso Piloto en Producción

- **Nombre:** IA Estratégica y Diseño de Instrucciones Proactivas v2.0
- **Duración:** 135 min · Presencial
- **Estándar:** EC0301 vía B Smarter (Iván Téllez López)
- **Bloques:** 45 · 14 tipos distintos
- **Referencia:** [[VERIFICACION_CURSO_N1_v2]]

---

## Conexiones con el Ecosistema DE

- [[Manufactura Cognitiva SaaS]] — iAprende como canal de capacitación de operadores
- [[HUB Cognitivo]] — Pipeline CRM donde se registran prospectos iAprende
- [[Prospección Industrial Saltillo+Ramos Arizpe]] — Mercado objetivo Nivel 1
- [[ICATEC Convenio]] — Canal institucional pendiente (11 centros Coahuila)
- [[Constitución DE]] — División III: iAprende

---

## Accesos Rápidos

| Recurso | URL |
|---|---|
| Plataforma producción | https://iaprende-1415d.web.app |
| Panel admin | https://iaprende-1415d.web.app/admin |
| Sitio DE (botón acceso) | https://desarrolloselaborados.com |
| Repo | GitHub · OsielPerales/iaprende (rama master) |

---

## Roadmap Inmediato

- [ ] Corregir botón "Acceder a iAprende" en `desarrolloselaborados.com` → apuntar a `iaprende-1415d.web.app`
- [x] Implementar Curso N1 en Firestore — 45 bloques publicados (ver [[VERIFICACION_CURSO_N1_v2]])
- [ ] Promover rol `osiel.alejandro94@gmail.com` de `alumno` → `maestro`
- [ ] Certificados de finalización
- [ ] Notificaciones push (Firebase Cloud Messaging)

---

*iAprende v1.0 · Abril 2026 · Desarrollos Elaborados*
*Certificación EC0301 operada por B Smarter · Evaluador: Iván Téllez López*
