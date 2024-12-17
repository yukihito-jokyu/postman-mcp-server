import { AxiosInstance } from 'axios';
import {
  ToolHandler,
  CreateCollectionArgs,
  UpdateCollectionArgs,
  ForkCollectionArgs,
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
        description: 'List all collections in a workspace',
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
        name: 'get_collection',
        description: 'Get details of a specific collection',
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
   * @param workspace Workspace ID
   * @returns List of collections
   */
  async listCollections(workspace: string) {
    const response = await this.axiosInstance.get(`/workspaces/${workspace}/collections`);
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
   * @param collection_id Collection ID
   * @returns Collection details
   */
  async getCollection(collection_id: string) {
    const response = await this.axiosInstance.get(`/collections/${collection_id}`);
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
