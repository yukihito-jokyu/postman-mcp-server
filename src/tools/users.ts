import { AxiosInstance } from 'axios';
import { ToolHandler } from '../types.js';

export class UserTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

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
