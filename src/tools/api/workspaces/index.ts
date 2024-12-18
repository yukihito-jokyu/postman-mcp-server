import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  ToolCallResponse,
  ToolDefinition,
  ToolHandler,
} from '../../../types/index.js';
import { TOOL_DEFINITIONS } from './definitions.js';

export class WorkspaceTools implements ToolHandler {
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
        case 'list_workspaces':
          return await this.listWorkspaces(args);
        case 'get_workspace':
          return await this.getWorkspace(args.workspace, args.include);
        case 'create_workspace':
          return await this.createWorkspace(args);
        case 'update_workspace':
          return await this.updateWorkspace(args.workspace_id, args);
        case 'delete_workspace':
          return await this.deleteWorkspace(args.workspace_id);
        case 'get_global_variables':
          return await this.getGlobalVariables(args.workspace_id);
        case 'update_global_variables':
          return await this.updateGlobalVariables(args.workspace_id, args.variables);
        case 'get_workspace_roles':
          return await this.getWorkspaceRoles(args.workspace_id, args.includeScimQuery);
        case 'update_workspace_roles':
          return await this.updateWorkspaceRoles(args.workspace_id, args.operations, args.identifierType);
        case 'get_all_workspace_roles':
          return await this.getAllWorkspaceRoles();
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

  async listWorkspaces(params?: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get('/workspaces', { params });
    return this.createResponse(response.data);
  }

  async getWorkspace(workspace_id: string, include?: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get(`/workspaces/${workspace_id}`, {
      params: { include }
    });
    return this.createResponse(response.data);
  }

  async createWorkspace(data: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post('/workspaces', data);
    return this.createResponse(response.data);
  }

  async updateWorkspace(workspace_id: string, data: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.put(`/workspaces/${workspace_id}`, data);
    return this.createResponse(response.data);
  }

  async deleteWorkspace(workspace_id: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(`/workspaces/${workspace_id}`);
    return this.createResponse(response.data);
  }

  async getGlobalVariables(workspace_id: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get(`/workspaces/${workspace_id}/global-variables`);
    return this.createResponse(response.data);
  }

  async updateGlobalVariables(workspace_id: string, variables: any[]): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.put(
      `/workspaces/${workspace_id}/global-variables`,
      { variables }
    );
    return this.createResponse(response.data);
  }

  async getWorkspaceRoles(workspace_id: string, includeScimQuery?: boolean): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get(`/workspaces/${workspace_id}/roles`, {
      params: { includeScimQuery }
    });
    return this.createResponse(response.data);
  }

  async updateWorkspaceRoles(workspace_id: string, operations: any[], identifierType?: string): Promise<ToolCallResponse> {
    if (operations.length > 50) {
      throw new McpError(ErrorCode.InvalidRequest, 'Maximum 50 role operations allowed per request');
    }

    const response = await this.axiosInstance.patch(
      `/workspaces/${workspace_id}/roles`,
      { operations },
      { params: { identifierType } }
    );
    return this.createResponse(response.data);
  }

  async getAllWorkspaceRoles(): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get('/workspaces-roles');
    return this.createResponse(response.data);
  }
}
