#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const API_KEY = process.env.POSTMAN_API_KEY;
if (!API_KEY) {
  throw new Error('POSTMAN_API_KEY environment variable is required');
}

class PostmanAPIServer {
  private server: Server;
  private axiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: 'postman-api-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      baseURL: 'https://api.getpostman.com',
      headers: {
        'X-Api-Key': API_KEY,
      },
    });

    this.setupToolHandlers();

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_workspaces',
          description: 'List all workspaces',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'get_workspace',
          description: 'Get details of a specific workspace',
          inputSchema: {
            type: 'object',
            properties: {
              workspace_id: {
                type: 'string',
                description: 'Workspace ID',
              },
            },
            required: ['workspace_id'],
          },
        },
        {
          name: 'list_collections',
          description: 'List all collections in a workspace',
          inputSchema: {
            type: 'object',
            properties: {
              workspace_id: {
                type: 'string',
                description: 'Workspace ID',
              },
            },
            required: ['workspace_id'],
          },
        },
        {
          name: 'get_collection',
          description: 'Get details of a specific collection',
          inputSchema: {
            type: 'object',
            properties: {
              collection_id: {
                type: 'string',
                description: 'Collection ID',
              },
            },
            required: ['collection_id'],
          },
        },
        {
          name: 'get_user_info',
          description: 'Get information about the authenticated user',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'list_workspaces': {
            const response = await this.axiosInstance.get('/workspaces');
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case 'get_workspace': {
            const { workspace_id } = request.params.arguments as { workspace_id: string };
            const response = await this.axiosInstance.get(`/workspaces/${workspace_id}`);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case 'list_collections': {
            const { workspace_id } = request.params.arguments as { workspace_id: string };
            const response = await this.axiosInstance.get(`/workspaces/${workspace_id}/collections`);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case 'get_collection': {
            const { collection_id } = request.params.arguments as { collection_id: string };
            const response = await this.axiosInstance.get(`/collections/${collection_id}`);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case 'get_user_info': {
            const response = await this.axiosInstance.get('/me');
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            content: [
              {
                type: 'text',
                text: `Postman API error: ${error.response?.data?.error?.message || error.message}`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Postman API MCP server running on stdio');
  }
}

const server = new PostmanAPIServer();
server.run().catch(console.error);
