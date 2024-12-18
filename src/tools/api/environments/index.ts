import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  ToolCallResponse,
  ToolDefinition,
  ToolHandler,
} from '../../../types/index.js';

import { TOOL_DEFINITIONS } from './definitions.js';

export class EnvironmentTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  getToolDefinitions(): ToolDefinition[] {
    return TOOL_DEFINITIONS;
  }

  private createResponse(data: any): ToolCallResponse {
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  }

  async handleToolCall(name: string, args: any): Promise<ToolCallResponse> {
    try {
      switch (name) {
        case 'list_environments':
          return await this.listEnvironments(args.workspace);
        case 'get_environment':
          return await this.getEnvironment(args.environmentId);
        case 'create_environment':
          return await this.createEnvironment(args);
        case 'update_environment':
          return await this.updateEnvironment(args);
        case 'delete_environment':
          return await this.deleteEnvironment(args.environmentId);
        case 'fork_environment':
          return await this.createEnvironmentFork(args);
        case 'get_environment_forks':
          return await this.getEnvironmentForks(args);
        case 'merge_environment_fork':
          return await this.mergeEnvironmentFork(args);
        case 'pull_environment':
          return await this.pullEnvironment(args);
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      throw error;
    }
  }

  async listEnvironments(workspace?: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get('/environments', {
      params: workspace ? { workspace } : undefined
    });
    return this.createResponse(response.data);
  }

  async getEnvironment(environmentId: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get(`/environments/${environmentId}`);
    return this.createResponse(response.data);
  }

  async createEnvironment(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post('/environments', {
      environment: args.environment,
      workspace: args.workspace ? { id: args.workspace, type: 'workspace' } : undefined
    });
    return this.createResponse(response.data);
  }

  async updateEnvironment(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.put(
      `/environments/${args.environmentId}`,
      { environment: args.environment }
    );
    return this.createResponse(response.data);
  }

  async deleteEnvironment(environmentId: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(`/environments/${environmentId}`);
    return this.createResponse(response.data);
  }

  async createEnvironmentFork(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post(`/environments/${args.environmentId}/forks`, {
      forkName: args.label,
      workspace: { id: args.workspace, type: 'workspace' }
    });
    return this.createResponse(response.data);
  }

  async getEnvironmentForks(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get(`/environments/${args.environmentId}/forks`, {
      params: {
        cursor: args.cursor,
        direction: args.direction,
        limit: args.limit,
        sort: args.sort
      }
    });
    return this.createResponse(response.data);
  }

  async mergeEnvironmentFork(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post(`/environments/${args.environmentId}/merges`, {
      source: args.source,
      destination: args.destination,
      deleteSource: args.strategy?.deleteSource
    });
    return this.createResponse(response.data);
  }

  async pullEnvironment(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post(`/environments/${args.environmentId}/pulls`, {
      source: args.source,
      destination: args.destination
    });
    return this.createResponse(response.data);
  }
}
