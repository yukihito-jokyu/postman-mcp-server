# Postman API Implementation Summary

This document summarizes the core Postman API functionality implemented in our MCP server tools, mapped against the OpenAPI specification.

## Workspaces

### Implemented Operations
- Get all workspaces (`GET /workspaces`)
  - Query Parameters: type, createdBy, include
  - Supports filtering by workspace type and creator
- Get a specific workspace (`GET /workspaces/{workspaceId}`)
  - Optional include parameter for additional details
- Create workspace (`POST /workspaces`)
  - Supports setting name, description, type, and visibility
- Update workspace (`PUT /workspaces/{workspaceId}`)
  - Can modify workspace properties and linked resources
- Delete workspace (`DELETE /workspaces/{workspaceId}`)
- Get workspace global variables (`GET /workspaces/{workspaceId}/global-variables`)
- Update workspace global variables (`PUT /workspaces/{workspaceId}/global-variables`)
- Get workspace roles (`GET /workspaces/{workspaceId}/roles`)
- Update workspace roles (`PATCH /workspaces/{workspaceId}/roles`)
  - Supports updating roles for users and user groups
  - Available roles: Viewer, Editor, Admin

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
- Get a specific collection (`GET /collections/{collectionId}`)
  - Optional parameters: access_key
- Create collection (`POST /collections`)
  - Supports Postman Collection v2.1.0 format
- Update collection (`PUT /collections/{collectionId}`)
  - Full collection replacement
- Delete collection (`DELETE /collections/{collectionId}`)
- Create collection folder (`POST /collections/{collectionId}/folders`)
- Create collection request (`POST /collections/{collectionId}/requests`)
- Create collection response (`POST /collections/{collectionId}/responses`)

#### Collection Items Management
- Get folder (`GET /collections/{collectionId}/folders/{folderId}`)
- Update folder (`PUT /collections/{collectionId}/folders/{folderId}`)
- Delete folder (`DELETE /collections/{collectionId}/folders/{folderId}`)
- Get request (`GET /collections/{collectionId}/requests/{requestId}`)
- Update request (`PUT /collections/{collectionId}/requests/{requestId}`)
- Delete request (`DELETE /collections/{collectionId}/requests/{requestId}`)
- Get response (`GET /collections/{collectionId}/responses/{responseId}`)
- Update response (`PUT /collections/{collectionId}/responses/{responseId}`)
- Delete response (`DELETE /collections/{collectionId}/responses/{responseId}`)

#### Collection Forking & Merging
- Create fork (`POST /collections/fork/{collectionId}`)
- Get collection forks (`GET /collections/{collectionId}/forks`)
- Merge fork (`POST /collections/merge`)
- Pull changes (`PUT /collections/{collectionId}/pulls`)
- Get source collection status (`GET /collections/{collectionId}/source-status`)

#### Collection Comments
- Get collection comments (`GET /collections/{collectionId}/comments`)
- Create collection comment (`POST /collections/{collectionId}/comments`)
- Update collection comment (`PUT /collections/{collectionId}/comments/{commentId}`)
- Delete collection comment (`DELETE /collections/{collectionId}/comments/{commentId}`)

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
