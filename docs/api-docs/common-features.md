## Common Features

### Pagination
- Cursor-based pagination
  - Used in endpoints like:
    - `/apis` with `#/components/parameters/cursor`
    - `/collection-access-keys` with `#/components/parameters/cursor`
    - `/detected-secrets/{secretId}/locations` with `#/components/parameters/cursor`
  - Often paired with `limit` parameter to control page size

- Limit/offset pagination
  - Used in endpoints like:
    - `/collections` with `#/components/parameters/limitNoDefault` and `#/components/parameters/offsetNoDefault`
    - `/network/private` with `#/components/parameters/limitDefault1000` and `#/components/parameters/offset`
  - Different default limits per endpoint (e.g., 1000 for Private API Network)

### Error Handling
- Standard HTTP status codes
  - 200: Successful operation
  - 201: Resource created
  - 204: No content (successful deletion)
  - 400: Bad request/Invalid parameters
  - 401: Unauthorized
  - 403: Forbidden/Feature unavailable
  - 404: Resource not found
  - 422: Unprocessable entity
  - 500: Internal server error

- Detailed error messages
  - Consistent error response format
  - Specific error types for different scenarios
  - Error categorization by domain (e.g., API errors, collection errors)

### Resource Management
- Workspace scoping
  - Most resources belong to a workspace
  - Workspace ID required for creation operations
  - Workspace-level permissions and visibility

- Resource metadata
  - Creation and modification timestamps
  - Owner/creator information
  - Version information where applicable

- Version control
  - Forking support
  - Merge capabilities
  - Version history tracking
  - Git repository integration

- Commenting system
  - Comments on various resources (APIs, collections, etc.)
  - Thread-based discussions
  - Maximum 10,000 characters per comment
  - Comment management (CRUD operations)

- Tags and categorization
  - Enterprise feature
  - Supported on:
    - Workspaces
    - APIs
    - Collections
  - Consistent tag operations across resources:
    - GET to retrieve tags
    - PUT to update tags (replaces all existing tags)
  - Common response schemas:
    - Success: `#/components/responses/tagGetPut`
    - Errors:
      - 400: `#/components/responses/tag400Error`
      - 401: `#/components/responses/tag401Error`
      - 403: `#/components/responses/tag403Error`
      - 404: `#/components/responses/tag404Error`
      - 500: `#/components/responses/tag500Error`

### Common Parameters
- Workspace identification
  - `#/components/parameters/workspaceId`
  - `#/components/parameters/workspaceQuery`
  - `#/components/parameters/workspaceIdQuery`

- Pagination control
  - `#/components/parameters/cursor`
  - `#/components/parameters/limit`
  - `#/components/parameters/offset`

- Date range filtering
  - `#/components/parameters/since`
  - `#/components/parameters/until`

- Sorting and ordering
  - `#/components/parameters/direction`
  - Various sort parameters specific to resources

- API versioning
  - `#/components/parameters/v10Accept` header required for many endpoints
  - Version-specific error responses (e.g., `#/components/responses/v9Unsupported`)
