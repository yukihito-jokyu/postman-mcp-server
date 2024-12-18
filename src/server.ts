#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpError } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import {
  WorkspaceTools,
  EnvironmentTools,
  CollectionTools,
  UserTools,
  ApiTools,
  AuthTools,
  MockTools,
  MonitorTools,
  AdditionalFeatureTools
} from './tools/index.js';
import { ToolDefinition, ToolHandler } from './types/index.js';
import {
  ResourceHandler,
  ResourceTemplateHandler,
  PromptHandler,
  ToolHandler as ToolRequestHandler
} from './handlers/index.js';

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
  private apiTools: ApiTools;
  private authTools: AuthTools;
  private mockTools: MockTools;
  private monitorTools: MonitorTools;
  private additionalFeatureTools: AdditionalFeatureTools;
  private toolDefinitions: ToolDefinition[];
  private toolHandlers: Map<string, ToolHandler>;

  constructor() {
    this.server = new Server(
      {
        name: 'postman-api-server',
        version: '0.2.0',
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
    this.apiTools = new ApiTools(this.axiosInstance);
    this.authTools = new AuthTools(this.axiosInstance);
    this.mockTools = new MockTools(this.axiosInstance);
    this.monitorTools = new MonitorTools(this.axiosInstance);
    this.additionalFeatureTools = new AdditionalFeatureTools(this.axiosInstance);

    // Cache tool definitions and create handler map
    this.toolDefinitions = [
      ...this.workspaceTools.getToolDefinitions(),
      ...this.environmentTools.getToolDefinitions(),
      ...this.collectionTools.getToolDefinitions(),
      ...this.userTools.getToolDefinitions(),
      ...this.apiTools.getToolDefinitions(),
      ...this.authTools.getToolDefinitions(),
      ...this.mockTools.getToolDefinitions(),
      ...this.monitorTools.getToolDefinitions(),
      ...this.additionalFeatureTools.getToolDefinitions(),
    ];

    // Get tool mappings from each tool class
    const toolMapping = {
      ...this.workspaceTools.getToolMappings(),
      ...this.environmentTools.getToolMappings(),
      ...this.collectionTools.getToolMappings(),
      ...this.userTools.getToolMappings(),
      ...this.apiTools.getToolMappings(),
      ...this.authTools.getToolMappings(),
      ...this.mockTools.getToolMappings(),
      ...this.monitorTools.getToolMappings(),
      ...this.additionalFeatureTools.getToolMappings(),
    };

    this.toolHandlers = new Map(Object.entries(toolMapping));

    // Initialize request handlers
    new ResourceHandler(this.server);
    new ResourceTemplateHandler(this.server);
    new PromptHandler(this.server);
    new ToolRequestHandler(this.server, this.toolDefinitions, this.toolHandlers);

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Postman API MCP server running on stdio');
  }
}
