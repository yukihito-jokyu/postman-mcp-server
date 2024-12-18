import { ListResourcesRequestSchema, ReadResourceRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import axios from 'axios';

/**
 * Handles direct resource requests for Postman API resources
 */
export class ResourceHandler {
  // Set of valid direct resource types (no parameters)
  private static DIRECT_RESOURCES = new Set([
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

  constructor(private server: Server) {
    this.setupHandlers();
  }

  private setupHandlers() {
    this.setupListResources();
    this.setupReadResource();
  }

  private setupListResources() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
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
      ],
    }));
  }

  private setupReadResource() {
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        // Only handle direct resources (no path parameters)
        // Format: postman://{resource-type}
        const match = uri.match(/^postman:\/\/([^/]+)$/);
        if (!match) {
          throw new McpError(ErrorCode.InvalidRequest, `Not a direct resource URI: ${uri}`);
        }

        const resourceType = match[1];
        if (!ResourceHandler.DIRECT_RESOURCES.has(resourceType)) {
          throw new McpError(ErrorCode.InvalidRequest, `Unknown resource type: ${resourceType}`);
        }

        let endpoint = '';
        let transformResponse = (data: any) => data;

        // Map URI resource types to Postman API endpoints
        switch (resourceType) {
          case 'workspaces':
            endpoint = '/workspaces';
            break;
          case 'user':
            endpoint = '/me';
            break;
          case 'apis':
            endpoint = '/apis';
            break;
          case 'collections':
            endpoint = '/collections';
            break;
          case 'environments':
            endpoint = '/environments';
            break;
          case 'mocks':
            endpoint = '/mocks';
            break;
          case 'monitors':
            endpoint = '/monitors';
            break;
          case 'collection-roles':
            endpoint = '/roles/collections';
            break;
          case 'workspace-roles':
            endpoint = '/roles/workspaces';
            break;
          case 'collection-access-keys':
            endpoint = '/collection-access-keys';
            break;
          case 'pan-elements':
            endpoint = '/pan/elements';
            break;
          case 'webhooks':
            endpoint = '/webhooks';
            break;
          case 'tagged-elements':
            endpoint = '/tagged-elements';
            break;
          case 'workspace-tags':
            endpoint = '/workspace-tags';
            break;
          case 'api-tags':
            endpoint = '/api-tags';
            break;
        }

        // Make request to Postman API
        const response = await axios.get(`https://api.getpostman.com${endpoint}`, {
          headers: {
            'X-Api-Key': process.env.POSTMAN_API_KEY!,
          },
        });

        // Transform response into MCP resource content
        const content = transformResponse(response.data);

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(content, null, 2),
            },
          ],
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        if (axios.isAxiosError(error)) {
          throw new McpError(
            ErrorCode.InternalError,
            `Postman API error: ${error.response?.data?.error?.message || error.message}`
          );
        }
        throw error;
      }
    });
  }
}
