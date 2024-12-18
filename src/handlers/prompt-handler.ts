import { ListPromptsRequestSchema, GetPromptRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

interface Endpoint {
  path: string;
  method: string;
  description?: string;
}

interface Variable {
  key: string;
  value: string;
  type: 'default' | 'secret';
}

interface Schema {
  type: 'openapi' | 'graphql' | 'raml';
  content: string;
}

interface Schedule {
  cron: string;
  timezone: string;
}

interface CreateCollectionArgs {
  name: string;
  description?: string;
  endpoints: Endpoint[];
}

interface CreateEnvironmentArgs {
  name: string;
  variables: Variable[];
}

interface CreateApiArgs {
  name: string;
  description?: string;
  schema: Schema;
}

interface CreateMockArgs {
  name: string;
  collection: string;
  environment?: string;
  private?: boolean;
}

interface CreateMonitorArgs {
  name: string;
  collection: string;
  environment?: string;
  schedule: Schedule;
}

function isEndpoint(obj: any): obj is Endpoint {
  return typeof obj === 'object' && obj !== null
    && typeof obj.path === 'string'
    && typeof obj.method === 'string'
    && (obj.description === undefined || typeof obj.description === 'string');
}

function isCreateCollectionArgs(obj: any): obj is CreateCollectionArgs {
  return typeof obj === 'object' && obj !== null
    && typeof obj.name === 'string'
    && Array.isArray(obj.endpoints)
    && obj.endpoints.every(isEndpoint)
    && (obj.description === undefined || typeof obj.description === 'string');
}

function isVariable(obj: any): obj is Variable {
  return typeof obj === 'object' && obj !== null
    && typeof obj.key === 'string'
    && typeof obj.value === 'string'
    && (obj.type === 'default' || obj.type === 'secret');
}

function isCreateEnvironmentArgs(obj: any): obj is CreateEnvironmentArgs {
  return typeof obj === 'object' && obj !== null
    && typeof obj.name === 'string'
    && Array.isArray(obj.variables)
    && obj.variables.every(isVariable);
}

function isSchema(obj: any): obj is Schema {
  return typeof obj === 'object' && obj !== null
    && (obj.type === 'openapi' || obj.type === 'graphql' || obj.type === 'raml')
    && typeof obj.content === 'string';
}

function isCreateApiArgs(obj: any): obj is CreateApiArgs {
  return typeof obj === 'object' && obj !== null
    && typeof obj.name === 'string'
    && isSchema(obj.schema)
    && (obj.description === undefined || typeof obj.description === 'string');
}

function isCreateMockArgs(obj: any): obj is CreateMockArgs {
  return typeof obj === 'object' && obj !== null
    && typeof obj.name === 'string'
    && typeof obj.collection === 'string'
    && (obj.environment === undefined || typeof obj.environment === 'string')
    && (obj.private === undefined || typeof obj.private === 'boolean');
}

function isSchedule(obj: any): obj is Schedule {
  return typeof obj === 'object' && obj !== null
    && typeof obj.cron === 'string'
    && typeof obj.timezone === 'string';
}

function isCreateMonitorArgs(obj: any): obj is CreateMonitorArgs {
  return typeof obj === 'object' && obj !== null
    && typeof obj.name === 'string'
    && typeof obj.collection === 'string'
    && (obj.environment === undefined || typeof obj.environment === 'string')
    && isSchedule(obj.schedule);
}

/**
 * Handles prompt requests
 */
export class PromptHandler {
  constructor(private server: Server) {
    this.setupHandlers();
  }

  private setupHandlers() {
    this.setupListPrompts();
    this.setupGetPrompt();
  }

  private setupListPrompts() {
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
        {
          id: 'create_api',
          name: 'Create API',
          description: 'Create a new API definition with schema and collection',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['openapi', 'graphql', 'raml'] },
                  content: { type: 'string' },
                },
              },
            },
            required: ['name', 'schema'],
          },
        },
        {
          id: 'create_mock',
          name: 'Create Mock Server',
          description: 'Create a new mock server for a collection',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              collection: { type: 'string' },
              environment: { type: 'string' },
              private: { type: 'boolean' },
            },
            required: ['name', 'collection'],
          },
        },
        {
          id: 'create_monitor',
          name: 'Create Monitor',
          description: 'Create a new monitor for a collection',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              collection: { type: 'string' },
              environment: { type: 'string' },
              schedule: {
                type: 'object',
                properties: {
                  cron: { type: 'string' },
                  timezone: { type: 'string' },
                },
              },
            },
            required: ['name', 'collection', 'schedule'],
          },
        }
      ],
    }));
  }

  private setupGetPrompt() {
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_collection': {
            if (!args || !isCreateCollectionArgs(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid parameters for create_collection');
            }

            return {
              messages: [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: `Create a new Postman collection named "${args.name}" with the following endpoints:\n\n` +
                      args.endpoints.map(endpoint =>
                        `${endpoint.method} ${endpoint.path}${endpoint.description ? ` - ${endpoint.description}` : ''}`
                      ).join('\n')
                  }
                }
              ]
            };
          }

          case 'create_environment': {
            if (!args || !isCreateEnvironmentArgs(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid parameters for create_environment');
            }

            return {
              messages: [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: `Create a new Postman environment named "${args.name}" with the following variables:\n\n` +
                      args.variables.map(variable =>
                        `${variable.key}: ${variable.type === 'secret' ? '[SECURE]' : variable.value}`
                      ).join('\n')
                  }
                }
              ]
            };
          }

          case 'create_api': {
            if (!args || !isCreateApiArgs(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid parameters for create_api');
            }

            return {
              messages: [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: `Create a new API definition named "${args.name}" with ${args.schema.type} schema:\n\n` +
                      `Description: ${args.description || 'N/A'}\n` +
                      `Schema Content:\n${args.schema.content}`
                  }
                }
              ]
            };
          }

          case 'create_mock': {
            if (!args || !isCreateMockArgs(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid parameters for create_mock');
            }

            return {
              messages: [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: `Create a new mock server named "${args.name}" for collection "${args.collection}":\n\n` +
                      `Environment: ${args.environment || 'None'}\n` +
                      `Access: ${args.private ? 'Private' : 'Public'}`
                  }
                }
              ]
            };
          }

          case 'create_monitor': {
            if (!args || !isCreateMonitorArgs(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid parameters for create_monitor');
            }

            return {
              messages: [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: `Create a new monitor named "${args.name}" for collection "${args.collection}":\n\n` +
                      `Environment: ${args.environment || 'None'}\n` +
                      `Schedule: ${args.schedule.cron} (${args.schedule.timezone})`
                  }
                }
              ]
            };
          }

          default:
            throw new McpError(ErrorCode.InvalidRequest, `Unknown prompt: ${name}`);
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
      }
    });
  }
}
