import { ToolDefinition } from '../../../types/index.js';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
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
          description: 'Return all IDs in UID format',
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
          description: 'Return all IDs in UID format',
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
          description: 'Return all IDs in UID format',
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
