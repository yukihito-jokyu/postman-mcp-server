import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  AddApiCollectionRequest,
  CreateApiRequest,
  CreateApiSchemaRequest,
  CreateApiVersionRequest,
  CreateCommentRequest,
  CreateUpdateSchemaFileRequest,
  GetCommentsParams,
  GetSchemaFilesParams,
  ListApisParams,
  ToolCallResponse,
  ToolDefinition,
  ToolHandler,
  UpdateApiRequest,
  UpdateApiVersionRequest,
  UpdateCommentRequest,
  UpdateTagsRequest
} from '../../../types/index.js';

import { TOOL_DEFINITIONS } from './definitions.js';

export class ApiTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  getToolDefinitions(): ToolDefinition[] {
    return TOOL_DEFINITIONS;
  }

  async handleToolCall(name: string, args: unknown): Promise<ToolCallResponse> {
    switch (name) {
      case 'list_apis':
        return await this.listApis(args as ListApisParams);
      case 'get_api':
        return await this.getApi(args as { apiId: string; include?: string[] });
      case 'create_api':
        return await this.createApi(args as CreateApiRequest);
      case 'update_api':
        const { apiId, ...updateData } = args as { apiId: string } & UpdateApiRequest;
        return await this.updateApi(apiId, updateData);
      case 'delete_api':
        return await this.deleteApi((args as { apiId: string }).apiId);
      case 'add_api_collection':
        const { apiId: collApiId, ...collData } = args as { apiId: string } & AddApiCollectionRequest;
        return await this.addApiCollection(collApiId, collData);
      case 'create_api_schema':
        const { apiId: schemaApiId, ...schemaData } = args as { apiId: string } & CreateApiSchemaRequest;
        return await this.createApiSchema(schemaApiId, schemaData);
      case 'create_api_version':
        const { apiId: versionApiId, ...versionData } = args as { apiId: string } & CreateApiVersionRequest;
        return await this.createApiVersion(versionApiId, versionData);
      case 'get_api_versions':
        return await this.getApiVersions(args as { apiId: string; cursor?: string; limit?: number });
      case 'get_api_version':
        return await this.getApiVersion(args as { apiId: string; versionId: string });
      case 'update_api_version':
        const { apiId: updateVersionApiId, versionId2, ...updateVersionData } = args as { apiId: string; versionId2: string } & UpdateApiVersionRequest;
        return await this.updateApiVersion(updateVersionApiId, versionId2, updateVersionData);
      case 'delete_api_version':
        return await this.deleteApiVersion(args as { apiId: string; versionId: string });
      case 'get_api_comments':
        return await this.getApiComments(args as GetCommentsParams);
      case 'create_api_comment':
        const { apiId: commentApiId, ...commentData } = args as { apiId: string } & CreateCommentRequest;
        return await this.createApiComment(commentApiId, commentData);
      case 'update_api_comment':
        const { apiId: updateCommentApiId, commentId, content } = args as { apiId: string; commentId: number; content: string };
        return await this.updateApiComment(updateCommentApiId, commentId, { content });
      case 'delete_api_comment':
        const { apiId: deleteCommentApiId, commentId: deleteCommentId } = args as { apiId: string; commentId: number };
        return await this.deleteApiComment(deleteCommentApiId, deleteCommentId);
      case 'get_api_tags':
        return await this.getApiTags((args as { apiId: string }).apiId);
      case 'update_api_tags':
        const { apiId: tagApiId, tags } = args as { apiId: string; tags: Array<{ slug: string; name?: string }> };
        return await this.updateApiTags(tagApiId, { tags });
      case 'get_api_schema_files':
        return await this.getApiSchemaFiles(args as GetSchemaFilesParams);
      case 'get_schema_file_contents':
        const { apiId: schemaFileApiId, schemaId, filePath, versionId } = args as { apiId: string; schemaId: string; filePath: string; versionId?: string };
        return await this.getSchemaFileContents(schemaFileApiId, schemaId, filePath, versionId);
      case 'create_update_schema_file':
        const { apiId: updateSchemaApiId, schemaId: updateSchemaId, filePath: updateFilePath, ...fileData } = args as { apiId: string; schemaId: string; filePath: string } & CreateUpdateSchemaFileRequest;
        return await this.createUpdateSchemaFile(updateSchemaApiId, updateSchemaId, updateFilePath, fileData);
      case 'delete_schema_file':
        const { apiId: deleteSchemaApiId, schemaId: deleteSchemaId, filePath: deleteFilePath } = args as { apiId: string; schemaId: string; filePath: string };
        return await this.deleteSchemaFile(deleteSchemaApiId, deleteSchemaId, deleteFilePath);
      case 'sync_collection_with_schema':
        const { apiId: syncApiId, collectionId: syncCollectionId } = args as { apiId: string; collectionId: string };
        return await this.syncCollectionWithSchema(syncApiId, syncCollectionId);
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  }

  async listApis(params: ListApisParams): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get('/apis', {
        params,
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Feature unavailable or forbidden');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getApi(params: { apiId: string; include?: string[] }): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get(`/apis/${params.apiId}`, {
        params: { include: params.include?.join(',') },
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
        throw new McpError(ErrorCode.InvalidRequest, 'API not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async createApi(data: CreateApiRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.post('/apis', data, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 400) {
        throw new McpError(ErrorCode.InvalidRequest, 'Invalid API data');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async updateApi(apiId: string, data: UpdateApiRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.put(`/apis/${apiId}`, data, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
        throw new McpError(ErrorCode.InvalidRequest, 'API not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async deleteApi(apiId: string): Promise<ToolCallResponse> {
    try {
      await this.axiosInstance.delete(`/apis/${apiId}`, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
        }
      });
      return {
        content: [
          {
            type: 'text',
            text: 'API deleted successfully',
          },
        ],
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'API not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async addApiCollection(apiId: string, data: AddApiCollectionRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.post(`/apis/${apiId}/collections`, data, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Operation forbidden');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async createApiSchema(apiId: string, data: CreateApiSchemaRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.post(`/apis/${apiId}/schemas`, data, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Operation forbidden');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async createApiVersion(apiId: string, data: CreateApiVersionRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.post(`/apis/${apiId}/versions`, data, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Operation forbidden');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getApiVersions(params: { apiId: string; cursor?: string; limit?: number }): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get(`/apis/${params.apiId}/versions`, {
        params: {
          cursor: params.cursor,
          limit: params.limit
        },
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Feature unavailable');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getApiVersion(params: { apiId: string; versionId: string }): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get(`/apis/${params.apiId}/versions/${params.versionId}`, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
        throw new McpError(ErrorCode.InvalidRequest, 'Version not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async updateApiVersion(apiId: string, versionId: string, data: UpdateApiVersionRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.put(`/apis/${apiId}/versions/${versionId}`, data, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
        throw new McpError(ErrorCode.InvalidRequest, 'Version not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async deleteApiVersion(params: { apiId: string; versionId: string }): Promise<ToolCallResponse> {
    try {
      await this.axiosInstance.delete(`/apis/${params.apiId}/versions/${params.versionId}`, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
        }
      });
      return {
        content: [
          {
            type: 'text',
            text: 'API version deleted successfully',
          },
        ],
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Version not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getApiComments(params: GetCommentsParams): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get(`/apis/${params.apiId}/comments`, {
        params: {
          cursor: params.cursor,
          limit: params.limit,
        },
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Feature unavailable or forbidden');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async createApiComment(apiId: string, data: CreateCommentRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.post(`/apis/${apiId}/comments`, data, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Feature unavailable or forbidden');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async updateApiComment(apiId: string, commentId: number, data: UpdateCommentRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.put(`/apis/${apiId}/comments/${commentId}`, data, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
        throw new McpError(ErrorCode.InvalidRequest, 'Comment not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async deleteApiComment(apiId: string, commentId: number): Promise<ToolCallResponse> {
    try {
      await this.axiosInstance.delete(`/apis/${apiId}/comments/${commentId}`, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
        }
      });
      return {
        content: [
          {
            type: 'text',
            text: 'Comment deleted successfully',
          },
        ],
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'Comment not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getApiTags(apiId: string): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get(`/apis/${apiId}/tags`, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Feature unavailable');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async updateApiTags(apiId: string, data: UpdateTagsRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.put(`/apis/${apiId}/tags`, data, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Feature unavailable');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getApiSchemaFiles(params: GetSchemaFilesParams): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get(`/apis/${params.apiId}/schemas/${params.schemaId}/files`, {
        params: {
          cursor: params.cursor,
          limit: params.limit,
          versionId: params.versionId,
        },
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Feature unavailable');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async getSchemaFileContents(apiId: string, schemaId: string, filePath: string, versionId?: string): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.get(`/apis/${apiId}/schemas/${schemaId}/files/${filePath}`, {
        params: { versionId },
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
        throw new McpError(ErrorCode.InvalidRequest, 'File not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async createUpdateSchemaFile(apiId: string, schemaId: string, filePath: string, data: CreateUpdateSchemaFileRequest): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.put(`/apis/${apiId}/schemas/${schemaId}/files/${filePath}`, data, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Operation forbidden');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async deleteSchemaFile(apiId: string, schemaId: string, filePath: string): Promise<ToolCallResponse> {
    try {
      await this.axiosInstance.delete(`/apis/${apiId}/schemas/${schemaId}/files/${filePath}`, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
        }
      });
      return {
        content: [
          {
            type: 'text',
            text: 'Schema file deleted successfully',
          },
        ],
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, 'Unauthorized access');
      }
      if (error.response?.status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, 'File not found');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }

  async syncCollectionWithSchema(apiId: string, collectionId: string): Promise<ToolCallResponse> {
    try {
      const response = await this.axiosInstance.put(`/apis/${apiId}/collections/${collectionId}/sync-with-schema-tasks`, {}, {
        headers: {
          'Accept': 'application/vnd.api.v10+json'
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
      if (error.response?.status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, 'Operation forbidden');
      }
      throw new McpError(ErrorCode.InternalError, 'Server error occurred');
    }
  }
}
