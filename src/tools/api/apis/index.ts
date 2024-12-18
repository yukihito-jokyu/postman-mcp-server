import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  ToolCallResponse,
  ToolDefinition,
  ToolHandler,
} from '../../../types/index.js';
import { TOOL_DEFINITIONS } from './definitions.js';

const V10_ACCEPT_HEADER = 'application/vnd.api.v10+json';

/**
 * Handles API-related operations in the Postman API
 * Implements endpoints for managing APIs, schemas, versions, comments, and tags
 */
export class ApiTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  getToolDefinitions(): ToolDefinition[] {
    return TOOL_DEFINITIONS;
  }

  private createResponse(data: any): ToolCallResponse {
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  }

  private validateCommentLength(content: string) {
    if (content.length > 10000) {
      throw new McpError(ErrorCode.InvalidParams, 'Comment content cannot exceed 10,000 characters');
    }
  }

  /**
   * Handles tool calls for API-related operations
   * @throws {McpError} With appropriate error code and message
   */
  async handleToolCall(name: string, args: any): Promise<ToolCallResponse> {
    try {
      switch (name) {
        case 'list_apis':
          return await this.listApis(args);
        case 'get_api':
          return await this.getApi(args);
        case 'create_api':
          return await this.createApi(args);
        case 'update_api':
          return await this.updateApi(args);
        case 'delete_api':
          return await this.deleteApi(args.apiId);
        case 'add_api_collection':
          return await this.addApiCollection(args);
        case 'get_api_collection':
          return await this.getApiCollection(args);
        case 'create_api_schema':
          return await this.createApiSchema(args);
        case 'get_api_schema':
          return await this.getApiSchema(args);
        case 'create_api_version':
          return await this.createApiVersion(args);
        case 'get_api_versions':
          return await this.getApiVersions(args);
        case 'get_api_version':
          return await this.getApiVersion(args);
        case 'update_api_version':
          return await this.updateApiVersion(args);
        case 'delete_api_version':
          return await this.deleteApiVersion(args);
        case 'get_api_comments':
          return await this.getApiComments(args);
        case 'create_api_comment':
          return await this.createApiComment(args);
        case 'update_api_comment':
          return await this.updateApiComment(args);
        case 'delete_api_comment':
          return await this.deleteApiComment(args);
        case 'get_api_tags':
          return await this.getApiTags(args.apiId);
        case 'update_api_tags':
          return await this.updateApiTags(args);
        case 'get_api_schema_files':
          return await this.getApiSchemaFiles(args);
        case 'get_schema_file_contents':
          return await this.getSchemaFileContents(args);
        case 'create_update_schema_file':
          return await this.createUpdateSchemaFile(args);
        case 'delete_schema_file':
          return await this.deleteSchemaFile(args);
        case 'sync_collection_with_schema':
          return await this.syncCollectionWithSchema(args);
        case 'get_task_status':
          return await this.getTaskStatus(args);
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error: any) {
      // Map Postman API errors to appropriate MCP errors
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new McpError(ErrorCode.InvalidRequest, error.response.data?.message || 'Invalid request parameters');
          case 401:
            throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
          case 403:
            throw new McpError(ErrorCode.InvalidRequest, 'Forbidden: Insufficient permissions or feature unavailable');
          case 404:
            throw new McpError(ErrorCode.InvalidRequest, 'Resource not found');
          case 422:
            throw new McpError(ErrorCode.InvalidRequest, error.response.data?.message || 'Invalid request parameters');
          case 429:
            throw new McpError(ErrorCode.InvalidRequest, 'Rate limit exceeded');
          case 500:
            throw new McpError(ErrorCode.InternalError, 'Internal server error');
          default:
            throw new McpError(ErrorCode.InternalError, error.response.data?.message || 'Unknown error occurred');
        }
      }
      throw error;
    }
  }

  /**
   * List all APIs in a workspace
   * @param params Query parameters including workspaceId (required), createdBy, cursor, description, limit
   */
  async listApis(params: any): Promise<ToolCallResponse> {
    if (!params.workspaceId) {
      throw new McpError(ErrorCode.InvalidParams, 'workspaceId is required');
    }
    const response = await this.axiosInstance.get('/apis', {
      params,
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Get details of a specific API
   * @param params Parameters including apiId (required) and optional include array
   */
  async getApi(params: any): Promise<ToolCallResponse> {
    if (!params.apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    const response = await this.axiosInstance.get(`/apis/${params.apiId}`, {
      params: { include: params.include?.join(',') },
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Create a new API
   * @param data API data including name (required), summary, description, workspaceId (required)
   */
  async createApi(data: any): Promise<ToolCallResponse> {
    if (!data.name || !data.workspaceId) {
      throw new McpError(ErrorCode.InvalidParams, 'name and workspaceId are required');
    }
    const response = await this.axiosInstance.post('/apis', data, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Update an existing API
   * @param args Parameters including apiId (required) and update data
   */
  async updateApi(args: any): Promise<ToolCallResponse> {
    if (!args.apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    const { apiId, ...data } = args;
    const response = await this.axiosInstance.put(`/apis/${apiId}`, data, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Delete an API
   * @param apiId The ID of the API to delete
   */
  async deleteApi(apiId: string): Promise<ToolCallResponse> {
    if (!apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    await this.axiosInstance.delete(`/apis/${apiId}`, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse({ message: 'API deleted successfully' });
  }

  /**
   * Add a collection to an API
   * @param args Parameters including apiId, operationType, and operation-specific data
   */
  async addApiCollection(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.operationType) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and operationType are required');
    }
    const { apiId, ...data } = args;
    const response = await this.axiosInstance.post(`/apis/${apiId}/collections`, data, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Get a specific collection from an API
   * @param args Parameters including apiId, collectionId, and optional versionId
   */
  async getApiCollection(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.collectionId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and collectionId are required');
    }
    const { apiId, collectionId, ...params } = args;
    const response = await this.axiosInstance.get(`/apis/${apiId}/collections/${collectionId}`, {
      params,
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Create a schema for an API
   * @param args Parameters including apiId, type, and files array
   */
  async createApiSchema(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.type || !args.files) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, type, and files are required');
    }
    const { apiId, ...data } = args;
    const response = await this.axiosInstance.post(`/apis/${apiId}/schemas`, data, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Get a specific schema from an API
   * @param args Parameters including apiId, schemaId, and optional versionId and output format
   */
  async getApiSchema(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.schemaId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and schemaId are required');
    }
    const { apiId, schemaId, ...params } = args;
    const response = await this.axiosInstance.get(`/apis/${apiId}/schemas/${schemaId}`, {
      params,
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Create a new version of an API
   * @param args Parameters including apiId, name, schemas, collections, and optional fields
   */
  async createApiVersion(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.name || !args.schemas || !args.collections) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, name, schemas, and collections are required');
    }
    const { apiId, ...data } = args;
    const response = await this.axiosInstance.post(`/apis/${apiId}/versions`, data, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Get all versions of an API
   * @param args Parameters including apiId and optional pagination
   */
  async getApiVersions(args: any): Promise<ToolCallResponse> {
    if (!args.apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    const { apiId, ...params } = args;
    const response = await this.axiosInstance.get(`/apis/${apiId}/versions`, {
      params,
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Get a specific version of an API
   * @param args Parameters including apiId and versionId
   */
  async getApiVersion(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.versionId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and versionId are required');
    }
    const response = await this.axiosInstance.get(`/apis/${args.apiId}/versions/${args.versionId}`, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Update an API version
   * @param args Parameters including apiId, versionId, and update data
   */
  async updateApiVersion(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.versionId || !args.name) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, versionId, and name are required');
    }
    const { apiId, versionId, ...data } = args;
    const response = await this.axiosInstance.put(`/apis/${apiId}/versions/${versionId}`, data, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Delete an API version
   * @param args Parameters including apiId and versionId
   */
  async deleteApiVersion(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.versionId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and versionId are required');
    }
    await this.axiosInstance.delete(`/apis/${args.apiId}/versions/${args.versionId}`, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse({ message: 'API version deleted successfully' });
  }

  /**
   * Get comments for an API
   * @param args Parameters including apiId and optional pagination
   */
  async getApiComments(args: any): Promise<ToolCallResponse> {
    if (!args.apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    const { apiId, ...params } = args;
    const response = await this.axiosInstance.get(`/apis/${apiId}/comments`, {
      params,
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Create a new comment on an API
   * @param args Parameters including apiId, content, and optional threadId
   */
  async createApiComment(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.content) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and content are required');
    }
    this.validateCommentLength(args.content);
    const { apiId, ...data } = args;
    const response = await this.axiosInstance.post(`/apis/${apiId}/comments`, data, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Update an existing API comment
   * @param args Parameters including apiId, commentId, and content
   */
  async updateApiComment(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.commentId || !args.content) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, commentId, and content are required');
    }
    this.validateCommentLength(args.content);
    const response = await this.axiosInstance.put(
      `/apis/${args.apiId}/comments/${args.commentId}`,
      { content: args.content },
      { headers: { 'Accept': V10_ACCEPT_HEADER } }
    );
    return this.createResponse(response.data);
  }

  /**
   * Delete an API comment
   * @param args Parameters including apiId and commentId
   */
  async deleteApiComment(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.commentId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and commentId are required');
    }
    await this.axiosInstance.delete(`/apis/${args.apiId}/comments/${args.commentId}`, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse({ message: 'Comment deleted successfully' });
  }

  /**
   * Get tags for an API
   * @param apiId The ID of the API
   */
  async getApiTags(apiId: string): Promise<ToolCallResponse> {
    if (!apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    const response = await this.axiosInstance.get(`/apis/${apiId}/tags`, {
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Update tags for an API
   * @param args Parameters including apiId and tags array
   */
  async updateApiTags(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.tags) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and tags are required');
    }
    const response = await this.axiosInstance.put(
      `/apis/${args.apiId}/tags`,
      { tags: args.tags },
      { headers: { 'Accept': V10_ACCEPT_HEADER } }
    );
    return this.createResponse(response.data);
  }

  /**
   * Get files in an API schema
   * @param args Parameters including apiId, schemaId, and optional pagination/version
   */
  async getApiSchemaFiles(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.schemaId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and schemaId are required');
    }
    const { apiId, schemaId, ...params } = args;
    const response = await this.axiosInstance.get(`/apis/${apiId}/schemas/${schemaId}/files`, {
      params,
      headers: { 'Accept': V10_ACCEPT_HEADER }
    });
    return this.createResponse(response.data);
  }

  /**
   * Get contents of a schema file
   * @param args Parameters including apiId, schemaId, filePath, and optional versionId
   */
  async getSchemaFileContents(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.schemaId || !args.filePath) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, schemaId, and filePath are required');
    }
    const { apiId, schemaId, filePath, versionId } = args;
    const response = await this.axiosInstance.get(
      `/apis/${apiId}/schemas/${schemaId}/files/${filePath}`,
      {
        params: { versionId },
        headers: { 'Accept': V10_ACCEPT_HEADER }
      }
    );
    return this.createResponse(response.data);
  }

  /**
   * Create or update a schema file
   * @param args Parameters including apiId, schemaId, filePath, content, and optional root settings
   */
  async createUpdateSchemaFile(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.schemaId || !args.filePath || !args.content) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, schemaId, filePath, and content are required');
    }
    const { apiId, schemaId, filePath, ...data } = args;
    const response = await this.axiosInstance.put(
      `/apis/${apiId}/schemas/${schemaId}/files/${filePath}`,
      data,
      { headers: { 'Accept': V10_ACCEPT_HEADER } }
    );
    return this.createResponse(response.data);
  }

  /**
   * Delete a schema file
   * @param args Parameters including apiId, schemaId, and filePath
   */
  async deleteSchemaFile(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.schemaId || !args.filePath) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, schemaId, and filePath are required');
    }
    await this.axiosInstance.delete(
      `/apis/${args.apiId}/schemas/${args.schemaId}/files/${args.filePath}`,
      { headers: { 'Accept': V10_ACCEPT_HEADER } }
    );
    return this.createResponse({ message: 'Schema file deleted successfully' });
  }

  /**
   * Sync a collection with its schema
   * @param args Parameters including apiId and collectionId
   */
  async syncCollectionWithSchema(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.collectionId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and collectionId are required');
    }
    const response = await this.axiosInstance.put(
      `/apis/${args.apiId}/collections/${args.collectionId}/sync-with-schema-tasks`,
      {},
      { headers: { 'Accept': V10_ACCEPT_HEADER } }
    );
    return this.createResponse(response.data);
  }

  /**
   * Get status of an asynchronous task
   * @param args Parameters including apiId and taskId
   */
  async getTaskStatus(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.taskId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and taskId are required');
    }
    const response = await this.axiosInstance.get(
      `/apis/${args.apiId}/tasks/${args.taskId}`,
      { headers: { 'Accept': V10_ACCEPT_HEADER } }
    );
    return this.createResponse(response.data);
  }
}
