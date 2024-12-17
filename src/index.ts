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
import {
  validateArgs,
  isWorkspaceArg,
  isEnvironmentIdArg,
  isCollectionIdArg,
  isCreateEnvironmentArgs,
  isUpdateEnvironmentArgs,
  isCreateCollectionArgs,
  isUpdateCollectionArgs,
  isForkCollectionArgs,
} from './types.js';

const API_KEY = process.env.POSTMAN_API_KEY;
if (!API_KEY) {
  throw new Error('POSTMAN_API_KEY environment variable is required');
}

class PostmanAPIServer {
  private server: Server;
  private axiosInstance;
  private workspaceTools: WorkspaceTools;
  private environmentTools: EnvironmentTools;
  private collectionTools: CollectionTools;
  private userTools: UserTools;

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

    this.setupHandlers();

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers() {
    // List Resources handler
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

    // List Resource Templates handler
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

    // List Prompts handler
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

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // Existing workspace tools
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
              workspace: {
                type: 'string',
                description: 'Workspace ID',
              },
            },
            required: ['workspace'],
          },
        },
        // Environment management tools
        {
          name: 'list_environments',
          description: 'List all environments in a workspace',
          inputSchema: {
            type: 'object',
            properties: {
              workspace: {
                type: 'string',
                description: 'Workspace ID',
              },
            },
            required: ['workspace'],
          },
        },
        {
          name: 'get_environment',
          description: 'Get details of a specific environment',
          inputSchema: {
            type: 'object',
            properties: {
              environmentId: {
                type: 'string',
                description: 'Environment ID in format: {ownerId}-{environmentId} (e.g., "31912785-b8cdb26a-0c58-4f35-9775-4945c39d7ee2")',
              },
            },
            required: ['environmentId'],
          },
        },
        {
          name: 'create_environment',
          description: 'Create a new environment in a workspace',
          inputSchema: {
            type: 'object',
            properties: {
              workspace: {
                type: 'string',
                description: 'Workspace ID',
              },
              name: {
                type: 'string',
                description: 'Environment name',
              },
              values: {
                type: 'array',
                description: 'Environment variables',
                items: {
                  type: 'object',
                  properties: {
                    key: { type: 'string' },
                    value: { type: 'string' },
                    type: { type: 'string', enum: ['default', 'secret'] },
                    enabled: { type: 'boolean' },
                  },
                  required: ['key', 'value'],
                },
              },
            },
            required: ['workspace', 'name', 'values'],
          },
        },
        {
          name: 'update_environment',
          description: 'Update an existing environment',
          inputSchema: {
            type: 'object',
            properties: {
              environmentId: {
                type: 'string',
                description: 'Environment ID in format: {ownerId}-{environmentId} (e.g., "31912785-b8cdb26a-0c58-4f35-9775-4945c39d7ee2")',
              },
              name: {
                type: 'string',
                description: 'Environment name',
              },
              values: {
                type: 'array',
                description: 'Environment variables',
                items: {
                  type: 'object',
                  properties: {
                    key: { type: 'string' },
                    value: { type: 'string' },
                    type: { type: 'string', enum: ['default', 'secret'] },
                    enabled: { type: 'boolean' },
                  },
                  required: ['key', 'value'],
                },
              },
            },
            required: ['environmentId', 'name', 'values'],
          },
        },
        {
          name: 'delete_environment',
          description: 'Delete an environment',
          inputSchema: {
            type: 'object',
            properties: {
              environmentId: {
                type: 'string',
                description: 'Environment ID in format: {ownerId}-{environmentId} (e.g., "31912785-b8cdb26a-0c58-4f35-9775-4945c39d7ee2")',
              },
            },
            required: ['environmentId'],
          },
        },
        // Enhanced collection management tools
        {
          name: 'list_collections',
          description: 'List all collections in a workspace',
          inputSchema: {
            type: 'object',
            properties: {
              workspace: {
                type: 'string',
                description: 'Workspace ID',
              },
            },
            required: ['workspace'],
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
          name: 'create_collection',
          description: 'Create a new collection in a workspace',
          inputSchema: {
            type: 'object',
            properties: {
              workspace: {
                type: 'string',
                description: 'Workspace ID',
              },
              name: {
                type: 'string',
                description: 'Collection name',
              },
              description: {
                type: 'string',
                description: 'Collection description',
              },
              schema: {
                type: 'object',
                description: 'Collection schema in Postman Collection format v2.1',
              },
            },
            required: ['workspace', 'name', 'schema'],
          },
        },
        {
          name: 'update_collection',
          description: 'Update an existing collection',
          inputSchema: {
            type: 'object',
            properties: {
              collection_id: {
                type: 'string',
                description: 'Collection ID',
              },
              name: {
                type: 'string',
                description: 'Collection name',
              },
              description: {
                type: 'string',
                description: 'Collection description',
              },
              schema: {
                type: 'object',
                description: 'Collection schema in Postman Collection format v2.1',
              },
            },
            required: ['collection_id', 'name', 'schema'],
          },
        },
        {
          name: 'delete_collection',
          description: 'Delete a collection',
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
          name: 'fork_collection',
          description: 'Fork a collection to a workspace',
          inputSchema: {
            type: 'object',
            properties: {
              collection_id: {
                type: 'string',
                description: 'Collection ID to fork',
              },
              workspace: {
                type: 'string',
                description: 'Destination workspace ID',
              },
              label: {
                type: 'string',
                description: 'Label for the forked collection',
              },
            },
            required: ['collection_id', 'workspace', 'label'],
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
        const args = request.params.arguments || {};

        switch (request.params.name) {
          // Workspace handlers
          case 'list_workspaces':
            return await this.workspaceTools.listWorkspaces();
          case 'get_workspace':
            return await this.workspaceTools.getWorkspace(
              validateArgs(args, isWorkspaceArg, 'Invalid workspace ID argument').workspace
            );

          // Environment handlers
          case 'list_environments':
            return await this.environmentTools.listEnvironments(
              validateArgs(args, isWorkspaceArg, 'Invalid workspace ID argument').workspace
            );
          case 'get_environment':
            return await this.environmentTools.getEnvironment(
              validateArgs(args, isEnvironmentIdArg, 'Invalid environment ID argument').environmentId
            );
          case 'create_environment':
            return await this.environmentTools.createEnvironment(
              validateArgs(args, isCreateEnvironmentArgs, 'Invalid create environment arguments')
            );
          case 'update_environment':
            return await this.environmentTools.updateEnvironment(
              validateArgs(args, isUpdateEnvironmentArgs, 'Invalid update environment arguments')
            );
          case 'delete_environment':
            return await this.environmentTools.deleteEnvironment(
              validateArgs(args, isEnvironmentIdArg, 'Invalid environment ID argument').environmentId
            );

          // Collection handlers
          case 'list_collections':
            return await this.collectionTools.listCollections(
              validateArgs(args, isWorkspaceArg, 'Invalid workspace ID argument').workspace
            );
          case 'get_collection':
            return await this.collectionTools.getCollection(
              validateArgs(args, isCollectionIdArg, 'Invalid collection ID argument').collection_id
            );
          case 'create_collection':
            return await this.collectionTools.createCollection(
              validateArgs(args, isCreateCollectionArgs, 'Invalid create collection arguments')
            );
          case 'update_collection':
            return await this.collectionTools.updateCollection(
              validateArgs(args, isUpdateCollectionArgs, 'Invalid update collection arguments')
            );
          case 'delete_collection':
            return await this.collectionTools.deleteCollection(
              validateArgs(args, isCollectionIdArg, 'Invalid collection ID argument').collection_id
            );
          case 'fork_collection':
            return await this.collectionTools.forkCollection(
              validateArgs(args, isForkCollectionArgs, 'Invalid fork collection arguments')
            );

          // User handlers
          case 'get_user_info':
            return await this.userTools.getUserInfo();

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
