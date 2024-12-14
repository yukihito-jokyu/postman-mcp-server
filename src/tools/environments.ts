import { AxiosInstance } from 'axios';
import { ToolHandler, CreateEnvironmentArgs, UpdateEnvironmentArgs, EnvironmentValue } from '../types.js';

export class EnvironmentTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  async listEnvironments(workspace_id: string) {
    const response = await this.axiosInstance.get(`/workspaces/${workspace_id}/environments`);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async getEnvironment(environment_id: string) {
    const response = await this.axiosInstance.get(`/environments/${environment_id}`);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async createEnvironment({ workspace_id, name, values }: CreateEnvironmentArgs) {
    const response = await this.axiosInstance.post('/environments', {
      environment: {
        name,
        values: values.map((v: EnvironmentValue) => ({
          ...v,
          type: v.type || 'default',
          enabled: v.enabled !== false
        }))
      },
      workspace: {
        id: workspace_id,
        type: 'workspace'
      }
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async updateEnvironment({ environment_id, name, values }: UpdateEnvironmentArgs) {
    const response = await this.axiosInstance.put(`/environments/${environment_id}`, {
      environment: {
        name,
        values: values.map((v: EnvironmentValue) => ({
          ...v,
          type: v.type || 'default',
          enabled: v.enabled !== false
        }))
      }
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async deleteEnvironment(environment_id: string) {
    const response = await this.axiosInstance.delete(`/environments/${environment_id}`);
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
