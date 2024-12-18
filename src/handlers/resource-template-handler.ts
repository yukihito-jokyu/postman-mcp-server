import { ListResourceTemplatesRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

/**
 * Handles resource template requests
 */
export class ResourceTemplateHandler {
  constructor(private server: Server) {
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
      resourceTemplates: [
        {
          uriTemplate: 'postman://workspaces/{workspaceId}/collections',
          name: 'Workspace Collections',
          description: 'List of collections in a specific workspace',
          mimeType: 'application/json',
        },
        {
          uriTemplate: 'postman://workspaces/{workspaceId}/environments',
          name: 'Workspace Environments',
          description: 'List of environments in a specific workspace',
          mimeType: 'application/json',
        },
      ],
    }));
  }
}
