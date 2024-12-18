import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  ToolCallResponse,
  ToolDefinition,
  ToolHandler
} from '../../../types/index.js';
import { TOOL_DEFINITIONS } from './definitions.js';

/**
 * Handles Postman authentication and authorization operations including:
 * - Collection access key management
 * - Workspace and collection role management
 * - User authentication information
 */
export class AuthTools implements ToolHandler {
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
        case 'list_collection_access_keys':
          return await this.listCollectionAccessKeys(args);
        case 'delete_collection_access_key':
          return await this.deleteCollectionAccessKey(args.keyId);
        case 'list_workspace_roles':
          return await this.listWorkspaceRoles();
        case 'get_workspace_roles':
          return await this.getWorkspaceRoles(args);
        case 'update_workspace_roles':
          return await this.updateWorkspaceRoles(args);
        case 'get_collection_roles':
          return await this.getCollectionRoles(args.collectionId);
        case 'update_collection_roles':
          return await this.updateCollectionRoles(args);
        case 'get_authenticated_user':
          return await this.getAuthenticatedUser();
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Forbidden - insufficient permissions');
      }
      throw error;
    }
  }

  /**
   * List collection access keys with optional filtering
   */
  async listCollectionAccessKeys(args: {
    collectionId?: string;
    cursor?: string;
  }): Promise<ToolCallResponse> {
    const params = new URLSearchParams();
    if (args.collectionId) {
      params.append('collectionId', args.collectionId);
    }
    if (args.cursor) {
      params.append('cursor', args.cursor);
    }

    const response = await this.axiosInstance.get('/collection-access-keys', {
      params: params.toString() ? params : undefined
    });
    return this.createResponse(response.data);
  }

  /**
   * Delete a collection access key
   */
  async deleteCollectionAccessKey(keyId: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(`/collection-access-keys/${keyId}`);
    return this.createResponse(response.data);
  }

  /**
   * Get all available workspace roles based on team's plan
   */
  async listWorkspaceRoles(): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get('/workspaces-roles');
    return this.createResponse(response.data);
  }

  /**
   * Get roles for a specific workspace
   */
  async getWorkspaceRoles(args: {
    workspaceId: string;
    includeScim?: boolean;
  }): Promise<ToolCallResponse> {
    const params = new URLSearchParams();
    if (args.includeScim) {
      params.append('include', 'scim');
    }

    const response = await this.axiosInstance.get(
      `/workspaces/${args.workspaceId}/roles`,
      { params: params.toString() ? params : undefined }
    );
    return this.createResponse(response.data);
  }

  /**
   * Update workspace roles for users and groups
   * Limited to 50 operations per call
   */
  async updateWorkspaceRoles(args: {
    workspaceId: string;
    operations: Array<{
      op: 'update';
      path: '/user' | '/group' | '/team';
      value: Array<{
        id: number;
        role: 'VIEWER' | 'EDITOR';
      }>;
    }>;
    identifierType?: 'scim';
  }): Promise<ToolCallResponse> {
    const headers: Record<string, string> = {};
    if (args.identifierType) {
      headers['identifierType'] = args.identifierType;
    }

    const response = await this.axiosInstance.patch(
      `/workspaces/${args.workspaceId}/roles`,
      { roles: args.operations },
      { headers }
    );
    return this.createResponse(response.data);
  }

  /**
   * Get roles for a collection
   */
  async getCollectionRoles(collectionId: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get(`/collections/${collectionId}/roles`);
    return this.createResponse(response.data);
  }

  /**
   * Update collection roles
   * Only users with EDITOR role can use this endpoint
   * Does not support Partner or Guest external roles
   */
  async updateCollectionRoles(args: {
    collectionId: string;
    operations: Array<{
      op: 'update';
      path: '/user' | '/group' | '/team';
      value: Array<{
        id: number;
        role: 'VIEWER' | 'EDITOR';
      }>;
    }>;
  }): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.patch(
      `/collections/${args.collectionId}/roles`,
      { roles: args.operations }
    );
    return this.createResponse(response.data);
  }

  /**
   * Get authenticated user information
   * Returns different response for Guest and Partner roles
   * Returns flow_count only for Free plan users
   */
  async getAuthenticatedUser(): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get('/me');
    return this.createResponse(response.data);
  }
}
