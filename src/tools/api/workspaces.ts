import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  CreateWorkspaceRequest,
  GlobalVariable,
  isWorkspaceArg,
  ListWorkspacesParams,
  RoleUpdate,
  ToolCallResponse,
  ToolDefinition,
  ToolHandler,
  UpdateWorkspaceRequest,
  validateArgs
} from '../../types/index.js';


export class WorkspaceTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  async handleToolCall(name: string, args: unknown): Promise<ToolCallResponse> {
    switch (name) {
      case 'list_workspaces':
        return await this.listWorkspaces();
      case 'get_workspace':
        return await this.getWorkspace(
          validateArgs(args, isWorkspaceArg, 'Invalid workspace argument').workspace
        );
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
        name: 'list_workspaces',
        description: 'List all workspaces',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['personal', 'team', 'private', 'public', 'partner'],
              description: 'Filter workspaces by type',
            },
            createdBy: {
              type: 'string',
              description: 'Filter workspaces by creator',
            },
            include: {
              type: 'string',
              description: 'Additional data to include in response',
            },
          },
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
            include: {
              type: 'string',
              description: 'Additional data to include in response',
            },
          },
          required: ['workspace'],
        },
      },
    ];
  }

  async listWorkspaces(params?: ListWorkspacesParams): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get('/workspaces', { params });
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

  async getWorkspace(workspace_id: string, include?: string): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get(`/workspaces/${workspace_id}`, {
        params: { include },
      });
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
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Workspace not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async createWorkspace(data: CreateWorkspaceRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.post('/workspaces', data);
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
      if (error.response?.status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid workspace data');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async updateWorkspace(workspace_id: string, data: UpdateWorkspaceRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.put(`/workspaces/${workspace_id}`, data);
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
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Workspace not found');
      }
      if (error.response?.status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid workspace data');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async deleteWorkspace(workspace_id: string): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.delete(`/workspaces/${workspace_id}`);
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
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Workspace not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getGlobalVariables(workspace_id: string): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get(`/workspaces/${workspace_id}/global-variables`);
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
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Workspace not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async updateGlobalVariables(workspace_id: string, variables: GlobalVariable[]): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.put(
        `/workspaces/${workspace_id}/global-variables`,
        { variables }
      );
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
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Workspace not found');
      }
      if (error.response?.status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid variables data');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getWorkspaceRoles(workspace_id: string, includeScimQuery?: boolean): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get(`/workspaces/${workspace_id}/roles`, {
        params: { includeScimQuery },
      });
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
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Workspace not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async updateWorkspaceRoles(
    workspace_id: string,
    operations: RoleUpdate[],
    identifierType?: string
  ): Promise<ToolCallResponse> {
    try {
      if (operations.length > 50) {
        throw new McpError(ErrorCode.InvalidRequest, 'Maximum 50 role operations allowed per request');
      }

      const response = await this.axiosInstance.patch(
        `/workspaces/${workspace_id}/roles`,
        { operations },
        { params: { identifierType } }
      );
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
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Workspace not found');
      }
      if (error.response?.status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid role update data');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getAllWorkspaceRoles(): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get('/workspaces-roles');
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
