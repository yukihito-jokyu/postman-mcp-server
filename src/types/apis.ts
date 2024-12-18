
export interface ApiBase {
  name: string;
  summary?: string;
  description?: string;
}

export interface CreateApiRequest extends ApiBase {
  workspaceId: string;
}

export interface UpdateApiRequest extends Partial<ApiBase> {
  versionTag?: string;
}

export interface ListApisParams {
  workspaceId: string;
  createdBy?: number;
  cursor?: string;
  description?: string;
  limit?: number;
}

export interface AddApiCollectionRequest {
  operationType: 'COPY_COLLECTION' | 'CREATE_NEW' | 'GENERATE_FROM_SCHEMA';
  data?: {
    collectionId?: string;
    info?: {
      name: string;
      schema: string;
    };
    item?: any[];
  };
  name?: string;
  options?: Record<string, any>;
}

export interface CreateApiSchemaRequest {
  type: 'proto:2' | 'proto:3' | 'graphql' | 'openapi:3_1' | 'openapi:3' | 'openapi:2' | 'openapi:1' | 'raml:1' | 'raml:0_8' | 'wsdl:2' | 'wsdl:1' | 'asyncapi:2';
  files: Array<{
    path: string;
    root?: {
      enabled: boolean;
    };
    content: string;
  }>;
}

export interface CreateApiVersionRequest {
  name: string;
  schemas: Array<{
    id?: string;
    filePath?: string;
    directoryPath?: string;
  }>;
  collections: Array<{
    id?: string;
    filePath?: string;
  }>;
  branch?: string;
  releaseNotes?: string;
}

export interface UpdateApiVersionRequest {
  name: string;
  releaseNotes?: string;
}

export interface CreateCommentRequest {
  content: string;
  threadId?: number;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface UpdateTagsRequest {
  tags: Array<{
    slug: string;
    name?: string;
  }>;
}

export interface GetSchemaFilesParams {
  apiId: string;
  schemaId: string;
  cursor?: string;
  limit?: number;
  versionId?: string;
}

export interface CreateUpdateSchemaFileRequest {
  content: string;
  root?: {
    enabled: boolean;
  };
}

export interface GetCommentsParams {
  apiId: string;
  cursor?: string;
  limit?: number;
}
