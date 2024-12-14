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
