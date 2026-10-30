/**
 * iAprende MCP Server
 *
 * Exposes platform data and AI capabilities as MCP tools and resources.
 * Usable via StdioTransport (Claude Desktop) or StreamableHTTPTransport (Firebase Function).
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

import { DATA_READ_TOOLS, handleDataReadTool } from './tools/dataReadTools.js'
import { AI_TOOLS, handleAiTool } from './tools/aiTools.js'
import { WRITE_TOOLS, handleWriteTool } from './tools/writeTools.js'
import { PLATFORM_RESOURCES, readResource } from './resources/platformResources.js'

const ALL_TOOLS = [...DATA_READ_TOOLS, ...AI_TOOLS, ...WRITE_TOOLS]

export function createMcpServer(): Server {
  const server = new Server(
    { name: 'iaprende', version: '1.0.0' },
    { capabilities: { tools: {}, resources: {} } }
  )

  // ── List tools ──
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: ALL_TOOLS }))

  // ── Call tool ──
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params

    try {
      let result: string

      if (DATA_READ_TOOLS.some(t => t.name === name)) {
        result = await handleDataReadTool(name, args as Record<string, unknown>)
      } else if (AI_TOOLS.some(t => t.name === name)) {
        result = await handleAiTool(name, args as Record<string, unknown>)
      } else if (WRITE_TOOLS.some(t => t.name === name)) {
        result = await handleWriteTool(name, args as Record<string, unknown>)
      } else {
        throw new Error(`Unknown tool: ${name}`)
      }

      return { content: [{ type: 'text' as const, text: result }] }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      return { content: [{ type: 'text' as const, text: `Error: ${msg}` }], isError: true }
    }
  })

  // ── List resources ──
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: PLATFORM_RESOURCES,
  }))

  // ── Read resource ──
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri
    try {
      const text = await readResource(uri)
      return { contents: [{ uri, mimeType: 'application/json', text }] }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      return { contents: [{ uri, mimeType: 'text/plain', text: `Error: ${msg}` }] }
    }
  })

  return server
}
