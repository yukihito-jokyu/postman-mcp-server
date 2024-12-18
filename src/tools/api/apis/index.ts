import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  ToolCallResponse,
  ToolDefinition,
  ToolHandler,
} from '../../../types/index.js';
import { TOOL_DEFINITIONS } from './definitions.js';

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
        case 'create_api_schema':
          return await this.createApiSchema(args);
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

  async listApis(params: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get('/apis', {
      params,
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async getApi(params: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get(`/apis/${params.apiId}`, {
      params: { include: params.include?.join(',') },
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async createApi(data: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post('/apis', data, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  // ... previous code ...

  async updateApi(args: any): Promise<ToolCallResponse> {
    const { apiId, ...data } = args;
    const response = await this.axiosInstance.put(`/apis/${apiId}`, data, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async deleteApi(apiId: string): Promise<ToolCallResponse> {
    await this.axiosInstance.delete(`/apis/${apiId}`, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse({ message: 'API deleted successfully' });
  }

  async addApiCollection(args: any): Promise<ToolCallResponse> {
    const { apiId, ...data } = args;
    const response = await this.axiosInstance.post(`/apis/${apiId}/collections`, data, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async createApiSchema(args: any): Promise<ToolCallResponse> {
    const { apiId, ...data } = args;
    const response = await this.axiosInstance.post(`/apis/${apiId}/schemas`, data, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async createApiVersion(args: any): Promise<ToolCallResponse> {
    const { apiId, ...data } = args;
    const response = await this.axiosInstance.post(`/apis/${apiId}/versions`, data, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async getApiVersions(args: any): Promise<ToolCallResponse> {
    const { apiId, ...params } = args;
    const response = await this.axiosInstance.get(`/apis/${apiId}/versions`, {
      params,
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async getApiVersion(args: any): Promise<ToolCallResponse> {
    const { apiId, versionId } = args;
    const response = await this.axiosInstance.get(`/apis/${apiId}/versions/${versionId}`, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async updateApiVersion(args: any): Promise<ToolCallResponse> {
    const { apiId, versionId, ...data } = args;
    const response = await this.axiosInstance.put(`/apis/${apiId}/versions/${versionId}`, data, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async deleteApiVersion(args: any): Promise<ToolCallResponse> {
    const { apiId, versionId } = args;
    await this.axiosInstance.delete(`/apis/${apiId}/versions/${versionId}`, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse({ message: 'API version deleted successfully' });
  }

  async getApiComments(args: any): Promise<ToolCallResponse> {
    const { apiId, ...params } = args;
    const response = await this.axiosInstance.get(`/apis/${apiId}/comments`, {
      params,
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async createApiComment(args: any): Promise<ToolCallResponse> {
    const { apiId, ...data } = args;
    const response = await this.axiosInstance.post(`/apis/${apiId}/comments`, data, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async updateApiComment(args: any): Promise<ToolCallResponse> {
    const { apiId, commentId, content } = args;
    const response = await this.axiosInstance.put(`/apis/${apiId}/comments/${commentId}`, { content }, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async deleteApiComment(args: any): Promise<ToolCallResponse> {
    const { apiId, commentId } = args;
    await this.axiosInstance.delete(`/apis/${apiId}/comments/${commentId}`, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse({ message: 'Comment deleted successfully' });
  }

  async getApiTags(apiId: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get(`/apis/${apiId}/tags`, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async updateApiTags(args: any): Promise<ToolCallResponse> {
    const { apiId, tags } = args;
    const response = await this.axiosInstance.put(`/apis/${apiId}/tags`, { tags }, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async getApiSchemaFiles(args: any): Promise<ToolCallResponse> {
    const { apiId, schemaId, ...params } = args;
    const response = await this.axiosInstance.get(`/apis/${apiId}/schemas/${schemaId}/files`, {
      params,
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async getSchemaFileContents(args: any): Promise<ToolCallResponse> {
    const { apiId, schemaId, filePath, versionId } = args;
    const response = await this.axiosInstance.get(`/apis/${apiId}/schemas/${schemaId}/files/${filePath}`, {
      params: { versionId },
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async createUpdateSchemaFile(args: any): Promise<ToolCallResponse> {
    const { apiId, schemaId, filePath, ...data } = args;
    const response = await this.axiosInstance.put(`/apis/${apiId}/schemas/${schemaId}/files/${filePath}`, data, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse(response.data);
  }

  async deleteSchemaFile(args: any): Promise<ToolCallResponse> {
    const { apiId, schemaId, filePath } = args;
    await this.axiosInstance.delete(`/apis/${apiId}/schemas/${schemaId}/files/${filePath}`, {
      headers: { 'Accept': 'application/vnd.api.v10+json' }
    });
    return this.createResponse({ message: 'Schema file deleted successfully' });
  }

  async syncCollectionWithSchema(args: any): Promise<ToolCallResponse> {
    const { apiId, collectionId } = args;
    const response = await this.axiosInstance.put(
      `/apis/${apiId}/collections/${collectionId}/sync-with-schema-tasks`,
      {},
      { headers: { 'Accept': 'application/vnd.api.v10+json' } }
    );
    return this.createResponse(response.data);
  }
}
