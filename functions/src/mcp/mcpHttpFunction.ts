/**
 * MCP HTTP Firebase Function
 *
 * Wraps the iAprende MCP server as a Firebase Gen2 HTTP function.
 * Uses StreamableHTTPServerTransport in stateless mode (enableJsonResponse: true)
 * because Cloud Functions are ephemeral and cannot maintain session state.
 *
 * Connect via Claude Desktop config:
 * {
 *   "mcpServers": {
 *     "iaprende": {
 *       "url": "https://REGION-PROJECT.cloudfunctions.net/mcpServer"
 *     }
 *   }
 * }
 */
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createMcpServer } from './server.js'
import { authenticate, requireAdmin, consumeQuota, HttpError } from '../security/http.js'

function setCorsHeaders(res: any) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, mcp-session-id, MCP-Protocol-Version')
}

export async function handleMcpHttp(req: any, res: any) {
  setCorsHeaders(res)
  res.set('Cache-Control', 'no-store')
  if (req.method === 'OPTIONS') { res.status(204).send(''); return }

  if (req.method !== 'POST') { res.status(405).json({ error: 'Usa POST.' }); return }
  try {
    const who = await authenticate(req)
    requireAdmin(who) // Tools and resources expose platform-wide data and writes.
    if (req.rawBody?.length > 65536 || Buffer.byteLength(JSON.stringify(req.body) ?? '') > 65536) throw new HttpError(413, 'Solicitud demasiado grande.')
    await consumeQuota(who)
    const server = createMcpServer()
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode
      enableJsonResponse: true,
    })

    try {
      await server.connect(transport)
      await transport.handleRequest(req as any, res as any, req.body)
    } finally { await server.close() }
  } catch (err: unknown) {
    const status = err instanceof HttpError ? err.status : 500
    const msg = err instanceof HttpError ? err.message : 'No se pudo completar la operación MCP.'
    if (!res.headersSent) {
      res.status(status).json({ error: msg })
    }
  }
}
