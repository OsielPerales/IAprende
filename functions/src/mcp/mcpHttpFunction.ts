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

function setCorsHeaders(res: any) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id')
}

export async function handleMcpHttp(req: any, res: any) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') { res.status(204).send(''); return }

  try {
    const server = createMcpServer()
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode
      enableJsonResponse: true,
    })

    await server.connect(transport)
    await transport.handleRequest(req as any, res as any, req.body)
    await server.close()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[mcpHttpFunction]', msg)
    if (!res.headersSent) {
      res.status(500).json({ error: msg })
    }
  }
}
