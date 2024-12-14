import { AxiosInstance } from 'axios';
import { ToolHandler } from '../types.js';

export class WorkspaceTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  async listWorkspaces() {
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

  async getWorkspace(workspace_id: string) {
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
}
