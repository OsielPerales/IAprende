#!/usr/bin/env node
/**
 * iAprende MCP Server — Standalone (Claude Desktop)
 *
 * Usage:
 *   npm run build
 *   node lib/index.js
 *
 * Claude Desktop config (~/.config/claude/claude_desktop_config.json):
 * {
 *   "mcpServers": {
 *     "iaprende": {
 *       "command": "node",
 *       "args": ["/absolute/path/to/mcp-server/lib/index.js"],
 *       "env": {
 *         "ANTHROPIC_API_KEY": "sk-ant-...",
 *         "FIREBASE_SERVICE_ACCOUNT_JSON": "<base64-encoded-service-account>"
 *       }
 *     }
 *   }
 * }
 */
import admin from 'firebase-admin'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import Anthropic from '@anthropic-ai/sdk'

// ── Firebase Admin init ───────────────────────────────────────────────────────
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_JSON, 'base64').toString('utf-8')
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(decoded)) })
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp()
  } else {
    console.error('[iAprende MCP] ERROR: Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS')
    process.exit(1)
  }
}

const db = admin.firestore()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Tool definitions ──────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: 'get_platform_stats',
    description: 'Get iAprende platform statistics (users, courses, groups, responses)',
    inputSchema: { type: 'object' as const, properties: {}, required: [] },
  },
  {
    name: 'list_pending_grades',
    description: 'List all student responses without a grade (calificacion === null)',
    inputSchema: { type: 'object' as const, properties: { grupo_id: { type: 'string' } }, required: [] },
  },
  {
    name: 'get_group_roster',
    description: 'Get all students in a group with their performance data',
    inputSchema: {
      type: 'object' as const,
      properties: { grupo_id: { type: 'string' } },
      required: ['grupo_id'],
    },
  },
  {
    name: 'auto_grade_open_answer',
    description: 'Grade an open-ended response using Claude AI',
    inputSchema: {
      type: 'object' as const,
      properties: {
        respuesta_id: { type: 'string' },
        rubric: { type: 'string' },
      },
      required: ['respuesta_id'],
    },
  },
  {
    name: 'answer_instructor_query',
    description: 'Answer a natural language question about class performance using real Firestore data',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Natural language question in Spanish' },
        maestro_id: { type: 'string' },
      },
      required: ['query', 'maestro_id'],
    },
  },
  {
    name: 'generate_course_from_topic',
    description: 'Generate a complete course from a topic description and save it to Firestore',
    inputSchema: {
      type: 'object' as const,
      properties: {
        topic: { type: 'string' },
        industry_context: { type: 'string' },
        maestro_id: { type: 'string' },
        num_bloques: { type: 'number' },
      },
      required: ['topic', 'industry_context', 'maestro_id'],
    },
  },
  {
    name: 'submit_grade',
    description: 'Write a grade (0-100) to a student response in Firestore',
    inputSchema: {
      type: 'object' as const,
      properties: {
        respuesta_id: { type: 'string' },
        calificacion: { type: 'number' },
        feedback: { type: 'string' },
      },
      required: ['respuesta_id', 'calificacion'],
    },
  },
]

// ── Server setup ──────────────────────────────────────────────────────────────
const server = new Server(
  { name: 'iaprende', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params

  try {
    const result = await dispatchTool(name, args as Record<string, unknown>)
    return { content: [{ type: 'text' as const, text: result }] }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { content: [{ type: 'text' as const, text: `Error: ${msg}` }], isError: true }
  }
})

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    { uri: 'iaprende://platform/stats', name: 'Platform Stats', mimeType: 'application/json' },
    { uri: 'iaprende://respuestas/pending', name: 'Pending Grades', mimeType: 'application/json' },
  ],
}))

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri
  const text = await readResource(uri)
  return { contents: [{ uri, mimeType: 'application/json', text }] }
})

// ── Tool dispatcher ───────────────────────────────────────────────────────────
async function dispatchTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case 'get_platform_stats': {
      const [u, c, g, r] = await Promise.all([
        db.collection('usuarios').count().get(),
        db.collection('cursos').count().get(),
        db.collection('grupos').count().get(),
        db.collection('respuestas').count().get(),
      ])
      return JSON.stringify({ usuarios: u.data().count, cursos: c.data().count, grupos: g.data().count, respuestas: r.data().count }, null, 2)
    }

    case 'list_pending_grades': {
      const snap = await db.collection('respuestas').where('calificacion', '==', null).get()
      return JSON.stringify(snap.docs.map(d => ({ id: d.id, ...d.data() })), null, 2)
    }

    case 'get_group_roster': {
      const grupoId = args.grupo_id as string
      const gaSnap = await db.collection('grupo_alumnos').where('grupo_id', '==', grupoId).get()
      const alumnoIds = gaSnap.docs.map(d => (d.data() as any).alumno_id as string)
      const rosters = await Promise.all(alumnoIds.map(async id => {
        const [uSnap, rSnap] = await Promise.all([
          db.collection('usuarios').doc(id).get(),
          db.collection('respuestas').where('alumno_id', '==', id).get(),
        ])
        const u = uSnap.data() as any
        const cal = rSnap.docs.map(d => d.data() as any).filter(r => r.calificacion != null)
        return {
          id, nombre: `${u?.nombre} ${u?.apellido}`,
          promedio: cal.length ? Math.round(cal.reduce((s: number, r: any) => s + r.calificacion, 0) / cal.length) : null,
          entregas: rSnap.size,
        }
      }))
      return JSON.stringify(rosters, null, 2)
    }

    case 'auto_grade_open_answer': {
      const { respuesta_id, rubric } = args as { respuesta_id: string; rubric?: string }
      const respDoc = await db.collection('respuestas').doc(respuesta_id).get()
      const respuesta = respDoc.data()!
      const bloqueDoc = await db.collection('bloques').doc(respuesta.bloque_id).get()
      const preguntas = ((bloqueDoc.data()?.contenido as any)?.preguntas ?? []) as any[]
      const openItems = preguntas.filter(p => p.tipo === 'abierta').map(p => ({
        pregunta: p.texto, respuestaAlumno: String(respuesta.respuestas[p.id] ?? ''), puntos: p.puntos ?? 0,
      }))
      if (openItems.length === 0) return JSON.stringify({ error: 'No open-ended questions found' })

      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-6', max_tokens: 500,
        tools: [{
          name: 'grade', description: 'Grade result',
          input_schema: { type: 'object' as const, properties: { score: { type: 'number' }, feedback: { type: 'string' }, confidence: { type: 'string', enum: ['high', 'medium', 'low'] } }, required: ['score', 'feedback', 'confidence'] },
        }],
        tool_choice: { type: 'any' },
        messages: [{ role: 'user', content: `Califica estas respuestas abiertas de capacitación industrial.\n${rubric ? `Rúbrica: ${rubric}\n` : ''}${openItems.map((q, i) => `P${i + 1}: ${q.pregunta}\nRespuesta: ${q.respuestaAlumno}`).join('\n')}` }],
      })
      const tu = msg.content.find(c => c.type === 'tool_use')
      return JSON.stringify(tu?.type === 'tool_use' ? tu.input : { error: 'No result' }, null, 2)
    }

    case 'answer_instructor_query': {
      const { query, maestro_id } = args as { query: string; maestro_id: string }
      const gruposSnap = await db.collection('grupos').where('maestro_id', '==', maestro_id).get()
      const msg = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001', max_tokens: 300,
        messages: [{ role: 'user', content: `Eres asistente de iAprende. El instructor tiene ${gruposSnap.size} grupos. Pregunta: ${query}` }],
      })
      return msg.content[0]?.type === 'text' ? msg.content[0].text : 'Sin respuesta'
    }

    case 'generate_course_from_topic': {
      const { topic, industry_context, maestro_id, num_bloques = 4 } = args as any
      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-6', max_tokens: 3000,
        tools: [{
          name: 'course', description: 'Course structure',
          input_schema: { type: 'object' as const, properties: { titulo: { type: 'string' }, descripcion: { type: 'string' }, bloques: { type: 'array', items: { type: 'object', properties: { tipo: { type: 'string' }, contenido: { type: 'object' } } } } }, required: ['titulo', 'descripcion', 'bloques'] },
        }],
        tool_choice: { type: 'any' },
        messages: [{ role: 'user', content: `Genera un curso de ${num_bloques} bloques sobre "${topic}" para "${industry_context}". Incluye bloques de texto HTML y un cuestionario final.` }],
      })
      const tu = msg.content.find(c => c.type === 'tool_use')
      if (!tu || tu.type !== 'tool_use') return JSON.stringify({ error: 'Generation failed' })
      const generated = tu.input as any
      const batch = db.batch()
      const cursoRef = db.collection('cursos').doc()
      batch.set(cursoRef, { titulo: generated.titulo, descripcion: generated.descripcion, maestro_id, publicado: false, created_at: new Date().toISOString(), generado_por_ia: true })
      generated.bloques.forEach((b: any, i: number) => {
        batch.set(db.collection('bloques').doc(), { curso_id: cursoRef.id, orden: i + 1, tipo: b.tipo, contenido: b.contenido, created_at: new Date().toISOString() })
      })
      await batch.commit()
      return JSON.stringify({ cursoId: cursoRef.id, titulo: generated.titulo, bloquesCount: generated.bloques.length }, null, 2)
    }

    case 'submit_grade': {
      const { respuesta_id, calificacion, feedback } = args as { respuesta_id: string; calificacion: number; feedback?: string }
      if (calificacion < 0 || calificacion > 100) throw new Error('calificacion must be 0-100')
      await db.collection('respuestas').doc(respuesta_id).update({ calificacion, ...(feedback ? { feedback_maestro: feedback } : {}) })
      return JSON.stringify({ success: true })
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}

async function readResource(uri: string): Promise<string> {
  if (uri === 'iaprende://platform/stats') {
    const [u, c, g, r] = await Promise.all([
      db.collection('usuarios').count().get(),
      db.collection('cursos').count().get(),
      db.collection('grupos').count().get(),
      db.collection('respuestas').count().get(),
    ])
    return JSON.stringify({ usuarios: u.data().count, cursos: c.data().count, grupos: g.data().count, respuestas: r.data().count })
  }
  if (uri === 'iaprende://respuestas/pending') {
    const snap = await db.collection('respuestas').where('calificacion', '==', null).get()
    return JSON.stringify(snap.docs.map(d => ({ id: d.id, alumno_id: (d.data() as any).alumno_id, enviado_at: (d.data() as any).enviado_at })))
  }
  throw new Error(`Unknown resource: ${uri}`)
}

// ── Start ─────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport()
await server.connect(transport)
console.error('[iAprende MCP] Server running on stdio')
