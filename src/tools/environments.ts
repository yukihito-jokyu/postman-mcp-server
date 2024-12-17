import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
  ToolHandler,
  CreateEnvironmentArgs,
  UpdateEnvironmentArgs,
  EnvironmentValue,
  ForkEnvironmentArgs,
  GetEnvironmentForksArgs,
  MergeEnvironmentForkArgs,
  PullEnvironmentArgs,
  validateArgs,
  isCreateEnvironmentArgs,
  isUpdateEnvironmentArgs,
  isForkEnvironmentArgs,
  isGetEnvironmentForksArgs,
  isMergeEnvironmentForkArgs,
  isPullEnvironmentArgs
} from '../types.js';

export class EnvironmentTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  async listEnvironments(workspace?: string) {
    try {
      const response = await this.axiosInstance.get('/environments', {
        params: workspace ? { workspace } : undefined
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
        throw new McpError(ErrorCode.InvalidRequest, 'Environment not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getEnvironment(environmentId: string) {
    if (!this.isValidUid(environmentId)) {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format');
    }

    try {
      const response = await this.axiosInstance.get(`/environments/${environmentId}`);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, 'Environment not found');
      }
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async createEnvironment(args: CreateEnvironmentArgs) {
    try {
      validateArgs(args, isCreateEnvironmentArgs, 'Invalid create environment arguments');
      const { workspace, name, values } = args;

      const response = await this.axiosInstance.post('/environments', {
        environment: {
          name,
          values: values.map((v: EnvironmentValue) => ({
            ...v,
            type: v.type || 'default',
            enabled: v.enabled !== false
          }))
        },
        workspace: workspace ? {
          id: workspace,
          type: 'workspace'
        } : undefined
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
      if (error.response?.status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, 'Malformed request');
      }
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Forbidden operation');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async updateEnvironment(args: UpdateEnvironmentArgs) {
    try {
      validateArgs(args, isUpdateEnvironmentArgs, 'Invalid update environment arguments');
      const { environmentId, name, values } = args;

      if (!this.isValidUid(environmentId)) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format');
      }

      const response = await this.axiosInstance.put(`/environments/${environmentId}`, {
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
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, 'Malformed request');
      }
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async deleteEnvironment(environmentId: string) {
    if (!this.isValidUid(environmentId)) {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format');
    }

    try {
      const response = await this.axiosInstance.delete(`/environments/${environmentId}`);
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
        throw new McpError(ErrorCode.InvalidRequest, 'Environment not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async createEnvironmentFork(args: ForkEnvironmentArgs) {
    try {
      validateArgs(args, isForkEnvironmentArgs, 'Invalid fork environment arguments');
      const { environmentId, workspace } = args;

      if (!this.isValidUid(environmentId)) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format');
      }

      const response = await this.axiosInstance.post(`/environments/${environmentId}/forks`, {
        workspace: {
          id: workspace,
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
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Environment not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getEnvironmentForks(args: GetEnvironmentForksArgs) {
    try {
      validateArgs(args, isGetEnvironmentForksArgs, 'Invalid get environment forks arguments');
      const { environmentId, cursor, direction, limit, sort } = args;

      if (!this.isValidUid(environmentId)) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format');
      }

      if (direction && !['asc', 'desc'].includes(direction)) {
        throw new McpError(ErrorCode.InvalidRequest, 'Direction must be either "asc" or "desc"');
      }

      if (sort && sort !== 'createdAt') {
        throw new McpError(ErrorCode.InvalidRequest, 'Sort must be "createdAt"');
      }

      const response = await this.axiosInstance.get(`/environments/${environmentId}/forks`, {
        params: {
          cursor,
          direction,
          limit,
          sort
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
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid request parameters');
      }
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Environment not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async mergeEnvironmentFork(args: MergeEnvironmentForkArgs) {
    try {
      validateArgs(args, isMergeEnvironmentForkArgs, 'Invalid merge environment fork arguments');
      const { environmentId } = args;

      if (!this.isValidUid(environmentId)) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format');
      }

      const response = await this.axiosInstance.post(`/environments/${environmentId}/merges`);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid merge request');
      }
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Environment not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async pullEnvironment(args: PullEnvironmentArgs) {
    try {
      validateArgs(args, isPullEnvironmentArgs, 'Invalid pull environment arguments');
      const { environmentId } = args;

      if (!this.isValidUid(environmentId)) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format');
      }

      const response = await this.axiosInstance.post(`/environments/${environmentId}/pulls`);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid pull request');
      }
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Environment not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  private isValidUid(id: string): boolean {
    // Format: userId-uuid, e.g., "12345678-12ece9e1-2abf-4edc-8e34-de66e74114d2"
    return /^\d+-[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/.test(id);
  }
}
