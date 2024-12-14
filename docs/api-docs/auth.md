## Authentication & Authorization

### Authentication
- API Key authentication via `x-api-key` header
- Support for SCIM API key authentication
- Collection access key support

### Authorization
- Role-based access control
- Workspace-level permissions
- Team-level permissions
- Enterprise features access control

### Response References

#### Collection Access Keys
- GET `/collection-access-keys`
  - 200: Returns collection access keys
  - 400: Invalid cursor error
  - 401: Unauthorized error
  - 403: Forbidden error
  - 500: Server error

- DELETE `/collection-access-keys/{keyId}`
  - 204: No Content (successful deletion)
  - 401: Unauthorized error
  - 403: Forbidden error
  - 404: Access key not found
  - 500: Server error

#### Roles & Permissions

##### Workspace Roles
- GET `/workspaces-roles`
  - 200: Returns all workspace roles
  - 401: Unauthorized error
  - 403: Permission error
  - 500: Internal server error

- GET `/workspaces/{workspaceId}/roles`
  - 200: Returns workspace roles
  - 401: Unauthorized error
  - 403: Permission error
  - 404: Resource not found
  - 500: Internal server error

- PATCH `/workspaces/{workspaceId}/roles`
  - 200: Updates workspace roles
  - 400: Invalid request error
  - 401: Unauthorized error
  - 403: Permission error
  - 404: Resource not found
  - 422: Unsupported role error
  - 500: Internal server error

##### Collection Roles
- GET `/collections/{collectionId}/roles`
  - 200: Returns collection roles
  - 401: Unauthorized error
  - 403: Permission error
  - 404: Collection not found
  - 500: Internal server error

- PATCH `/collections/{collectionId}/roles`
  - 204: No Content (successful update)
  - 400: Missing property error
  - 401: Unauthorized error
  - 403: Permission error
  - 404: Collection not found
  - 500: Internal server error

Notes:
- Role operations support both user and user group management
- SCIM ID support available with `identifierType=scim` header
- Role operations are limited to 50 operations per call
- Partner and Guest external roles are not supported via the API
- Personal and partner workspace roles cannot be modified
