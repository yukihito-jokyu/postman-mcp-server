import { WorkspaceArg, CollectionIdArg, isWorkspaceArg, isCollectionIdArg } from './common.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * Collection query parameter interfaces
 */

export interface GetCollectionsArgs extends Partial<WorkspaceArg> {
  name?: string;
  limit?: number;
  offset?: number;
}

export interface GetCollectionArgs extends CollectionIdArg {
  access_key?: string;
  model?: 'minimal';
}

export interface GetCollectionFolderArgs extends CollectionIdArg {
  folder_id: string;
  ids?: boolean;
  uid?: boolean;
  populate?: boolean;
}

export interface DeleteCollectionFolderArgs extends CollectionIdArg {
  folder_id: string;
}

export interface GetCollectionRequestArgs extends CollectionIdArg {
  request_id: string;
  ids?: boolean;
  uid?: boolean;
  populate?: boolean;
}

export interface DeleteCollectionRequestArgs extends CollectionIdArg {
  request_id: string;
}

export interface GetCollectionResponseArgs extends CollectionIdArg {
  response_id: string;
  ids?: boolean;
  uid?: boolean;
  populate?: boolean;
}

export interface DeleteCollectionResponseArgs extends CollectionIdArg {
  response_id: string;
}

/**
 * Collection request/response related interfaces
 */

export interface CollectionInfo {
  name: string;
  description?: string;
  schema: string;
}

export interface CollectionItem {
  id?: string;
  name?: string;
  description?: string;
  request?: CollectionRequest;
  response?: CollectionResponse[];
  item?: CollectionItem[];
  auth?: CollectionAuth;
  event?: CollectionEvent[];
  variable?: CollectionVariable[];
  protocolProfileBehavior?: Record<string, any>;
}

export interface CollectionRequest {
  method?: string;
  header?: Array<{key: string; value: string; description?: string}>;
  url?: string | {
    raw?: string;
    protocol?: string;
    host?: string[];
    path?: string[];
    variable?: Array<{
      key: string;
      value?: string;
      description?: string;
    }>;
  };
  description?: string;
  body?: any;
}

export interface CollectionResponse {
  id?: string;
  name?: string;
  originalRequest?: CollectionRequest;
  status?: string;
  code?: number;
  header?: Array<{key: string; value: string}>;
  body?: string;
  cookie?: any[];
}

export interface CollectionAuth {
  type: string;
  [key: string]: any;
}

export interface CollectionEvent {
  listen: string;
  script?: {
    id?: string;
    type?: string;
    exec?: string[];
  };
}

export interface CollectionVariable {
  key: string;
  value?: string;
  type?: string;
  enabled?: boolean;
}

/**
 * Collection operation interfaces
 */

export interface CreateCollectionArgs extends WorkspaceArg {
  collection: {
    info: CollectionInfo;
    item?: CollectionItem[];
    auth?: CollectionAuth;
    event?: CollectionEvent[];
    variable?: CollectionVariable[];
  };
}

export interface UpdateCollectionArgs extends CollectionIdArg {
  collection: {
    info: CollectionInfo;
    item: CollectionItem[];
    auth?: CollectionAuth;
    event?: CollectionEvent[];
    variable?: CollectionVariable[];
  };
}

export interface ForkCollectionArgs extends CollectionIdArg, WorkspaceArg {
  label: string;
}

// Type guards for collection types
export function isGetCollectionsArgs(obj: unknown): obj is GetCollectionsArgs {
  if (typeof obj !== 'object' || obj === null) return false;
  const args = obj as GetCollectionsArgs;
  return (
    (args.workspace === undefined || typeof args.workspace === 'string') &&
    (args.name === undefined || typeof args.name === 'string') &&
    (args.limit === undefined || typeof args.limit === 'number') &&
    (args.offset === undefined || typeof args.offset === 'number')
  );
}

export function isGetCollectionArgs(obj: unknown): obj is GetCollectionArgs {
  if (!isCollectionIdArg(obj)) return false;
  const args = obj as GetCollectionArgs;
  return (
    (args.access_key === undefined || typeof args.access_key === 'string') &&
    (args.model === undefined || args.model === 'minimal')
  );
}

export function isGetCollectionFolderArgs(obj: unknown): obj is GetCollectionFolderArgs {
  if (!isCollectionIdArg(obj)) return false;
  const args = obj as GetCollectionFolderArgs;
  return (
    typeof args.folder_id === 'string' &&
    (args.ids === undefined || typeof args.ids === 'boolean') &&
    (args.uid === undefined || typeof args.uid === 'boolean') &&
    (args.populate === undefined || typeof args.populate === 'boolean')
  );
}

export function isDeleteCollectionFolderArgs(obj: unknown): obj is DeleteCollectionFolderArgs {
  if (!isCollectionIdArg(obj)) return false;
  const args = obj as DeleteCollectionFolderArgs;
  return typeof args.folder_id === 'string';
}

export function isGetCollectionRequestArgs(obj: unknown): obj is GetCollectionRequestArgs {
  if (!isCollectionIdArg(obj)) return false;
  const args = obj as GetCollectionRequestArgs;
  return (
    typeof args.request_id === 'string' &&
    (args.ids === undefined || typeof args.ids === 'boolean') &&
    (args.uid === undefined || typeof args.uid === 'boolean') &&
    (args.populate === undefined || typeof args.populate === 'boolean')
  );
}

export function isDeleteCollectionRequestArgs(obj: unknown): obj is DeleteCollectionRequestArgs {
  if (!isCollectionIdArg(obj)) return false;
  const args = obj as DeleteCollectionRequestArgs;
  return typeof args.request_id === 'string';
}

export function isGetCollectionResponseArgs(obj: unknown): obj is GetCollectionResponseArgs {
  if (!isCollectionIdArg(obj)) return false;
  const args = obj as GetCollectionResponseArgs;
  return (
    typeof args.response_id === 'string' &&
    (args.ids === undefined || typeof args.ids === 'boolean') &&
    (args.uid === undefined || typeof args.uid === 'boolean') &&
    (args.populate === undefined || typeof args.populate === 'boolean')
  );
}

export function isDeleteCollectionResponseArgs(obj: unknown): obj is DeleteCollectionResponseArgs {
  if (!isCollectionIdArg(obj)) return false;
  const args = obj as DeleteCollectionResponseArgs;
  return typeof args.response_id === 'string';
}

export function isCollectionInfo(obj: unknown): obj is CollectionInfo {
  if (typeof obj !== 'object' || obj === null) return false;
  const info = obj as CollectionInfo;
  return (
    typeof info.name === 'string' &&
    typeof info.schema === 'string' &&
    (info.description === undefined || typeof info.description === 'string')
  );
}

export function isCollectionItem(obj: unknown): obj is CollectionItem {
  if (typeof obj !== 'object' || obj === null) return false;
  const item = obj as CollectionItem;
  return (
    (item.id === undefined || typeof item.id === 'string') &&
    (item.name === undefined || typeof item.name === 'string') &&
    (item.description === undefined || typeof item.description === 'string') &&
    (item.request === undefined || typeof item.request === 'object') &&
    (item.response === undefined || Array.isArray(item.response)) &&
    (item.item === undefined || Array.isArray(item.item)) &&
    (item.auth === undefined || typeof item.auth === 'object') &&
    (item.event === undefined || Array.isArray(item.event)) &&
    (item.variable === undefined || Array.isArray(item.variable))
  );
}

export function isCreateCollectionArgs(obj: unknown): obj is CreateCollectionArgs {
  if (!isWorkspaceArg(obj)) return false;
  const args = obj as CreateCollectionArgs;
  return (
    typeof args.collection === 'object' &&
    args.collection !== null &&
    isCollectionInfo(args.collection.info) &&
    (args.collection.item === undefined || Array.isArray(args.collection.item) && args.collection.item.every(isCollectionItem)) &&
    (args.collection.auth === undefined || typeof args.collection.auth === 'object') &&
    (args.collection.event === undefined || Array.isArray(args.collection.event)) &&
    (args.collection.variable === undefined || Array.isArray(args.collection.variable))
  );
}

export function isUpdateCollectionArgs(obj: unknown): obj is UpdateCollectionArgs {
  if (!isCollectionIdArg(obj)) return false;
  const args = obj as UpdateCollectionArgs;
  return (
    typeof args.collection === 'object' &&
    args.collection !== null &&
    isCollectionInfo(args.collection.info) &&
    Array.isArray(args.collection.item) &&
    args.collection.item.every(isCollectionItem) &&
    (args.collection.auth === undefined || typeof args.collection.auth === 'object') &&
    (args.collection.event === undefined || Array.isArray(args.collection.event)) &&
    (args.collection.variable === undefined || Array.isArray(args.collection.variable))
  );
}

export function isForkCollectionArgs(obj: unknown): obj is ForkCollectionArgs {
  return (
    isCollectionIdArg(obj) &&
    isWorkspaceArg(obj) &&
    typeof (obj as ForkCollectionArgs).label === 'string'
  );
}
