import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ToolDefinition, ToolHandler as IToolHandler } from '../types/index.js';
import axios from 'axios';

/**
 * Handles tool-related requests and connects them to tool implementations
 */
export class ToolHandler {
  constructor(
    private server: Server,
    private toolDefinitions: ToolDefinition[],
    private toolHandlers: Map<string, IToolHandler>
  ) {
    this.setupHandlers();
  }

  private setupHandlers() {
    this.setupListTools();
    this.setupCallTool();
  }

  private setupListTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.toolDefinitions,
    }));
  }

  private setupCallTool() {
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
}
