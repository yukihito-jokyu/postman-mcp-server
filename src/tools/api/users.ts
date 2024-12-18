import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { ToolHandler, ToolDefinition, ToolCallResponse } from '../../types.js';

export class UserTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  async handleToolCall(name: string, args: unknown): Promise<ToolCallResponse> {
    switch (name) {
      case 'get_user_info':
        return await this.getUserInfo();
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  }

  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'get_user_info',
        description: 'Get information about the authenticated user',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ];
  }

  async getUserInfo(): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get('/me');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }
}
