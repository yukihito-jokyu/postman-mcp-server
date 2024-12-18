import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  constructEnvironmentUid,
  CreateEnvironmentArgs,
  ForkEnvironmentArgs,
  GetEnvironmentForksArgs,
  isCreateEnvironmentArgs,
  isEnvironmentIdArg,
  isForkEnvironmentArgs,
  isGetEnvironmentForksArgs,
  isMergeEnvironmentForkArgs,
  isPullEnvironmentArgs,
  isUpdateEnvironmentArgs,
  isValidUid,
  isWorkspaceArg,
  MergeEnvironmentForkArgs,
  PullEnvironmentArgs,
  ToolCallResponse,
  ToolDefinition,
  ToolHandler,
  UpdateEnvironmentArgs,
  validateArgs
} from '../../../types/index.js';


import { TOOL_DEFINITIONS } from './definitions.js';

export class EnvironmentTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  getToolDefinitions(): ToolDefinition[] {
    return TOOL_DEFINITIONS;
  }

  async handleToolCall(name: string, args: unknown): Promise<ToolCallResponse> {
    switch (name) {
      case 'list_environments':
        return await this.listEnvironments(
          validateArgs(args, isWorkspaceArg, 'Invalid workspace argument').workspace
        );
      case 'get_environment':
        return await this.getEnvironment(
          validateArgs(args, isEnvironmentIdArg, 'Invalid environment ID argument').environmentId
        );
      case 'create_environment':
        return await this.createEnvironment(
          validateArgs(args, isCreateEnvironmentArgs, 'Invalid create environment arguments')
        );
      case 'update_environment':
        return await this.updateEnvironment(
          validateArgs(args, isUpdateEnvironmentArgs, 'Invalid update environment arguments')
        );
      case 'delete_environment':
        return await this.deleteEnvironment(
          validateArgs(args, isEnvironmentIdArg, 'Invalid environment ID argument').environmentId
        );
      case 'fork_environment':
        return await this.createEnvironmentFork(
          validateArgs(args, isForkEnvironmentArgs, 'Invalid fork environment arguments')
        );
      case 'get_environment_forks':
        return await this.getEnvironmentForks(
          validateArgs(args, isGetEnvironmentForksArgs, 'Invalid get environment forks arguments')
        );
      case 'merge_environment_fork':
        return await this.mergeEnvironmentFork(
          validateArgs(args, isMergeEnvironmentForkArgs, 'Invalid merge environment fork arguments')
        );
      case 'pull_environment':
        return await this.pullEnvironment(
          validateArgs(args, isPullEnvironmentArgs, 'Invalid pull environment arguments')
        );
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  }

  // Utility methods for common operations
  private validateEnvironmentId(environmentId: string) {
    if (!isValidUid(environmentId)) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        'Invalid environment ID format. Expected format: {ownerId}-{environmentId}'
      );
    }
  }

  private handleApiError(error: any): never {
    if (error.response?.status === 401) {
      throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
    }
    if (error.response?.status === 404) {
      throw new McpError(ErrorCode.InvalidRequest, 'Environment not found');
    }
    if (error.response?.status === 400) {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid request');
    }
    throw new McpError(ErrorCode.InternalError, 'Server error occurred');
  }

  private createToolResponse(data: any): ToolCallResponse {
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  }

  private addUidToResponse(response: any) {
    return {
      ...response,
      uid: constructEnvironmentUid(response.owner, response.id)
    };
  }

  // API methods
  async listEnvironments(workspace?: string): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get('/environments', {
        params: workspace ? { workspace } : undefined
      });
      const environments = response.data.environments.map(this.addUidToResponse);
      return this.createToolResponse({ environments });
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async getEnvironment(environmentId: string): Promise<ToolCallResponse> {
    this.validateEnvironmentId(environmentId);
    try {
      const response = await this.axiosInstance.get(`/environments/${environmentId}`);
      return this.createToolResponse(this.addUidToResponse(response.data));
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async createEnvironment(args: CreateEnvironmentArgs): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.post('/environments', {
        environment: {
          name: args.environment.name,
          values: args.environment.values.map(v => ({
            key: v.key,
            value: v.value,
            type: v.type || 'default',
            enabled: v.enabled !== false
          }))
        },
        workspace: args.workspace ? { id: args.workspace, type: 'workspace' } : undefined
      });
      return this.createToolResponse(this.addUidToResponse(response.data));
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async updateEnvironment(args: UpdateEnvironmentArgs): Promise<ToolCallResponse> {
    this.validateEnvironmentId(args.environmentId);
    try {
      const requestBody = {
        environment: {
          ...(args.environment.name && { name: args.environment.name }),
          ...(args.environment.values && {
            values: args.environment.values.map(v => ({
              key: v.key,
              value: v.value,
              type: v.type || 'default',
              enabled: v.enabled !== false
            }))
          })
        }
      };
      const response = await this.axiosInstance.put(
        `/environments/${args.environmentId}`,
        requestBody
      );
      return this.createToolResponse(this.addUidToResponse(response.data));
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async deleteEnvironment(environmentId: string): Promise<ToolCallResponse> {
    this.validateEnvironmentId(environmentId);
    try {
      const response = await this.axiosInstance.delete(`/environments/${environmentId}`);
      return this.createToolResponse(response.data);
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async createEnvironmentFork(args: ForkEnvironmentArgs): Promise<ToolCallResponse> {
    this.validateEnvironmentId(args.environmentId);
    try {
      const response = await this.axiosInstance.post(`/environments/${args.environmentId}/forks`, {
        forkName: args.label,
        workspace: { id: args.workspace, type: 'workspace' }
      });
      return this.createToolResponse(this.addUidToResponse(response.data));
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async getEnvironmentForks(args: GetEnvironmentForksArgs): Promise<ToolCallResponse> {
    this.validateEnvironmentId(args.environmentId);
    try {
      const response = await this.axiosInstance.get(`/environments/${args.environmentId}/forks`, {
        params: {
          cursor: args.cursor,
          direction: args.direction,
          limit: args.limit,
          sort: args.sort
        }
      });
      const forks = response.data.forks.map(this.addUidToResponse);
      return this.createToolResponse({ forks });
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async mergeEnvironmentFork(args: MergeEnvironmentForkArgs): Promise<ToolCallResponse> {
    this.validateEnvironmentId(args.environmentId);
    try {
      const response = await this.axiosInstance.post(`/environments/${args.environmentId}/merges`, {
        source: args.source,
        destination: args.destination,
        deleteSource: args.strategy?.deleteSource
      });
      return this.createToolResponse(this.addUidToResponse(response.data));
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async pullEnvironment(args: PullEnvironmentArgs): Promise<ToolCallResponse> {
    this.validateEnvironmentId(args.environmentId);
    try {
      const response = await this.axiosInstance.post(`/environments/${args.environmentId}/pulls`, {
        source: args.source,
        destination: args.destination
      });
      return this.createToolResponse(this.addUidToResponse(response.data));
    } catch (error) {
      this.handleApiError(error);
    }
  }
}
