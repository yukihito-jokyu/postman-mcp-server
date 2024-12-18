export interface WorkspaceArg {
  workspace: string;
}

export interface EnvironmentIdArg {
  environmentId: string;
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

// Type guards for common types
export function isWorkspaceArg(obj: unknown): obj is WorkspaceArg {
  return typeof obj === 'object' && obj !== null && typeof (obj as WorkspaceArg).workspace === 'string';
}

export function isEnvironmentIdArg(obj: unknown): obj is EnvironmentIdArg {
  return typeof obj === 'object' && obj !== null && typeof (obj as EnvironmentIdArg).environmentId === 'string';
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
