import { AxiosInstance } from 'axios';
import {
  ToolHandler,
  CreateCollectionArgs,
  UpdateCollectionArgs,
  ForkCollectionArgs
} from '../types.js';

export class CollectionTools implements ToolHandler {
  constructor(public axiosInstance: AxiosInstance) {}

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
