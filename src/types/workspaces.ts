export interface ListWorkspacesParams {
  type?: 'personal' | 'team' | 'private' | 'public' | 'partner';
  createdBy?: string;
  include?: string;
}

export interface WorkspaceBase {
  name: string;
  description?: string;
  type: 'personal' | 'team' | 'private' | 'public' | 'partner';
  visibility?: 'personal' | 'team' | 'private' | 'public' | 'partner';
}

export interface CreateWorkspaceRequest extends WorkspaceBase {
  // Additional fields specific to creation
}

export interface UpdateWorkspaceRequest extends Partial<WorkspaceBase> {
  // Partial allows all fields to be optional for updates
}

export interface GlobalVariable {
  key: string;
  value: string;
  type?: 'default' | 'secret';
  enabled?: boolean;
}

export type WorkspaceRole = 'Viewer' | 'Editor' | 'Admin';

export interface RoleUpdate {
  op: 'add' | 'remove';
  path: string;
  value: WorkspaceRole;
}
