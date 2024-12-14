import { AxiosInstance } from 'axios';
import { ToolHandler } from '../types.js';

interface ListWorkspacesParams {
  type?: 'personal' | 'team' | 'private' | 'public' | 'partner';
  createdBy?: string;
  include?: string;
}

interface WorkspaceBase {
  name: string;
  description?: string;
  type: 'personal' | 'team' | 'private' | 'public' | 'partner';
  visibility?: 'personal' | 'team' | 'private' | 'public' | 'partner';
}

interface CreateWorkspaceRequest extends WorkspaceBase {
  // Additional fields specific to creation
}

interface UpdateWorkspaceRequest extends Partial<WorkspaceBase> {
  // Partial allows all fields to be optional for updates
}

interface GlobalVariable {
  key: string;
  value: string;
  type?: 'default' | 'secret';
  enabled?: boolean;
}

type WorkspaceRole = 'Viewer' | 'Editor' | 'Admin';

interface RoleUpdate {
  op: 'add' | 'remove';
  path: string;
  value: WorkspaceRole;
}

export class WorkspaceTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  async listWorkspaces(params?: ListWorkspacesParams) {
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
      return {
        content: [
          {
            type: 'text',
            text: `Error listing workspaces: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async getWorkspace(workspace_id: string, include?: string) {
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
      return {
        content: [
          {
            type: 'text',
            text: `Error getting workspace: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async createWorkspace(data: CreateWorkspaceRequest) {
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
      return {
        content: [
          {
            type: 'text',
            text: `Error creating workspace: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async updateWorkspace(workspace_id: string, data: UpdateWorkspaceRequest) {
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
      return {
        content: [
          {
            type: 'text',
            text: `Error updating workspace: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async deleteWorkspace(workspace_id: string) {
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
      return {
        content: [
          {
            type: 'text',
            text: `Error deleting workspace: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async getGlobalVariables(workspace_id: string) {
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
      return {
        content: [
          {
            type: 'text',
            text: `Error getting global variables: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async updateGlobalVariables(workspace_id: string, variables: GlobalVariable[]) {
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
      return {
        content: [
          {
            type: 'text',
            text: `Error updating global variables: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async getWorkspaceRoles(workspace_id: string, includeScimQuery?: boolean) {
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
      return {
        content: [
          {
            type: 'text',
            text: `Error getting workspace roles: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async updateWorkspaceRoles(
    workspace_id: string,
    operations: RoleUpdate[],
    identifierType?: string
  ) {
    try {
      if (operations.length > 50) {
        throw new Error('Maximum 50 role operations allowed per request');
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
      return {
        content: [
          {
            type: 'text',
            text: `Error updating workspace roles: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async getAllWorkspaceRoles() {
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
      return {
        content: [
          {
            type: 'text',
            text: `Error getting all workspace roles: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
}
