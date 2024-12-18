import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
  ToolHandler,
  ToolDefinition,
  ToolCallResponse,
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
  isPullEnvironmentArgs,
  isValidUid,
  constructEnvironmentUid,
  isEnvironmentIdArg,
  isWorkspaceArg
} from '../types.js';

/**
 * Handles Postman environment-related operations
 * @see https://www.postman.com/postman/workspace/postman-public-workspace/documentation/12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a
 */
export class EnvironmentTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

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
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  }

  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'list_environments',
        description: 'List all environments in a workspace',
        inputSchema: {
          type: 'object',
          properties: {
            workspace: {
              type: 'string',
              description: 'Workspace ID',
            },
          },
          required: ['workspace'],
        },
      },
      {
        name: 'get_environment',
        description: 'Get details of a specific environment',
        inputSchema: {
          type: 'object',
          properties: {
            environmentId: {
              type: 'string',
              description: 'Environment ID in format: {ownerId}-{environmentId} (e.g., "31912785-b8cdb26a-0c58-4f35-9775-4945c39d7ee2")',
            },
          },
          required: ['environmentId'],
        },
      },
      {
        name: 'create_environment',
        description: 'Create a new environment in a workspace. Creates in "My Workspace" if workspace not specified.',
        inputSchema: {
          type: 'object',
          properties: {
            environment: {
              type: 'object',
              description: 'Environment details',
              properties: {
                name: {
                  type: 'string',
                  description: 'Environment name',
                },
                values: {
                  type: 'array',
                  description: 'Environment variables',
                  items: {
                    type: 'object',
                    properties: {
                      key: {
                        type: 'string',
                        description: 'Variable name'
                      },
                      value: {
                        type: 'string',
                        description: 'Variable value'
                      },
                      type: {
                        type: 'string',
                        enum: ['default', 'secret'],
                        description: 'Variable type'
                      },
                      enabled: {
                        type: 'boolean',
                        description: 'Variable enabled status'
                      },
                    },
                    required: ['key', 'value'],
                  },
                },
              },
              required: ['name', 'values'],
            },
            workspace: {
              type: 'string',
              description: 'Workspace ID (optional)',
            },
          },
          required: ['environment'],
        },
      },
      {
        name: 'update_environment',
        description: 'Update an existing environment. Only include variables that need to be modified.',
        inputSchema: {
          type: 'object',
          properties: {
            environmentId: {
              type: 'string',
              description: 'Environment ID in format: {ownerId}-{environmentId} (e.g., "31912785-b8cdb26a-0c58-4f35-9775-4945c39d7ee2")',
            },
            environment: {
              type: 'object',
              description: 'Environment details to update',
              properties: {
                name: {
                  type: 'string',
                  description: 'New environment name (optional)',
                },
                values: {
                  type: 'array',
                  description: 'Environment variables to update (optional). Only include variables that need to be modified.',
                  items: {
                    type: 'object',
                    properties: {
                      key: {
                        type: 'string',
                        description: 'Variable name'
                      },
                      value: {
                        type: 'string',
                        description: 'Variable value'
                      },
                      type: {
                        type: 'string',
                        enum: ['default', 'secret'],
                        description: 'Variable type (optional)'
                      },
                      enabled: {
                        type: 'boolean',
                        description: 'Variable enabled status (optional)'
                      },
                    },
                    required: ['key', 'value'],
                  },
                },
              },
            },
          },
          required: ['environmentId', 'environment'],
        },
      },
      {
        name: 'delete_environment',
        description: 'Delete an environment',
        inputSchema: {
          type: 'object',
          properties: {
            environmentId: {
              type: 'string',
              description: 'Environment ID in format: {ownerId}-{environmentId} (e.g., "31912785-b8cdb26a-0c58-4f35-9775-4945c39d7ee2")',
            },
          },
          required: ['environmentId'],
        },
      },
      {
        name: 'fork_environment',
        description: 'Create a fork of an environment in a workspace',
        inputSchema: {
          type: 'object',
          properties: {
            environmentId: {
              type: 'string',
              description: 'Environment ID in format: {ownerId}-{environmentId}',
            },
            label: {
              type: 'string',
              description: 'Label/name for the forked environment',
            },
            workspace: {
              type: 'string',
              description: 'Target workspace ID',
            },
          },
          required: ['environmentId', 'label', 'workspace'],
        },
      },
      {
        name: 'get_environment_forks',
        description: 'Get a list of environment forks',
        inputSchema: {
          type: 'object',
          properties: {
            environmentId: {
              type: 'string',
              description: 'Environment ID in format: {ownerId}-{environmentId}',
            },
            cursor: {
              type: 'string',
              description: 'Pagination cursor',
            },
            direction: {
              type: 'string',
              enum: ['asc', 'desc'],
              description: 'Sort direction',
            },
            limit: {
              type: 'number',
              description: 'Number of results per page',
            },
            sort: {
              type: 'string',
              enum: ['createdAt'],
              description: 'Sort field',
            },
          },
          required: ['environmentId'],
        },
      },
      {
        name: 'merge_environment_fork',
        description: 'Merge a forked environment back into its parent',
        inputSchema: {
          type: 'object',
          properties: {
            environmentId: {
              type: 'string',
              description: 'Environment ID in format: {ownerId}-{environmentId}',
            },
            source: {
              type: 'string',
              description: 'Source environment ID',
            },
            destination: {
              type: 'string',
              description: 'Destination environment ID',
            },
            strategy: {
              type: 'object',
              description: 'Merge strategy options',
              properties: {
                deleteSource: {
                  type: 'boolean',
                  description: 'Whether to delete the source environment after merging',
                },
              },
            },
          },
          required: ['environmentId', 'source', 'destination'],
        },
      },
      {
        name: 'pull_environment',
        description: 'Pull changes from parent environment into forked environment',
        inputSchema: {
          type: 'object',
          properties: {
            environmentId: {
              type: 'string',
              description: 'Environment ID in format: {ownerId}-{environmentId}',
            },
            source: {
              type: 'string',
              description: 'Source (parent) environment ID',
            },
            destination: {
              type: 'string',
              description: 'Destination (fork) environment ID',
            },
          },
          required: ['environmentId', 'source', 'destination'],
        },
      },
    ];
  }

  /**
   * Lists all environments in a workspace
   * @param workspace Optional workspace ID to filter environments
   * @returns List of environments with their details
   */
  async listEnvironments(workspace?: string): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get('/environments', {
        params: workspace ? { workspace } : undefined
      });

      // Transform response to include uid for each environment
      const environments = response.data.environments.map((env: any) => ({
        ...env,
        uid: constructEnvironmentUid(env.owner, env.id)
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ environments }, null, 2),
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

  /**
   * Gets details of a specific environment
   * @param environmentId Environment ID in format: {ownerId}-{environmentId}
   * @returns Environment details
   */
  async getEnvironment(environmentId: string): Promise<ToolCallResponse> {
    if (!isValidUid(environmentId)) {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format. Expected format: {ownerId}-{environmentId}');
    }

    try {
      const response = await this.axiosInstance.get(`/environments/${environmentId}`);

      // Ensure uid is included in response
      const environment = {
        ...response.data,
        uid: constructEnvironmentUid(response.data.owner, response.data.id)
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(environment, null, 2),
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

  /**
   * Creates a new environment in a workspace
   * @param args CreateEnvironmentArgs containing workspace, name, and values
   * @returns Created environment details
   */
  async createEnvironment(args: CreateEnvironmentArgs): Promise<ToolCallResponse> {
    try {
      validateArgs(args, isCreateEnvironmentArgs, 'Invalid create environment arguments');
      const { workspace, environment } = args;

      const response = await this.axiosInstance.post('/environments', {
        environment: {
          name: environment.name,
          values: environment.values.map((v: EnvironmentValue) => ({
            key: v.key,
            value: v.value,
            type: v.type || 'default',
            enabled: v.enabled !== false
          }))
        },
        workspace: workspace ? {
          id: workspace,
          type: 'workspace'
        } : undefined
      });

      // Include uid in response
      const result = {
        ...response.data,
        uid: constructEnvironmentUid(response.data.owner, response.data.id)
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
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

  /**
   * Updates an existing environment. Only modified variables should be included in the request.
   * @param args UpdateEnvironmentArgs containing environmentId and optional name and values
   * @returns Updated environment details
   */
  async updateEnvironment(args: UpdateEnvironmentArgs): Promise<ToolCallResponse> {
    try {
      validateArgs(args, isUpdateEnvironmentArgs, 'Invalid update environment arguments');
      const { environmentId, environment } = args;

      if (!isValidUid(environmentId)) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format. Expected format: {ownerId}-{environmentId}');
      }

      // Construct request body according to Postman API spec
      const requestBody = {
        environment: {} as any
      };

      // Only include optional fields if they are provided
      if (environment.name !== undefined) {
        requestBody.environment.name = environment.name;
      }

      if (environment.values !== undefined) {
        requestBody.environment.values = environment.values.map((v: EnvironmentValue) => ({
          key: v.key,
          value: v.value,
          type: v.type || 'default',
          enabled: v.enabled !== false
        }));
      }

      const response = await this.axiosInstance.put(`/environments/${environmentId}`, requestBody);

      // Include uid in response
      const result = {
        ...response.data,
        uid: constructEnvironmentUid(response.data.owner, response.data.id)
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
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

  /**
   * Deletes an environment
   * @param environmentId Environment ID in format: {ownerId}-{environmentId}
   * @returns Deletion confirmation
   */
  async deleteEnvironment(environmentId: string): Promise<ToolCallResponse> {
    if (!isValidUid(environmentId)) {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format. Expected format: {ownerId}-{environmentId}');
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

  /**
   * Creates a fork of an environment
   * @param args ForkEnvironmentArgs containing environmentId, label, and workspace
   * @returns Forked environment details
   */
  async createEnvironmentFork(args: ForkEnvironmentArgs): Promise<ToolCallResponse> {
    try {
      validateArgs(args, isForkEnvironmentArgs, 'Invalid fork environment arguments');
      const { environmentId, label, workspace } = args;

      if (!isValidUid(environmentId)) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format. Expected format: {ownerId}-{environmentId}');
      }

      const response = await this.axiosInstance.post(`/environments/${environmentId}/forks`, {
        forkName: label,
        workspace: {
          id: workspace,
          type: 'workspace'
        }
      });

      // Include uid in response
      const environment = {
        ...response.data,
        uid: constructEnvironmentUid(response.data.owner, response.data.id)
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(environment, null, 2),
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

  /**
   * Gets a list of environment forks
   * @param args GetEnvironmentForksArgs containing environmentId and optional pagination params
   * @returns List of environment forks
   */
  async getEnvironmentForks(args: GetEnvironmentForksArgs): Promise<ToolCallResponse> {
    try {
      validateArgs(args, isGetEnvironmentForksArgs, 'Invalid get environment forks arguments');
      const { environmentId, cursor, direction, limit, sort } = args;

      if (!isValidUid(environmentId)) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format. Expected format: {ownerId}-{environmentId}');
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

      // Transform response to include uid for each fork
      const forks = response.data.forks.map((fork: any) => ({
        ...fork,
        uid: constructEnvironmentUid(fork.owner, fork.id)
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ forks }, null, 2),
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

  /**
   * Merges a forked environment back into its parent
   * @param args MergeEnvironmentForkArgs containing environmentId, source, destination, and strategy
   * @returns Merge result
   */
  async mergeEnvironmentFork(args: MergeEnvironmentForkArgs): Promise<ToolCallResponse> {
    try {
      validateArgs(args, isMergeEnvironmentForkArgs, 'Invalid merge environment fork arguments');
      const { environmentId, source, destination, strategy } = args;

      if (!isValidUid(environmentId)) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format. Expected format: {ownerId}-{environmentId}');
      }

      const response = await this.axiosInstance.post(`/environments/${environmentId}/merges`, {
        source,
        destination,
        deleteSource: strategy?.deleteSource
      });

      // Include uid in response
      const result = {
        ...response.data,
        uid: constructEnvironmentUid(response.data.owner, response.data.id)
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
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

  /**
   * Pulls changes from parent environment into forked environment
   * @param args PullEnvironmentArgs containing environmentId, source, and destination
   * @returns Pull result
   */
  async pullEnvironment(args: PullEnvironmentArgs): Promise<ToolCallResponse> {
    try {
      validateArgs(args, isPullEnvironmentArgs, 'Invalid pull environment arguments');
      const { environmentId, source, destination } = args;

      if (!isValidUid(environmentId)) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid environment ID format. Expected format: {ownerId}-{environmentId}');
      }

      const response = await this.axiosInstance.post(`/environments/${environmentId}/pulls`, {
        source,
        destination
      });

      // Include uid in response
      const result = {
        ...response.data,
        uid: constructEnvironmentUid(response.data.owner, response.data.id)
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
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
