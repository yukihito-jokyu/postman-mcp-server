import { ListResourcesRequestSchema, ReadResourceRequestSchema, ListResourceTemplatesRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import axios from 'axios';
import { BaseResourceHandler, Resource, ResourceTemplate, ResourceContent } from '../types/resource.js';

/**
 * Handles resource requests for Postman API resources
 */
export class PostmanResourceHandler extends BaseResourceHandler {
  // Set of valid direct resource types (no parameters)
  private static readonly DIRECT_RESOURCES = new Set([
    'workspaces',
    'user',
    'apis',
    'collections',
    'environments',
    'mocks',
    'monitors',
    'collection-roles',
    'workspace-roles',
    'collection-access-keys',
    'pan-elements',
    'webhooks',
    'tagged-elements',
    'workspace-tags',
    'api-tags'
  ]);

  // Rate limiting configuration
  private static readonly RATE_LIMIT = {
    maxRequests: Number(process.env.POSTMAN_RATE_LIMIT_MAX) || 60,
    windowMs: Number(process.env.POSTMAN_RATE_LIMIT_WINDOW) || 60000 // 1 minute
  };

  private requestCount: number = 0;
  private windowStart: number = Date.now();

  constructor(private server: Server) {
    super();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: await this.listResources()
    }));

    this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
      resourceTemplates: await this.listResourceTemplates()
    }));

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => ({
      contents: await this.readResource(request.params.uri)
    }));
  }

  /**
   * List all available direct resources
   */
  async listResources(): Promise<Resource[]> {
    return [
      // Core Resources
      {
        uri: 'postman://workspaces',
        name: 'Postman Workspaces',
        description: 'List of all available Postman workspaces',
        mimeType: 'application/json',
      },
      {
        uri: 'postman://user',
        name: 'Current User',
        description: 'Information about the currently authenticated user',
        mimeType: 'application/json',
      },
      // API Development Resources
      {
        uri: 'postman://apis',
        name: 'Postman APIs',
        description: 'List of all available API definitions',
        mimeType: 'application/json',
      },
      {
        uri: 'postman://collections',
        name: 'Postman Collections',
        description: 'List of all available request collections',
        mimeType: 'application/json',
      },
      {
        uri: 'postman://environments',
        name: 'Postman Environments',
        description: 'List of all available environments',
        mimeType: 'application/json',
      },
      // Testing & Monitoring Resources
      {
        uri: 'postman://mocks',
        name: 'Postman Mocks',
        description: 'List of all available mock servers',
        mimeType: 'application/json',
      },
      {
        uri: 'postman://monitors',
        name: 'Postman Monitors',
        description: 'List of all available collection monitors',
        mimeType: 'application/json',
      },
      // Security & Access Control Resources
      {
        uri: 'postman://collection-roles',
        name: 'Collection Roles',
        description: 'List of roles and permissions for collections',
        mimeType: 'application/json',
      },
      {
        uri: 'postman://workspace-roles',
        name: 'Workspace Roles',
        description: 'List of roles and permissions for workspaces',
        mimeType: 'application/json',
      },
      {
        uri: 'postman://collection-access-keys',
        name: 'Collection Access Keys',
        description: 'List of access keys for collections',
        mimeType: 'application/json',
      },
      // Additional Features
      {
        uri: 'postman://pan-elements',
        name: 'Private API Network Elements',
        description: 'List of elements in the Private API Network',
        mimeType: 'application/json',
      },
      {
        uri: 'postman://webhooks',
        name: 'Webhooks',
        description: 'List of configured webhooks',
        mimeType: 'application/json',
      },
      {
        uri: 'postman://tagged-elements',
        name: 'Tagged Elements',
        description: 'List of elements with specific tags',
        mimeType: 'application/json',
      },
      {
        uri: 'postman://workspace-tags',
        name: 'Workspace Tags',
        description: 'List of tags used in workspaces',
        mimeType: 'application/json',
      },
      {
        uri: 'postman://api-tags',
        name: 'API Tags',
        description: 'List of tags used in APIs',
        mimeType: 'application/json',
      }
    ];
  }

  /**
   * List all available resource templates
   */
  async listResourceTemplates(): Promise<ResourceTemplate[]> {
    return [
      // Workspace Resources
      {
        uriTemplate: 'postman://workspaces/{workspaceId}/collections',
        name: 'Workspace Collections',
        description: 'List of collections in a specific workspace',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'postman://workspaces/{workspaceId}/environments',
        name: 'Workspace Environments',
        description: 'List of environments in a specific workspace',
        mimeType: 'application/json',
      },
      // API Resources
      {
        uriTemplate: 'postman://apis/{apiId}',
        name: 'API Details',
        description: 'Details of a specific API',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'postman://apis/{apiId}/versions',
        name: 'API Versions',
        description: 'List of versions for a specific API',
        mimeType: 'application/json',
      },
      // Collection Resources
      {
        uriTemplate: 'postman://collections/{collectionId}',
        name: 'Collection Details',
        description: 'Details of a specific collection',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'postman://collections/{collectionId}/requests',
        name: 'Collection Requests',
        description: 'List of requests in a specific collection',
        mimeType: 'application/json',
      }
    ];
  }

  /**
   * Read a resource's contents
   */
  async readResource(uri: string): Promise<ResourceContent[]> {
    await this.checkRateLimit();

    const { protocol, resourceType, params } = this.parseUri(uri);

    if (protocol !== 'postman') {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Invalid protocol: ${protocol}. Expected: postman`
      );
    }

    // For direct resources, validate against DIRECT_RESOURCES
    if (Object.keys(params).length === 0 && !PostmanResourceHandler.DIRECT_RESOURCES.has(resourceType)) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Unknown direct resource type: ${resourceType}`
      );
    }

    try {
      const endpoint = this.buildEndpoint(resourceType, params);
      const response = await this.makePostmanRequest(endpoint);

      return [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(response.data, null, 2)
      }];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'Postman API rate limit exceeded'
          );
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Postman API error: ${error.response?.data?.error?.message || error.message}`
        );
      }
      throw error;
    }
  }

  private async checkRateLimit() {
    const now = Date.now();
    if (now - this.windowStart >= PostmanResourceHandler.RATE_LIMIT.windowMs) {
      this.requestCount = 0;
      this.windowStart = now;
    }

    if (this.requestCount >= PostmanResourceHandler.RATE_LIMIT.maxRequests) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Rate limit exceeded. Maximum ${PostmanResourceHandler.RATE_LIMIT.maxRequests} requests per ${PostmanResourceHandler.RATE_LIMIT.windowMs / 1000} seconds.`
      );
    }

    this.requestCount++;
  }

  private async makePostmanRequest(endpoint: string) {
    if (!process.env.POSTMAN_API_KEY) {
      throw new McpError(ErrorCode.InternalError, 'Postman API key not configured');
    }

    return await axios.get(`https://api.getpostman.com${endpoint}`, {
      headers: {
        'X-Api-Key': process.env.POSTMAN_API_KEY
      }
    });
  }

  private buildEndpoint(resourceType: string, params: Record<string, string>): string {
    // Map resource types to Postman API endpoints
    switch (resourceType) {
      // Direct resources
      case 'workspaces':
        return '/workspaces';
      case 'user':
        return '/me';
      case 'apis':
        return '/apis';
      case 'collections':
        return '/collections';
      case 'environments':
        return '/environments';
      case 'mocks':
        return '/mocks';
      case 'monitors':
        return '/monitors';
      case 'collection-roles':
        return '/roles/collections';
      case 'workspace-roles':
        return '/roles/workspaces';
      case 'collection-access-keys':
        return '/collection-access-keys';
      case 'pan-elements':
        return '/pan/elements';
      case 'webhooks':
        return '/webhooks';
      case 'tagged-elements':
        return '/tagged-elements';
      case 'workspace-tags':
        return '/workspace-tags';
      case 'api-tags':
        return '/api-tags';

      // Templated resources
      case 'workspaces-collections':
        return `/workspaces/${params.workspaceId}/collections`;
      case 'workspaces-environments':
        return `/workspaces/${params.workspaceId}/environments`;
      case 'apis-details':
        return `/apis/${params.apiId}`;
      case 'apis-versions':
        return `/apis/${params.apiId}/versions`;
      case 'collections-details':
        return `/collections/${params.collectionId}`;
      case 'collections-requests':
        return `/collections/${params.collectionId}/requests`;
      default:
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Unsupported resource type: ${resourceType}`
        );
    }
  }
}
