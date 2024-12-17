import { AxiosInstance } from 'axios';
import { ToolHandler, ToolDefinition } from '../types.js';

export class UserTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

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

  async getUserInfo() {
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
}
