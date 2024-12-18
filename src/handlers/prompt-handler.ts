import { ListPromptsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

/**
 * Handles prompt requests
 */
export class PromptHandler {
  constructor(private server: Server) {
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
      prompts: [
        {
          id: 'create_collection',
          name: 'Create Collection',
          description: 'Create a new Postman collection with specified endpoints',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              endpoints: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    path: { type: 'string' },
                    method: { type: 'string' },
                    description: { type: 'string' },
                  },
                },
              },
            },
            required: ['name', 'endpoints'],
          },
        },
        {
          id: 'create_environment',
          name: 'Create Environment',
          description: 'Create a new Postman environment with variables',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              variables: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    key: { type: 'string' },
                    value: { type: 'string' },
                    type: { type: 'string', enum: ['default', 'secret'] },
                  },
                },
              },
            },
            required: ['name', 'variables'],
          },
        },
      ],
    }));
  }
}
