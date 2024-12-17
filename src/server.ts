#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListPromptsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

import { WorkspaceTools } from './tools/workspaces.js';
import { EnvironmentTools } from './tools/environments.js';
import { CollectionTools } from './tools/collections.js';
import { UserTools } from './tools/users.js';
import { ToolDefinition, ToolHandler } from './types.js';

const API_KEY = process.env.POSTMAN_API_KEY;
if (!API_KEY) {
  throw new Error('POSTMAN_API_KEY environment variable is required');
}

export class PostmanAPIServer {
  private server: Server;
  private axiosInstance;
  private workspaceTools: WorkspaceTools;
  private environmentTools: EnvironmentTools;
  private collectionTools: CollectionTools;
  private userTools: UserTools;
  private toolDefinitions: ToolDefinition[];
  private toolHandlers: Map<string, ToolHandler>;

  constructor() {
    this.server = new Server(
      {
        name: 'postman-api-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      baseURL: 'https://api.getpostman.com',
      headers: {
        'X-Api-Key': API_KEY,
      },
    });

    // Initialize tool handlers
    this.workspaceTools = new WorkspaceTools(this.axiosInstance);
    this.environmentTools = new EnvironmentTools(this.axiosInstance);
    this.collectionTools = new CollectionTools(this.axiosInstance);
    this.userTools = new UserTools(this.axiosInstance);

    // Cache tool definitions and create handler map
    this.toolDefinitions = [
      ...this.workspaceTools.getToolDefinitions(),
      ...this.environmentTools.getToolDefinitions(),
      ...this.collectionTools.getToolDefinitions(),
      ...this.userTools.getToolDefinitions(),
    ];

    // Replace forEach loop with direct mapping
    const toolMapping = {
      'list_workspaces': this.workspaceTools,
      'get_workspace': this.workspaceTools,
      'list_environments': this.environmentTools,
      'get_environment': this.environmentTools,
      'create_environment': this.environmentTools,
      'update_environment': this.environmentTools,
      'delete_environment': this.environmentTools,
      'list_collections': this.collectionTools,
      'get_collection': this.collectionTools,
      'create_collection': this.collectionTools,
      'update_collection': this.collectionTools,
      'delete_collection': this.collectionTools,
      'get_user': this.userTools,
      'list_users': this.userTools
    };

    this.toolHandlers = new Map(Object.entries(toolMapping));

    this.setupHandlers();

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers() {
    this.setupResourceHandlers();
    this.setupResourceTemplateHandlers();
    this.setupPromptHandlers();
    this.setupToolHandlers();
  }

  private setupResourceHandlers() {
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

  private setupResourceTemplateHandlers() {
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

  private setupPromptHandlers() {
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

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.toolDefinitions,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args = {} } = request.params;

        // Find the tool definition
        const toolDef = this.toolDefinitions.find(t => t.name === name);
        if (!toolDef) {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
        }

        // Get the appropriate handler
        const handler = this.toolHandlers.get(name);
        if (!handler) {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `No handler found for tool: ${name}`
          );
        }

        // Execute the tool call
        const response = await handler.handleToolCall(name, args);

        // Transform the response to match the SDK's expected format
        return {
          _meta: {},
          tools: [toolDef],
          content: response.content,
          isError: response.isError,
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        if (axios.isAxiosError(error)) {
          return {
            _meta: {},
            tools: [],
            content: [
              {
                type: 'text',
                text: `Postman API error: ${error.response?.data?.error?.message || error.message}`,
              },
            ],
            isError: true,
          };
        }
        throw new McpError(
          ErrorCode.InternalError,
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Postman API MCP server running on stdio');
  }
}
