import { ListResourcesRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

/**
 * Handles direct resource requests
 */
export class ResourceHandler {
  constructor(private server: Server) {
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'postman://workspaces',
          name: 'Postman Workspaces',
          description: 'List of all available Postman workspaces',
          mimeType: 'application/json',
        },
        {
          uri: 'postman://user',
          name: 'Current User',
          description: 'Information about the currently authenticated user',
          mimeType: 'application/json',
        },
      ],
    }));
  }
}
