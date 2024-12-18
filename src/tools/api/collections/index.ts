import { AxiosInstance } from 'axios';
import { ToolHandler, ToolDefinition, ToolCallResponse } from '../../../types/index.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { TOOL_DEFINITIONS } from './definitions.js';

/**
 * Implements Postman Collection API operations
 * @see https://www.postman.com/postman/workspace/postman-public-workspace/documentation/12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a
 */
export class CollectionTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  getToolDefinitions(): ToolDefinition[] {
    return TOOL_DEFINITIONS;
  }

  async handleToolCall(name: string, args: any): Promise<ToolCallResponse> {
    try {
      switch (name) {
        case 'list_collections':
          return await this.listCollections(args);
        case 'get_collection':
          return await this.getCollection(args);
        case 'create_collection':
          return await this.createCollection(args);
        case 'update_collection':
          return await this.updateCollection(args);
        case 'delete_collection':
          return await this.deleteCollection(args.collection_id);
        case 'get_collection_folder':
          return await this.getCollectionFolder(args);
        case 'delete_collection_folder':
          return await this.deleteCollectionFolder(args);
        case 'get_collection_request':
          return await this.getCollectionRequest(args);
        case 'delete_collection_request':
          return await this.deleteCollectionRequest(args);
        case 'get_collection_response':
          return await this.getCollectionResponse(args);
        case 'delete_collection_response':
          return await this.deleteCollectionResponse(args);
        case 'fork_collection':
          return await this.forkCollection(args);
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error) {
      // Only transform critical errors, pass through API errors
      if (error instanceof McpError) throw error;
      throw error;
    }
  }

  private formatResponse(data: any): ToolCallResponse {
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    };
  }

  async listCollections(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get('/collections', { params: args });
    return this.formatResponse(response.data);
  }

  async getCollection(args: any): Promise<ToolCallResponse> {
    const { collection_id, ...params } = args;
    const response = await this.axiosInstance.get(`/collections/${collection_id}`, { params });
    return this.formatResponse(response.data);
  }

  async createCollection(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post('/collections', {
      collection: args.collection,
      workspace: { id: args.workspace, type: 'workspace' }
    });
    return this.formatResponse(response.data);
  }

  async updateCollection(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.put(`/collections/${args.collection_id}`, {
      collection: args.collection
    });
    return this.formatResponse(response.data);
  }

  async deleteCollection(collectionId: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(`/collections/${collectionId}`);
    return this.formatResponse(response.data);
  }

  async getCollectionFolder(args: any): Promise<ToolCallResponse> {
    const { collection_id, folder_id, ...params } = args;
    const response = await this.axiosInstance.get(
      `/collections/${collection_id}/folders/${folder_id}`,
      { params }
    );
    return this.formatResponse(response.data);
  }

  async deleteCollectionFolder(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(
      `/collections/${args.collection_id}/folders/${args.folder_id}`
    );
    return this.formatResponse(response.data);
  }

  async getCollectionRequest(args: any): Promise<ToolCallResponse> {
    const { collection_id, request_id, ...params } = args;
    const response = await this.axiosInstance.get(
      `/collections/${collection_id}/requests/${request_id}`,
      { params }
    );
    return this.formatResponse(response.data);
  }

  async deleteCollectionRequest(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(
      `/collections/${args.collection_id}/requests/${args.request_id}`
    );
    return this.formatResponse(response.data);
  }

  async getCollectionResponse(args: any): Promise<ToolCallResponse> {
    const { collection_id, response_id, ...params } = args;
    const response = await this.axiosInstance.get(
      `/collections/${collection_id}/responses/${response_id}`,
      { params }
    );
    return this.formatResponse(response.data);
  }

  async deleteCollectionResponse(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(
      `/collections/${args.collection_id}/responses/${args.response_id}`
    );
    return this.formatResponse(response.data);
  }

  async forkCollection(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post(`/collections/fork/${args.collection_id}`, {
      workspace: { id: args.workspace, type: 'workspace' },
      label: args.label
    });
    return this.formatResponse(response.data);
  }
}
