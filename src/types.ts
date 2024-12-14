import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export interface WorkspaceIdArg {
  workspace_id: string;
}

export interface EnvironmentIdArg {
  environment_id: string;
}

export interface CollectionIdArg {
  collection_id: string;
}

export interface EnvironmentValue {
  key: string;
  value: string;
  type?: 'default' | 'secret';
  enabled?: boolean;
}

export interface CreateEnvironmentArgs extends WorkspaceIdArg {
  name: string;
  values: EnvironmentValue[];
}

export interface UpdateEnvironmentArgs extends EnvironmentIdArg {
  name: string;
  values: EnvironmentValue[];
}

export interface CreateCollectionArgs extends WorkspaceIdArg {
  name: string;
  description?: string;
  schema: object;
}

export interface UpdateCollectionArgs extends CollectionIdArg {
  name: string;
  description?: string;
  schema: object;
}

export interface ForkCollectionArgs extends CollectionIdArg, WorkspaceIdArg {
  label: string;
}

export interface ToolHandler {
  axiosInstance: AxiosInstance;
}

// Type guards
export function isWorkspaceIdArg(obj: unknown): obj is WorkspaceIdArg {
  return typeof obj === 'object' && obj !== null && typeof (obj as WorkspaceIdArg).workspace_id === 'string';
}

export function isEnvironmentIdArg(obj: unknown): obj is EnvironmentIdArg {
  return typeof obj === 'object' && obj !== null && typeof (obj as EnvironmentIdArg).environment_id === 'string';
}

export function isCollectionIdArg(obj: unknown): obj is CollectionIdArg {
  return typeof obj === 'object' && obj !== null && typeof (obj as CollectionIdArg).collection_id === 'string';
}

export function isEnvironmentValue(obj: unknown): obj is EnvironmentValue {
  if (typeof obj !== 'object' || obj === null) return false;
  const value = obj as EnvironmentValue;
  return (
    typeof value.key === 'string' &&
    typeof value.value === 'string' &&
    (value.type === undefined || value.type === 'default' || value.type === 'secret') &&
    (value.enabled === undefined || typeof value.enabled === 'boolean')
  );
}

export function isCreateEnvironmentArgs(obj: unknown): obj is CreateEnvironmentArgs {
  if (!isWorkspaceIdArg(obj)) return false;
  const args = obj as CreateEnvironmentArgs;
  return (
    typeof args.name === 'string' &&
    Array.isArray(args.values) &&
    args.values.every(isEnvironmentValue)
  );
}

export function isUpdateEnvironmentArgs(obj: unknown): obj is UpdateEnvironmentArgs {
  if (!isEnvironmentIdArg(obj)) return false;
  const args = obj as UpdateEnvironmentArgs;
  return (
    typeof args.name === 'string' &&
    Array.isArray(args.values) &&
    args.values.every(isEnvironmentValue)
  );
}

export function isCreateCollectionArgs(obj: unknown): obj is CreateCollectionArgs {
  if (!isWorkspaceIdArg(obj)) return false;
  const args = obj as CreateCollectionArgs;
  return (
    typeof args.name === 'string' &&
    (args.description === undefined || typeof args.description === 'string') &&
    typeof args.schema === 'object' && args.schema !== null
  );
}

export function isUpdateCollectionArgs(obj: unknown): obj is UpdateCollectionArgs {
  if (!isCollectionIdArg(obj)) return false;
  const args = obj as UpdateCollectionArgs;
  return (
    typeof args.name === 'string' &&
    (args.description === undefined || typeof args.description === 'string') &&
    typeof args.schema === 'object' && args.schema !== null
  );
}

export function isForkCollectionArgs(obj: unknown): obj is ForkCollectionArgs {
  return (
    isCollectionIdArg(obj) &&
    isWorkspaceIdArg(obj) &&
    typeof (obj as ForkCollectionArgs).label === 'string'
  );
}

// Validation helper
export function validateArgs<T>(
  obj: unknown,
  validator: (obj: unknown) => obj is T,
  errorMessage: string
): T {
  if (!validator(obj)) {
    throw new McpError(ErrorCode.InvalidParams, errorMessage);
  }
  return obj;
}
