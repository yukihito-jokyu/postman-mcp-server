import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  ToolCallResponse,
  ToolDefinition,
  ToolHandler,
} from '../../../types/index.js';
import { TOOL_DEFINITIONS } from './definitions.js';

export class AdditionalFeatureTools implements ToolHandler {
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
        // Billing
        case 'get_accounts':
          return await this.getAccounts();
        case 'list_account_invoices':
          return await this.listAccountInvoices(args);

        // Comment Resolution
        case 'resolve_comment_thread':
          return await this.resolveCommentThread(args.threadId);

        // Private API Network
        case 'list_pan_elements':
          return await this.listPanElements(args);
        case 'add_pan_element':
          return await this.addPanElement(args);
        case 'update_pan_element':
          return await this.updatePanElement(args);
        case 'remove_pan_element':
          return await this.removePanElement(args);

        // Webhooks
        case 'create_webhook':
          return await this.createWebhook(args);

        // Tags
        case 'get_tagged_elements':
          return await this.getTaggedElements(args);
        case 'get_workspace_tags':
          return await this.getWorkspaceTags(args.workspaceId);
        case 'update_workspace_tags':
          return await this.updateWorkspaceTags(args);

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

  // Billing Methods
  async getAccounts(): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get('/accounts');
    return this.createResponse(response.data);
  }

  async listAccountInvoices(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get(`/accounts/${args.accountId}/invoices`, {
      params: { status: args.status }
    });
    return this.createResponse(response.data);
  }

  // Comment Resolution Methods
  async resolveCommentThread(threadId: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post(`/comments-resolutions/${threadId}`);
    return this.createResponse(response.data);
  }

  // Private API Network Methods
  async listPanElements(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get('/network/private', {
      params: {
        since: args.since,
        until: args.until,
        addedBy: args.addedBy,
        name: args.name,
        summary: args.summary,
        description: args.description,
        sort: args.sort,
        direction: args.direction,
        offset: args.offset,
        limit: args.limit,
        parentFolderId: args.parentFolderId,
        type: args.type
      }
    });
    return this.createResponse(response.data);
  }

  async addPanElement(args: any): Promise<ToolCallResponse> {
    const payload: any = {};

    switch (args.type) {
      case 'api':
        payload.api = { id: args.elementId };
        break;
      case 'collection':
        payload.collection = { id: args.elementId };
        break;
      case 'workspace':
        payload.workspace = { id: args.elementId };
        break;
      case 'folder':
        payload.folder = {
          name: args.name,
          description: args.description,
          parentFolderId: args.parentFolderId
        };
        break;
    }

    const response = await this.axiosInstance.post('/network/private', payload);
    return this.createResponse(response.data);
  }

  async updatePanElement(args: any): Promise<ToolCallResponse> {
    const payload: any = {};
    const path = `/network/private/${args.elementType}/${args.elementId}`;

    switch (args.elementType) {
      case 'folder':
        payload.folder = {
          name: args.name,
          description: args.description,
          parentFolderId: args.parentFolderId
        };
        break;
      default:
        payload[args.elementType] = {
          name: args.name,
          description: args.description,
          summary: args.summary,
          parentFolderId: args.parentFolderId
        };
    }

    const response = await this.axiosInstance.put(path, payload);
    return this.createResponse(response.data);
  }

  async removePanElement(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.delete(
      `/network/private/${args.elementType}/${args.elementId}`
    );
    return this.createResponse(response.data);
  }

  // Webhook Methods
  async createWebhook(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.post('/webhooks', {
      webhook: args.webhook
    }, {
      params: { workspace: args.workspace }
    });
    return this.createResponse(response.data);
  }

  // Tag Methods
  async getTaggedElements(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get(`/tags/${args.slug}/entities`, {
      params: {
        limit: args.limit,
        direction: args.direction,
        cursor: args.cursor,
        entityType: args.entityType
      }
    });
    return this.createResponse(response.data);
  }

  async getWorkspaceTags(workspaceId: string): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.get(`/workspaces/${workspaceId}/tags`);
    return this.createResponse(response.data);
  }

  async updateWorkspaceTags(args: any): Promise<ToolCallResponse> {
    const response = await this.axiosInstance.put(`/workspaces/${args.workspaceId}/tags`, {
      tags: args.tags
    });
    return this.createResponse(response.data);
  }
}
