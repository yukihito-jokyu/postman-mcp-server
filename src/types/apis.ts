// Basic API types
export interface ApiBase {
  name: string;
  summary?: string;
  description?: string;
}

// Essential request types
export interface CreateApiRequest {
  name: string;
  workspaceId: string;
  summary?: string;
  description?: string;
}

export interface UpdateApiRequest {
  name?: string;
  summary?: string;
  description?: string;
  versionTag?: string;
}

// Parameters for list/query operations
export interface ListApisParams {
  workspaceId: string;
  cursor?: string;
  limit?: number;
  createdBy?: number;
  description?: string;
}

// Schema and version related types
export interface CreateApiSchemaRequest {
  type: string;
  files: Array<{
    path: string;
    content: string;
    root?: { enabled: boolean }
  }>;
}

export interface CreateApiVersionRequest {
  name: string;
  schemas: Array<{ id?: string; filePath?: string; directoryPath?: string }>;
  collections: Array<{ id?: string; filePath?: string }>;
  branch?: string;
  releaseNotes?: string;
}

// Collection and comment types
export interface AddApiCollectionRequest {
  operationType: 'COPY_COLLECTION' | 'CREATE_NEW' | 'GENERATE_FROM_SCHEMA';
  name?: string;
  data?: {
    collectionId?: string;
    info?: { name: string; schema: string };
    item?: any[];
  };
  options?: Record<string, any>;
}

export interface CommentRequest {
  content: string;
  threadId?: number;
}

// Query parameters
export interface QueryParams {
  cursor?: string;
  limit?: number;
}

export interface GetSchemaFilesParams extends QueryParams {
  apiId: string;
  schemaId: string;
  versionId?: string;
}

export interface GetCommentsParams extends QueryParams {
  apiId: string;
}
