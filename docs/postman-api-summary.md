# Postman API Implementation Summary

This document summarizes the core Postman API functionality implemented in our MCP server tools, mapped against the OpenAPI specification.

## Workspaces

### Implemented Operations
- Get all workspaces (`GET /workspaces`)
  - Query Parameters: type, createdBy, include
  - Supports filtering by workspace type and creator
  - Responses:
    - 200: `#/components/responses/getWorkspaces`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`
- Get a specific workspace (`GET /workspaces/{workspaceId}`)
  - Optional include parameter for additional details
  - Parameters:
    - workspaceInclude
  - Responses:
    - 200: `#/components/responses/getWorkspace`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/workspace404ErrorNotFound`
    - 500: `#/components/responses/common500ErrorServerError`
- Create workspace (`POST /workspaces`)
  - Supports setting name, description, type, and visibility
  - Note: Returns 403 if user lacks permission to create workspaces
  - Important: Linking collections/environments between workspaces is deprecated
  - Responses:
    - 200: `#/components/responses/createWorkspace`
    - 400: `#/components/responses/workspace400ErrorMalformedRequest`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/workspace403ErrorUnauthorized`
    - 500: `#/components/responses/common500ErrorServerError`
- Update workspace (`PUT /workspaces/{workspaceId}`)
  - Can modify workspace properties and linked resources
  - Important: Linking collections/environments between workspaces is deprecated
  - Responses:
    - 200: `#/components/responses/updateWorkspace`
    - 400: `#/components/responses/workspace400ErrorMalformedRequest`
    - 403: `#/components/responses/workspace403Error`
    - 404: `#/components/responses/instanceNotFoundWorkspace`
    - 500: `#/components/responses/common500ErrorServerError`
- Delete workspace (`DELETE /workspaces/{workspaceId}`)
  - Important: Deleting a workspace with linked collections/environments affects all workspaces
  - Responses:
    - 200: `#/components/responses/deleteWorkspace`
    - 400: `#/components/responses/workspace400Error`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`
- Get workspace global variables (`GET /workspaces/{workspaceId}/global-variables`)
  - Responses:
    - 200: `#/components/responses/getWorkspaceGlobalVariables`
    - 500: `#/components/responses/globalVariables500Error`
- Update workspace global variables (`PUT /workspaces/{workspaceId}/global-variables`)
  - Note: Replaces all existing global variables
  - Responses:
    - 200: `#/components/responses/updateWorkspaceGlobalVariables`
    - 500: `#/components/responses/globalVariables500Error`
- Get workspace roles (`GET /workspaces/{workspaceId}/roles`)
  - Parameters:
    - workspaceIncludeScimQuery (optional)
  - Responses:
    - 200: `#/components/responses/getWorkspaceRoles`
    - 401: `#/components/responses/unauthorizedError`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 404: `#/components/responses/resourceNotFound404Error`
    - 500: `#/components/responses/common500ErrorInternalServer`
- Update workspace roles (`PATCH /workspaces/{workspaceId}/roles`)
  - Supports updating roles for users and user groups
  - Available roles: Viewer, Editor, Admin
  - Note: Cannot set roles for personal/partner workspaces
  - Limited to 50 operations per call
  - Parameters:
    - identifierType (for SCIM IDs)
  - Responses:
    - 200: `#/components/responses/updateWorkspaceRoles`
    - 400: `#/components/responses/workspaceRoles400Error`
    - 401: `#/components/responses/unauthorizedError`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 404: `#/components/responses/resourceNotFound404Error`
    - 422: `#/components/responses/workspaceRoles422UnsupportRoleError`
    - 500: `#/components/responses/common500ErrorInternalServer`
- Get all roles (`GET /workspaces-roles`)
  - Lists available roles based on team's plan
  - Responses:
    - 200: `#/components/responses/getAllWorkspaceRoles`
    - 401: `#/components/responses/api401ErrorUnauthorized`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 500: `#/components/responses/common500ErrorInternalServer`

### Key Features
- Support for workspace types: personal, team, private, public, partner
- Workspace visibility control
- Basic workspace metadata (name, description)
- Workspace resource listings (collections, environments, mocks, monitors, APIs)
- Global variables management
- Role-based access control
- Tags management (Enterprise plans)

## Collections

### Implemented Operations
- Get all collections (`GET /collections`)
  - Query Parameters: workspace, name, limit, offset
  - Note: Filtering with name parameter is not supported when using limit/offset
  - Note: Invalid workspace ID returns empty array with 200 status
  - Responses:
    - 200: `#/components/responses/getCollections`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`
- Get a specific collection (`GET /collections/{collectionId}`)
  - Optional parameters: access_key
  - Parameters:
    - collectionAccessKeyQuery
    - collectionModelQuery
  - Responses:
    - 200: `#/components/responses/getCollection`
    - 400: `#/components/responses/collection400ErrorCollectionNotFound`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`
- Create collection (`POST /collections`)
  - Supports Postman Collection v2.1.0 format
  - Note: Creates in "My Workspace" if workspace not specified
  - Parameters:
    - workspaceQuery
  - Responses:
    - 200: `#/components/responses/createCollection`
    - 400: `#/components/responses/collection400ErrorInstanceFound`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`
- Update collection (`PUT /collections/{collectionId}`)
  - Full collection replacement
  - Note: Maximum collection size: 20 MB
  - Important: Include collection item IDs to prevent recreation
  - Responses:
    - 200: `#/components/responses/putCollection`
    - 400: `#/components/responses/collection400ErrorMalformedRequest`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403Error`
    - 404: `#/components/responses/instanceNotFoundCollection`
    - 500: `#/components/responses/common500ErrorServerError`
- Delete collection (`DELETE /collections/{collectionId}`)
  - Responses:
    - 200: `#/components/responses/deleteCollection`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/instanceNotFoundCollection`
    - 500: `#/components/responses/common500ErrorServerError`
- Create collection folder (`POST /collections/{collectionId}/folders`)
- Create collection request (`POST /collections/{collectionId}/requests`)
- Create collection response (`POST /collections/{collectionId}/responses`)

#### Collection Items Management
- Get folder (`GET /collections/{collectionId}/folders/{folderId}`)
  - Parameters:
    - collectionItemsIdQuery
    - collectionItemsUidFormatQuery
    - collectionItemsPopulateQuery
  - Responses:
    - 200: `#/components/responses/getCollectionFolder`
    - 401: `#/components/responses/collectionFolder401Error`
    - 404: `#/components/responses/collectionFolder404Error`
    - 500: `#/components/responses/common500Error`
- Update folder (`PUT /collections/{collectionId}/folders/{folderId}`)
  - Note: Acts like PATCH, only updates provided values
  - Responses:
    - 200: `#/components/responses/updateCollectionFolder`
    - 400: `#/components/responses/collectionFolder400Error`
    - 401: `#/components/responses/collectionFolder401Error`
    - 404: `#/components/responses/collectionFolder404Error`
    - 500: `#/components/responses/common500Error`
- Delete folder (`DELETE /collections/{collectionId}/folders/{folderId}`)
  - Responses:
    - 200: `#/components/responses/deleteCollectionFolder`
    - 401: `#/components/responses/collectionFolder401Error`
    - 404: `#/components/responses/collectionFolder404Error`
    - 500: `#/components/responses/common500Error`
- Create folder (`POST /collections/{collectionId}/folders`)
  - Note: Empty name creates folder with blank name
  - Responses:
    - 200: `#/components/responses/createCollectionFolder`
    - 400: `#/components/responses/collectionFolder400Error`
    - 401: `#/components/responses/collectionFolder401Error`
    - 500: `#/components/responses/common500Error`
- Get request (`GET /collections/{collectionId}/requests/{requestId}`)
- Update request (`PUT /collections/{collectionId}/requests/{requestId}`)
- Delete request (`DELETE /collections/{collectionId}/requests/{requestId}`)
- Get response (`GET /collections/{collectionId}/responses/{responseId}`)
- Update response (`PUT /collections/{collectionId}/responses/{responseId}`)
- Delete response (`DELETE /collections/{collectionId}/responses/{responseId}`)

#### Collection Transfers
- Transfer folders (`POST /collection-folders-transfers`)
  - Copy or move folders between collections
  - Responses:
    - 200: `#/components/responses/transferCollectionItems200Error`
    - 400: `#/components/responses/transferCollectionItems400Error`
    - 500: `#/components/responses/common500Error`
- Transfer requests (`POST /collection-requests-transfers`)
  - Copy or move requests between collections/folders
  - Responses:
    - 200: `#/components/responses/transferCollectionItems200Error`
    - 400: `#/components/responses/transferCollectionItems400Error`
    - 500: `#/components/responses/common500Error`
- Transfer responses (`POST /collection-responses-transfers`)
  - Copy or move responses between requests
  - Responses:
    - 200: `#/components/responses/transferCollectionItems200Error`
    - 400: `#/components/responses/transferCollectionItems400Error`
    - 500: `#/components/responses/common500Error`

#### Collection Forking & Merging
- Create fork (`POST /collections/fork/{collectionId}`)
  - Parameters:
    - forkWorkspaceQuery
  - Responses:
    - 200: `#/components/responses/createCollectionFork`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/instanceNotFoundCollection`
    - 500: `#/components/responses/common500ErrorServerError`
- Get collection forks (`GET /collections/{collectionId}/forks`)
  - Parameters:
    - cursor
    - limit
    - createdAtSort
  - Responses:
    - 200: `#/components/responses/getCollectionForks`
    - 400: `#/components/responses/forkCollection400ErrorNoForks`
    - 404: `#/components/responses/fork404Error`
    - 500: `#/components/responses/common500Error`
- Get all forked collections (`GET /collections/collection-forks`)
  - Parameters:
    - cursor
    - limit
    - createdAtSort
  - Responses:
    - 200: `#/components/responses/getCollectionsForkedByUser`
    - 400: `#/components/responses/fork400ErrorNoUserFound`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500Error`
- Merge or pull changes (`PUT /collection-merges`)
  - Asynchronous operation with task status tracking
  - Responses:
    - 200: `#/components/responses/asyncMergeCollectionFork`
    - 400: `#/components/responses/collectionForks400ErrorMalformedRequest`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/collectionForks403ErrorForbidden`
    - 500: `#/components/responses/common500Error`
- Get merge/pull task status (`GET /collections-merges-tasks/{taskId}`)
  - Note: Task status available for 24 hours after completion
  - Parameters:
    - collectionForkTaskId
  - Responses:
    - 200: `#/components/responses/asyncMergePullCollectionTaskStatus`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/collectionForks403ErrorForbidden`
    - 404: `#/components/responses/collectionForks404ErrorTaskNotFound`
    - 500: `#/components/responses/common500Error`
- Pull changes (`PUT /collections/{collectionId}/pulls`)
  - Responses:
    - 200: `#/components/responses/pullCollectionChanges`
    - 400: `#/components/responses/forkCollection400ErrorBadId`
    - 404: `#/components/responses/instanceNotFoundCollection`
    - 500: `#/components/responses/common500Error`
- Get source collection status (`GET /collections/{collectionId}/source-status`)
  - Note: May take a few minutes to return updated status
  - Responses:
    - 200: `#/components/responses/getSourceCollectionStatus`
    - 400: `#/components/responses/forkCollection400ErrorNotForked`
    - 403: `#/components/responses/pullRequest403ErrorForbidden`
    - 500: `#/components/responses/common500Error`

#### Collection Comments
- Get collection comments (`GET /collections/{collectionId}/comments`)
  - Responses:
    - 200: `#/components/responses/commentGet`
    - 401: `#/components/responses/comment401Error`
    - 403: `#/components/responses/comment403Error`
    - 404: `#/components/responses/comment404Error`
    - 500: `#/components/responses/comment500Error`
- Create collection comment (`POST /collections/{collectionId}/comments`)
  - Note: Maximum 10,000 characters
  - Responses:
    - 201: `#/components/responses/commentCreated`
    - 401: `#/components/responses/comment401Error`
    - 403: `#/components/responses/comment403Error`
    - 404: `#/components/responses/comment404Error`
    - 500: `#/components/responses/comment500Error`
- Update collection comment (`PUT /collections/{collectionId}/comments/{commentId}`)
  - Note: Maximum 10,000 characters
  - Responses:
    - 200: `#/components/responses/commentUpdated`
    - 401: `#/components/responses/comment401Error`
    - 403: `#/components/responses/comment403Error`
    - 404: `#/components/responses/comment404Error`
    - 500: `#/components/responses/comment500Error`
- Delete collection comment (`DELETE /collections/{collectionId}/comments/{commentId}`)
  - Note: Deleting first comment deletes entire thread
  - Responses:
    - 204: No Content
    - 401: `#/components/responses/comment401Error`
    - 403: `#/components/responses/comment403Error`
    - 404: `#/components/responses/comment404Error`
    - 500: `#/components/responses/comment500Error`


#### Collection Access Keys
- Get collection access keys (`GET /collection-access-keys`)
  - Lists personal and team collection access keys
  - Includes expiration and last used information
  - Parameters:
    - collectionUidQuery
    - cursor
  - Responses:
    - 200: `#/components/responses/getCollectionAccessKeys`
    - 400: `#/components/responses/common400ErrorInvalidCursor`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403ErrorForbidden`
    - 500: `#/components/responses/common500ErrorSomethingWrong`
- Delete collection access key (`DELETE /collection-access-keys/{keyId}`)
  - Responses:
    - 204: No Content
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403ErrorForbidden`
    - 404: `#/components/responses/cakNotFound404Error`
    - 500: `#/components/responses/common500ErrorSomethingWrong`

### Key Features
- Collection CRUD operations
- Support for Postman Collection Format v2.1.0
- Collection metadata management
- Nested folder structure support
- Request and response management
- Version control (fork, merge, pull)
- Commenting system
- Collection transfer capabilities
- Collection access key management

## Environments

### Implemented Operations
- Get all environments (`GET /environments`)
  - Query Parameters: workspace
- Get a specific environment (`GET /environments/{environmentId}`)
- Create environment (`POST /environments`)
- Update environment (`PUT /environments/{environmentId}`)
- Delete environment (`DELETE /environments/{environmentId}`)
- Create environment fork (`POST /environments/{environmentId}/forks`)
- Get environment forks (`GET /environments/{environmentId}/forks`)
- Merge environment fork (`POST /environments/{environmentId}/merges`)
- Pull environment changes (`POST /environments/{environmentId}/pulls`)

### Key Features
- Environment CRUD operations
- Environment variable management
- Support for secret and default variable types
- Basic environment metadata management
- Version control features (fork, merge, pull)
- Workspace scoping

## APIs

### Implemented Operations
- Get all APIs (`GET /apis`)
  - Query Parameters: workspace, createdBy, cursor, description, limit
- Create API (`POST /apis`)
- Get specific API (`GET /apis/{apiId}`)
- Update API (`PUT /apis/{apiId}`)
- Delete API (`DELETE /apis/{apiId}`)

#### API Collections
- Add collection (`POST /apis/{apiId}/collections`)
- Get collection (`GET /apis/{apiId}/collections/{collectionId}`)
- Sync collection with schema (`PUT /apis/{apiId}/collections/{collectionId}/sync-with-schema-tasks`)

#### API Schemas
- Create schema (`POST /apis/{apiId}/schemas`)
- Get schema (`GET /apis/{apiId}/schemas/{schemaId}`)
- Get schema files (`GET /apis/{apiId}/schemas/{schemaId}/files`)
- Get schema file contents (`GET /apis/{apiId}/schemas/{schemaId}/files/{file-path}`)
- Create/update schema file (`PUT /apis/{apiId}/schemas/{schemaId}/files/{file-path}`)
- Delete schema file (`DELETE /apis/{apiId}/schemas/{schemaId}/files/{file-path}`)

#### API Comments
- Get API comments (`GET /apis/{apiId}/comments`)
- Create API comment (`POST /apis/{apiId}/comments`)
- Update API comment (`PUT /apis/{apiId}/comments/{commentId}`)
- Delete API comment (`DELETE /apis/{apiId}/comments/{commentId}`)

### Key Features
- API definition management
- Schema version control
- Collection integration
- Multi-file schema support
- Commenting system
- API versioning
- Git repository integration

## Mocks

### Implemented Operations
- Get all mock servers (`GET /mocks`)
- Create mock server (`POST /mocks`)
- Get specific mock server (`GET /mocks/{mockId}`)
- Update mock server (`PUT /mocks/{mockId}`)
- Delete mock server (`DELETE /mocks/{mockId}`)
- Get mock call logs (`GET /mocks/{mockId}/call-logs`)
- Publish mock server (`POST /mocks/{mockId}/publish`)
- Unpublish mock server (`DELETE /mocks/{mockId}/unpublish`)

#### Server Responses
- Get all server responses (`GET /mocks/{mockId}/server-responses`)
- Create server response (`POST /mocks/{mockId}/server-responses`)
- Get server response (`GET /mocks/{mockId}/server-responses/{serverResponseId}`)
- Update server response (`PUT /mocks/{mockId}/server-responses/{serverResponseId}`)
- Delete server response (`DELETE /mocks/{mockId}/server-responses/{serverResponseId}`)

### Key Features
- Mock server management
- Call logging and history
- Custom server responses
- Public/private visibility control
- Response simulation (5xx errors)

## Monitors

### Implemented Operations
- Get all monitors (`GET /monitors`)
- Create monitor (`POST /monitors`)
- Get specific monitor (`GET /monitors/{monitorId}`)
- Update monitor (`PUT /monitors/{monitorId}`)
- Delete monitor (`DELETE /monitors/{monitorId}`)
- Run monitor (`POST /monitors/{monitorId}/run`)

### Key Features
- Monitor CRUD operations
- Scheduled runs
- Manual run capability
- Run results and statistics
- Workspace integration

## Security Features

### API Security Validation
- API definition security validation (`POST /security/api-validation`)
  - OWASP security rules integration
  - Maximum definition size: 10 MB
  - Automated schema validation

### Secret Scanner (Enterprise)
- Get secret types (`GET /secret-types`)
- Search detected secrets (`POST /detected-secrets-queries`)
- Update secret resolution status (`PUT /detected-secrets/{secretId}`)
- Get detected secrets locations (`GET /detected-secrets/{secretId}/locations`)

### Audit Logs (Enterprise)
- Get team audit logs (`GET /audit/logs`)
  - Comprehensive event tracking
  - Filtering by date range
  - Pagination support

## Additional Features

### Private API Network (Enterprise)
- Get all elements and folders (`GET /network/private`)
- Add element or folder (`POST /network/private`)
- Update element or folder (`PUT /network/private/{elementType}/{elementId}`)
- Remove element or folder (`DELETE /network/private/{elementType}/{elementId}`)
- Get element add requests (`GET /network/private/network-entity/request/all`)
- Respond to element add request (`PUT /network/private/network-entity/request/{requestId}`)

### Webhooks
- Create webhook (`POST /webhooks`)
  - Custom payload support
  - Collection trigger integration

### Tags (Enterprise)
- Get elements by tag (`GET /tags/{slug}/entities`)
- Get/Update workspace tags (`GET/PUT /workspaces/{workspaceId}/tags`)
- Get/Update collection tags (`GET/PUT /collections/{collectionId}/tags`)
- Get/Update API tags (`GET/PUT /apis/{apiId}/tags`)

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

## Common Features

### Pagination
- Cursor-based pagination
- Limit/offset pagination
- Default and maximum limits

### Error Handling
- Standard HTTP status codes
- Detailed error messages
- Error categorization
- Consistent error response format

### Resource Management
- Workspace scoping
- Resource metadata
- Version control
- Commenting system
- Tags and categorization

## Notes

This implementation provides comprehensive coverage of the Postman API, including core CRUD operations for main resources (workspaces, collections, environments, APIs) and advanced features like mock servers, monitors, and security scanning. Enterprise-specific features are clearly marked and provide additional functionality for team collaboration and security management.

The API follows RESTful principles with consistent patterns for resource management, authentication, and error handling. The implementation supports both basic usage patterns and advanced workflows through version control, security features, and team collaboration tools.
