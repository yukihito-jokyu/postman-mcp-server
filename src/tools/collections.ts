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
  ToolDefinition
} from '../types.js';

/**
 * Implements Postman Collection API operations
 * @see https://www.postman.com/postman/workspace/postman-public-workspace/documentation/12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a
 */
export class CollectionTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'list_collections',
        description: 'List all collections in a workspace. Supports filtering and pagination.',
        inputSchema: {
          type: 'object',
          properties: {
            workspace: {
              type: 'string',
              description: 'Workspace ID',
            },
            name: {
              type: 'string',
              description: 'Filter results by collections that match the given name',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return',
            },
            offset: {
              type: 'number',
              description: 'Number of results to skip',
            },
          },
          required: [],
        },
      },
      {
        name: 'get_collection',
        description: 'Get details of a specific collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection_id: {
              type: 'string',
              description: 'Collection ID',
            },
            access_key: {
              type: 'string',
              description: "Collection's read-only access key. Using this query parameter does not require an API key.",
            },
            model: {
              type: 'string',
              enum: ['minimal'],
              description: 'Return minimal collection data (only root-level request and folder IDs)',
            },
          },
          required: ['collection_id'],
        },
      },
      {
        name: 'create_collection',
        description: 'Create a new collection in a workspace. Supports Postman Collection v2.1.0 format.',
        inputSchema: {
          type: 'object',
          properties: {
            workspace: {
              type: 'string',
              description: 'Workspace ID. Creates in "My Workspace" if not specified.',
            },
            collection: {
              type: 'object',
              description: 'Collection details in Postman Collection Format v2.1',
              required: ['info'],
              properties: {
                info: {
                  type: 'object',
                  required: ['name', 'schema'],
                  properties: {
                    name: {
                      type: 'string',
                      description: "The collection's name"
                    },
                    description: {
                      type: 'string',
                      description: "The collection's description"
                    },
                    schema: {
                      type: 'string',
                      description: "The collection's schema URL"
                    }
                  }
                },
                item: {
                  type: 'array',
                  description: 'Collection items (requests, folders)',
                  items: {
                    type: 'object'
                  }
                }
              }
            }
          },
          required: ['workspace', 'collection'],
        },
      },
      {
        name: 'update_collection',
        description: 'Update an existing collection. Full collection replacement with maximum size of 20 MB.',
        inputSchema: {
          type: 'object',
          properties: {
            collection_id: {
              type: 'string',
              description: 'Collection ID',
            },
            collection: {
              type: 'object',
              description: 'Collection details in Postman Collection Format v2.1',
              required: ['info', 'item'],
              properties: {
                info: {
                  type: 'object',
                  required: ['name', 'schema'],
                  properties: {
                    name: {
                      type: 'string',
                      description: "The collection's name"
                    },
                    description: {
                      type: 'string',
                      description: "The collection's description"
                    },
                    schema: {
                      type: 'string',
                      description: "The collection's schema URL"
                    }
                  }
                },
                item: {
                  type: 'array',
                  description: 'Collection items (requests, folders)',
                  items: {
                    type: 'object'
                  }
                }
              }
            }
          },
          required: ['collection_id', 'collection'],
        },
      },
      {
        name: 'delete_collection',
        description: 'Delete a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection_id: {
              type: 'string',
              description: 'Collection ID',
            },
          },
          required: ['collection_id'],
        },
      },
      {
        name: 'get_collection_folder',
        description: 'Get details of a specific folder in a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection_id: {
              type: 'string',
              description: 'Collection ID',
            },
            folder_id: {
              type: 'string',
              description: 'Folder ID',
            },
            ids: {
              type: 'boolean',
              description: 'Return only properties that contain ID values',
            },
            uid: {
              type: 'boolean',
              description: 'Return all IDs in UID format (userId-id)',
            },
            populate: {
              type: 'boolean',
              description: 'Return all folder contents',
            },
          },
          required: ['collection_id', 'folder_id'],
        },
      },
      {
        name: 'delete_collection_folder',
        description: 'Delete a folder from a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection_id: {
              type: 'string',
              description: 'Collection ID',
            },
            folder_id: {
              type: 'string',
              description: 'Folder ID',
            },
          },
          required: ['collection_id', 'folder_id'],
        },
      },
      {
        name: 'get_collection_request',
        description: 'Get details of a specific request in a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection_id: {
              type: 'string',
              description: 'Collection ID',
            },
            request_id: {
              type: 'string',
              description: 'Request ID',
            },
            ids: {
              type: 'boolean',
              description: 'Return only properties that contain ID values',
            },
            uid: {
              type: 'boolean',
              description: 'Return all IDs in UID format (userId-id)',
            },
            populate: {
              type: 'boolean',
              description: 'Return all request contents',
            },
          },
          required: ['collection_id', 'request_id'],
        },
      },
      {
        name: 'delete_collection_request',
        description: 'Delete a request from a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection_id: {
              type: 'string',
              description: 'Collection ID',
            },
            request_id: {
              type: 'string',
              description: 'Request ID',
            },
          },
          required: ['collection_id', 'request_id'],
        },
      },
      {
        name: 'get_collection_response',
        description: 'Get details of a specific response in a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection_id: {
              type: 'string',
              description: 'Collection ID',
            },
            response_id: {
              type: 'string',
              description: 'Response ID',
            },
            ids: {
              type: 'boolean',
              description: 'Return only properties that contain ID values',
            },
            uid: {
              type: 'boolean',
              description: 'Return all IDs in UID format (userId-id)',
            },
            populate: {
              type: 'boolean',
              description: 'Return all response contents',
            },
          },
          required: ['collection_id', 'response_id'],
        },
      },
      {
        name: 'delete_collection_response',
        description: 'Delete a response from a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection_id: {
              type: 'string',
              description: 'Collection ID',
            },
            response_id: {
              type: 'string',
              description: 'Response ID',
            },
          },
          required: ['collection_id', 'response_id'],
        },
      },
      {
        name: 'fork_collection',
        description: 'Fork a collection to a workspace',
        inputSchema: {
          type: 'object',
          properties: {
            collection_id: {
              type: 'string',
              description: 'Collection ID to fork',
            },
            workspace: {
              type: 'string',
              description: 'Destination workspace ID',
            },
            label: {
              type: 'string',
              description: 'Label for the forked collection',
            },
          },
          required: ['collection_id', 'workspace', 'label'],
        },
      },
    ];
  }

  /**
   * List all collections in a workspace
   * @param args GetCollectionsArgs containing optional workspace ID, name filter, and pagination
   * @returns List of collections
   */
  async listCollections(args: GetCollectionsArgs) {
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
  async getCollection(args: GetCollectionArgs) {
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
  async createCollection({ workspace, collection }: CreateCollectionArgs) {
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
  async updateCollection({ collection_id, collection }: UpdateCollectionArgs) {
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
  async deleteCollection(collection_id: string) {
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
  async getCollectionFolder(args: GetCollectionFolderArgs) {
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
  async deleteCollectionFolder(args: DeleteCollectionFolderArgs) {
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
  async getCollectionRequest(args: GetCollectionRequestArgs) {
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
  async deleteCollectionRequest(args: DeleteCollectionRequestArgs) {
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
  async getCollectionResponse(args: GetCollectionResponseArgs) {
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
  async deleteCollectionResponse(args: DeleteCollectionResponseArgs) {
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
  async forkCollection({ collection_id, workspace, label }: ForkCollectionArgs) {
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
