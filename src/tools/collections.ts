import { AxiosInstance } from 'axios';
import {
  ToolHandler,
  CreateCollectionArgs,
  UpdateCollectionArgs,
  ForkCollectionArgs,
  ToolDefinition
} from '../types.js';

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
        description: 'Create a new collection in a workspace',
        inputSchema: {
          type: 'object',
          properties: {
            workspace: {
              type: 'string',
              description: 'Workspace ID',
            },
            name: {
              type: 'string',
              description: 'Collection name',
            },
            description: {
              type: 'string',
              description: 'Collection description',
            },
            schema: {
              type: 'object',
              description: 'Collection schema in Postman Collection format v2.1',
            },
          },
          required: ['workspace', 'name', 'schema'],
        },
      },
      {
        name: 'update_collection',
        description: 'Update an existing collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection_id: {
              type: 'string',
              description: 'Collection ID',
            },
            name: {
              type: 'string',
              description: 'Collection name',
            },
            description: {
              type: 'string',
              description: 'Collection description',
            },
            schema: {
              type: 'object',
              description: 'Collection schema in Postman Collection format v2.1',
            },
          },
          required: ['collection_id', 'name', 'schema'],
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

  async createCollection({ workspace, name, description, schema }: CreateCollectionArgs) {
    const response = await this.axiosInstance.post('/collections', {
      collection: {
        info: {
          name,
          description,
          schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        ...schema
      },
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

  async updateCollection({ collection_id, name, description, schema }: UpdateCollectionArgs) {
    const response = await this.axiosInstance.put(`/collections/${collection_id}`, {
      collection: {
        info: {
          name,
          description,
          schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        ...schema
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
