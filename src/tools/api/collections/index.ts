import { AxiosInstance } from 'axios';
import {
  ToolHandler,
  CreateCollectionArgs,
  UpdateCollectionArgs,
  ForkCollectionArgs,
  GetCollectionsArgs,
  GetCollectionArgs,
  GetCollectionFolderArgs,
  DeleteCollectionFolderArgs,
  GetCollectionRequestArgs,
  DeleteCollectionRequestArgs,
  GetCollectionResponseArgs,
  DeleteCollectionResponseArgs,
  ToolDefinition,
  ToolCallResponse,
  validateArgs,
  isGetCollectionsArgs,
  isGetCollectionArgs,
  isCreateCollectionArgs,
  isUpdateCollectionArgs,
  isCollectionIdArg,
  isGetCollectionFolderArgs,
  isDeleteCollectionFolderArgs,
  isGetCollectionRequestArgs,
  isDeleteCollectionRequestArgs,
  isGetCollectionResponseArgs,
  isDeleteCollectionResponseArgs,
  isForkCollectionArgs,
} from '../../../types/index.js';
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

  async handleToolCall(name: string, args: unknown): Promise<ToolCallResponse> {
    switch (name) {
      case 'list_collections':
        return await this.listCollections(
          validateArgs(args, isGetCollectionsArgs, 'Invalid list collections arguments')
        );
      case 'get_collection':
        return await this.getCollection(
          validateArgs(args, isGetCollectionArgs, 'Invalid get collection arguments')
        );
      case 'create_collection':
        return await this.createCollection(
          validateArgs(args, isCreateCollectionArgs, 'Invalid create collection arguments')
        );
      case 'update_collection':
        return await this.updateCollection(
          validateArgs(args, isUpdateCollectionArgs, 'Invalid update collection arguments')
        );
      case 'delete_collection':
        return await this.deleteCollection(
          validateArgs(args, isCollectionIdArg, 'Invalid collection ID argument').collection_id
        );
      case 'get_collection_folder':
        return await this.getCollectionFolder(
          validateArgs(args, isGetCollectionFolderArgs, 'Invalid get collection folder arguments')
        );
      case 'delete_collection_folder':
        return await this.deleteCollectionFolder(
          validateArgs(args, isDeleteCollectionFolderArgs, 'Invalid delete collection folder arguments')
        );
      case 'get_collection_request':
        return await this.getCollectionRequest(
          validateArgs(args, isGetCollectionRequestArgs, 'Invalid get collection request arguments')
        );
      case 'delete_collection_request':
        return await this.deleteCollectionRequest(
          validateArgs(args, isDeleteCollectionRequestArgs, 'Invalid delete collection request arguments')
        );
      case 'get_collection_response':
        return await this.getCollectionResponse(
          validateArgs(args, isGetCollectionResponseArgs, 'Invalid get collection response arguments')
        );
      case 'delete_collection_response':
        return await this.deleteCollectionResponse(
          validateArgs(args, isDeleteCollectionResponseArgs, 'Invalid delete collection response arguments')
        );
      case 'fork_collection':
        return await this.forkCollection(
          validateArgs(args, isForkCollectionArgs, 'Invalid fork collection arguments')
        );
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  }

  /**
   * List all collections in a workspace
   * @param args GetCollectionsArgs containing optional workspace ID, name filter, and pagination
   * @returns List of collections
   */
  async listCollections(args: GetCollectionsArgs): Promise<ToolCallResponse> {
    const params: Record<string, any> = {};
    if (args.workspace) params.workspace = args.workspace;
    if (args.name) params.name = args.name;
    if (args.limit) params.limit = args.limit;
    if (args.offset) params.offset = args.offset;

    const response = await this.axiosInstance.get('/collections', { params });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  /**
   * Get details of a specific collection
   * @param args GetCollectionArgs containing collection ID and optional parameters
   * @returns Collection details
   */
  async getCollection(args: GetCollectionArgs): Promise<ToolCallResponse> {
    const params: Record<string, any> = {};
    if (args.access_key) params.access_key = args.access_key;
    if (args.model) params.model = args.model;

    const response = await this.axiosInstance.get(`/collections/${args.collection_id}`, { params });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  /**
   * Create a new collection in a workspace
   * @param args CreateCollectionArgs containing workspace and collection details
   * @returns Created collection details
   */
  async createCollection({ workspace, collection }: CreateCollectionArgs): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post('/collections', {
      collection,
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
  }

  /**
   * Update an existing collection
   * @param args UpdateCollectionArgs containing collection ID and updated details
   * @returns Updated collection details
   */
  async updateCollection({ collection_id, collection }: UpdateCollectionArgs): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.put(`/collections/${collection_id}`, {
      collection
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  /**
   * Delete a collection
   * @param collection_id Collection ID
   * @returns Deletion confirmation
   */
  async deleteCollection(collection_id: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(`/collections/${collection_id}`);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  /**
   * Get details of a specific folder in a collection
   * @param args GetCollectionFolderArgs containing collection ID, folder ID, and optional parameters
   * @returns Folder details
   */
  async getCollectionFolder(args: GetCollectionFolderArgs): Promise<ToolCallResponse> {
    const params: Record<string, any> = {};
    if (args.ids) params.ids = args.ids;
    if (args.uid) params.uid = args.uid;
    if (args.populate) params.populate = args.populate;

    const response = await this.axiosInstance.get(
      `/collections/${args.collection_id}/folders/${args.folder_id}`,
      { params }
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  /**
   * Delete a folder from a collection
   * @param args DeleteCollectionFolderArgs containing collection ID and folder ID
   * @returns Deletion confirmation
   */
  async deleteCollectionFolder(args: DeleteCollectionFolderArgs): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(
      `/collections/${args.collection_id}/folders/${args.folder_id}`
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  /**
   * Get details of a specific request in a collection
   * @param args GetCollectionRequestArgs containing collection ID, request ID, and optional parameters
   * @returns Request details
   */
  async getCollectionRequest(args: GetCollectionRequestArgs): Promise<ToolCallResponse> {
    const params: Record<string, any> = {};
    if (args.ids) params.ids = args.ids;
    if (args.uid) params.uid = args.uid;
    if (args.populate) params.populate = args.populate;

    const response = await this.axiosInstance.get(
      `/collections/${args.collection_id}/requests/${args.request_id}`,
      { params }
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  /**
   * Delete a request from a collection
   * @param args DeleteCollectionRequestArgs containing collection ID and request ID
   * @returns Deletion confirmation
   */
  async deleteCollectionRequest(args: DeleteCollectionRequestArgs): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(
      `/collections/${args.collection_id}/requests/${args.request_id}`
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  /**
   * Get details of a specific response in a collection
   * @param args GetCollectionResponseArgs containing collection ID, response ID, and optional parameters
   * @returns Response details
   */
  async getCollectionResponse(args: GetCollectionResponseArgs): Promise<ToolCallResponse> {
    const params: Record<string, any> = {};
    if (args.ids) params.ids = args.ids;
    if (args.uid) params.uid = args.uid;
    if (args.populate) params.populate = args.populate;

    const response = await this.axiosInstance.get(
      `/collections/${args.collection_id}/responses/${args.response_id}`,
      { params }
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  /**
   * Delete a response from a collection
   * @param args DeleteCollectionResponseArgs containing collection ID and response ID
   * @returns Deletion confirmation
   */
  async deleteCollectionResponse(args: DeleteCollectionResponseArgs): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(
      `/collections/${args.collection_id}/responses/${args.response_id}`
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  /**
   * Fork a collection to a workspace
   * @param args ForkCollectionArgs containing collection ID, workspace, and label
   * @returns Forked collection details
   */
  async forkCollection({ collection_id, workspace, label }: ForkCollectionArgs): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post(`/collections/fork/${collection_id}`, {
      workspace: {
        id: workspace,
        type: 'workspace'
      },
      label
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }
}
