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

  async listEnvironments(workspace_id?: string) {
    try {
      const response = await this.axiosInstance.get('/environments', {
        params: workspace_id ? { workspace: workspace_id } : undefined
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

  async getEnvironment(environment_id: string) {
    try {
      const response = await this.axiosInstance.get(`/environments/${environment_id}`);
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
      const { workspace_id, name, values } = args;

      const response = await this.axiosInstance.post('/environments', {
        environment: {
          name,
          values: values.map((v: EnvironmentValue) => ({
            ...v,
            type: v.type || 'default',
            enabled: v.enabled !== false
          }))
        },
        workspace: workspace_id ? {
          id: workspace_id,
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
      const { environment_id, name, values } = args;

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

  async deleteEnvironment(environment_id: string) {
    try {
      const response = await this.axiosInstance.delete(`/environments/${environment_id}`);
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
      const { environment_id, workspace_id } = args;

      const response = await this.axiosInstance.post(`/environments/${environment_id}/forks`, {
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
      const { environment_id, cursor, direction, limit, sort_by } = args;

      const response = await this.axiosInstance.get(`/environments/${environment_id}/forks`, {
        params: {
          cursor,
          direction,
          limit,
          sort: sort_by
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
      const { environment_id } = args;

      const response = await this.axiosInstance.post(`/environments/${environment_id}/merges`);

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
      const { environment_id } = args;

      const response = await this.axiosInstance.post(`/environments/${environment_id}/pulls`);

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
}
