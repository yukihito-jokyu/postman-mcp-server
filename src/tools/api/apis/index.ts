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


export class ApiTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'list_apis',
        description: 'List all APIs in a workspace',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceId: {
              type: 'string',
              description: 'Workspace ID (required)',
            },
            createdBy: {
              type: 'number',
              description: 'Filter by creator user ID',
            },
            cursor: {
              type: 'string',
              description: 'Pagination cursor',
            },
            description: {
              type: 'string',
              description: 'Filter by description text',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
            },
          },
          required: ['workspaceId'],
        },
      },
      {
        name: 'get_api',
        description: 'Get details of a specific API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            include: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['collections', 'versions', 'schemas', 'gitInfo'],
              },
              description: 'Additional data to include',
            },
          },
          required: ['apiId'],
        },
      },
      {
        name: 'create_api',
        description: 'Create a new API',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'API name',
            },
            summary: {
              type: 'string',
              description: 'Brief description',
            },
            description: {
              type: 'string',
              description: 'Detailed description (supports Markdown)',
            },
            workspaceId: {
              type: 'string',
              description: 'Target workspace ID',
            },
          },
          required: ['name', 'workspaceId'],
        },
      },
      {
        name: 'update_api',
        description: 'Update an existing API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            name: {
              type: 'string',
              description: 'New API name',
            },
            summary: {
              type: 'string',
              description: 'Updated brief description',
            },
            description: {
              type: 'string',
              description: 'Updated detailed description',
            },
          },
          required: ['apiId'],
        },
      },
      {
        name: 'delete_api',
        description: 'Delete an API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
          },
          required: ['apiId'],
        },
      },
      {
        name: 'add_api_collection',
        description: 'Add a collection to an API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            operationType: {
              type: 'string',
              enum: ['COPY_COLLECTION', 'CREATE_NEW', 'GENERATE_FROM_SCHEMA'],
              description: 'Type of collection operation',
            },
            data: {
              type: 'object',
              description: 'Collection data based on operation type',
            },
          },
          required: ['apiId', 'operationType'],
        },
      },
      {
        name: 'create_api_schema',
        description: 'Create a schema for an API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            type: {
              type: 'string',
              enum: ['proto:2', 'proto:3', 'graphql', 'openapi:3_1', 'openapi:3', 'openapi:2', 'openapi:1', 'raml:1', 'raml:0_8', 'wsdl:2', 'wsdl:1', 'asyncapi:2'],
              description: 'Schema type',
            },
            files: {
              type: 'array',
              description: 'Schema files',
              items: {
                type: 'object',
                properties: {
                  path: {
                    type: 'string',
                    description: 'File path',
                  },
                  content: {
                    type: 'string',
                    description: 'File content',
                  },
                },
                required: ['path', 'content'],
              },
            },
          },
          required: ['apiId', 'type', 'files'],
        },
      },
      {
        name: 'create_api_version',
        description: 'Create a new version of an API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            name: {
              type: 'string',
              description: 'Version name',
            },
            schemas: {
              type: 'array',
              description: 'Schema references',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  filePath: { type: 'string' },
                  directoryPath: { type: 'string' },
                },
              },
            },
            collections: {
              type: 'array',
              description: 'Collection references',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  filePath: { type: 'string' },
                },
              },
            },
            branch: {
              type: 'string',
              description: 'Git branch (for git-linked APIs)',
            },
            releaseNotes: {
              type: 'string',
              description: 'Version release notes',
            },
          },
          required: ['apiId', 'name', 'schemas', 'collections'],
        },
      },
      {
        name: 'get_api_versions',
        description: 'Get all versions of an API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            cursor: {
              type: 'string',
              description: 'Pagination cursor',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
            },
          },
          required: ['apiId'],
        },
      },
      {
        name: 'get_api_version',
        description: 'Get a specific version of an API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            versionId: {
              type: 'string',
              description: 'Version ID',
            },
          },
          required: ['apiId', 'versionId'],
        },
      },
      {
        name: 'update_api_version',
        description: 'Update an API version',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            versionId: {
              type: 'string',
              description: 'Version ID',
            },
            name: {
              type: 'string',
              description: 'New version name',
            },
            releaseNotes: {
              type: 'string',
              description: 'Updated release notes',
            },
          },
          required: ['apiId', 'versionId', 'name'],
        },
      },
      {
        name: 'delete_api_version',
        description: 'Delete an API version',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            versionId: {
              type: 'string',
              description: 'Version ID',
            },
          },
          required: ['apiId', 'versionId'],
        },
      },
      {
        name: 'get_api_comments',
        description: 'Get comments for an API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            cursor: {
              type: 'string',
              description: 'Pagination cursor',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
            },
          },
          required: ['apiId'],
        },
      },
      {
        name: 'create_api_comment',
        description: 'Create a new comment on an API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            content: {
              type: 'string',
              description: 'Comment text (max 10,000 characters)',
            },
            threadId: {
              type: 'number',
              description: 'Thread ID for replies',
            },
          },
          required: ['apiId', 'content'],
        },
      },
      {
        name: 'update_api_comment',
        description: 'Update an existing API comment',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            commentId: {
              type: 'number',
              description: 'Comment ID',
            },
            content: {
              type: 'string',
              description: 'Updated comment text (max 10,000 characters)',
            },
          },
          required: ['apiId', 'commentId', 'content'],
        },
      },
      {
        name: 'delete_api_comment',
        description: 'Delete an API comment',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            commentId: {
              type: 'number',
              description: 'Comment ID',
            },
          },
          required: ['apiId', 'commentId'],
        },
      },
      {
        name: 'get_api_tags',
        description: 'Get tags for an API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
          },
          required: ['apiId'],
        },
      },
      {
        name: 'update_api_tags',
        description: 'Update tags for an API',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  slug: {
                    type: 'string',
                    description: 'Tag slug',
                  },
                  name: {
                    type: 'string',
                    description: 'Tag display name',
                  },
                },
                required: ['slug'],
              },
              description: 'List of tags',
            },
          },
          required: ['apiId', 'tags'],
        },
      },
      {
        name: 'get_api_schema_files',
        description: 'Get files in an API schema',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            schemaId: {
              type: 'string',
              description: 'Schema ID',
            },
            cursor: {
              type: 'string',
              description: 'Pagination cursor',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
            },
            versionId: {
              type: 'string',
              description: 'Version ID (required for API viewers)',
            },
          },
          required: ['apiId', 'schemaId'],
        },
      },
      {
        name: 'get_schema_file_contents',
        description: 'Get contents of a schema file',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            schemaId: {
              type: 'string',
              description: 'Schema ID',
            },
            filePath: {
              type: 'string',
              description: 'Path to the schema file',
            },
            versionId: {
              type: 'string',
              description: 'Version ID (required for API viewers)',
            },
          },
          required: ['apiId', 'schemaId', 'filePath'],
        },
      },
      {
        name: 'create_update_schema_file',
        description: 'Create or update a schema file',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            schemaId: {
              type: 'string',
              description: 'Schema ID',
            },
            filePath: {
              type: 'string',
              description: 'Path to the schema file',
            },
            content: {
              type: 'string',
              description: 'File content',
            },
            root: {
              type: 'object',
              properties: {
                enabled: {
                  type: 'boolean',
                  description: 'Tag as root file (protobuf only)',
                },
              },
            },
          },
          required: ['apiId', 'schemaId', 'filePath', 'content'],
        },
      },
      {
        name: 'delete_schema_file',
        description: 'Delete a schema file',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            schemaId: {
              type: 'string',
              description: 'Schema ID',
            },
            filePath: {
              type: 'string',
              description: 'Path to the schema file',
            },
          },
          required: ['apiId', 'schemaId', 'filePath'],
        },
      },
      {
        name: 'sync_collection_with_schema',
        description: 'Sync a collection with its schema',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID',
            },
            collectionId: {
              type: 'string',
              description: 'Collection ID',
            },
          },
          required: ['apiId', 'collectionId'],
        },
      },
    ];
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
