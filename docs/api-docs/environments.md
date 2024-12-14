## Environments

### Implemented Operations
- Get all environments (`GET /environments`)
  - Query Parameters:
    - workspace (`#/components/parameters/workspaceQuery`)
  - Responses:
    - 200: `#/components/responses/getEnvironments`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/instanceNotFoundEnvironment`
    - 500: `#/components/responses/common500ErrorServerError`

- Get a specific environment (`GET /environments/{environmentId}`)
  - Parameters:
    - environmentId (`#/components/parameters/environmentId`)
  - Responses:
    - 200: `#/components/responses/getEnvironment`
    - 400: `#/components/responses/instanceNotFoundEnvironment`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Create environment (`POST /environments`)
  - Note: Creates in "My Workspace" if workspace not specified
  - Parameters:
    - workspaceQuery (`#/components/parameters/workspaceQuery`)
  - Responses:
    - 200: `#/components/responses/createEnvironment`
    - 400: `#/components/responses/environments400ErrorMalformedRequest`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Update environment (`PUT /environments/{environmentId}`)
  - Parameters:
    - environmentId (`#/components/parameters/environmentId`)
  - Responses:
    - 200: `#/components/responses/updateEnvironment`
    - 400: `#/components/responses/environments400ErrorMalformedRequest`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Delete environment (`DELETE /environments/{environmentId}`)
  - Parameters:
    - environmentId (`#/components/parameters/environmentId`)
  - Responses:
    - 200: `#/components/responses/deleteEnvironment`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/instanceNotFoundEnvironment`
    - 500: `#/components/responses/common500ErrorServerError`

#### Environment Version Control
- Create environment fork (`POST /environments/{environmentId}/forks`)
  - Parameters:
    - environmentUid (`#/components/parameters/environmentUid`)
    - workspaceIdQueryTrue (`#/components/parameters/workspaceIdQueryTrue`)
  - Responses:
    - 200: `#/components/responses/forkEnvironment`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/environmentForks404Error`
    - 500: `#/components/responses/common500Error`

- Get environment forks (`GET /environments/{environmentId}/forks`)
  - Parameters:
    - environmentUid (`#/components/parameters/environmentUid`)
    - cursor (`#/components/parameters/cursor`)
    - directionQuery (`#/components/parameters/directionQuery`)
    - limit (`#/components/parameters/limit`)
    - sortByCreatedAt (`#/components/parameters/sortByCreatedAt`)
  - Responses:
    - 200: `#/components/responses/getEnvironmentForks`
    - 400: `#/components/responses/environmentForks400Error`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/environmentForks404Error`
    - 500: `#/components/responses/common500Error`

- Merge environment fork (`POST /environments/{environmentId}/merges`)
  - Description: Merges a forked environment back into its parent environment
  - Parameters:
    - environmentUid (`#/components/parameters/environmentUid`)
  - Responses:
    - 200: `#/components/responses/mergeEnvironmentFork`
    - 400: `#/components/responses/environmentForks400Error`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/environmentForks404Error`
    - 500: `#/components/responses/common500Error`

- Pull environment changes (`POST /environments/{environmentId}/pulls`)
  - Description: Pulls changes from parent (source) environment into forked environment
  - Parameters:
    - environmentUid (`#/components/parameters/environmentUid`)
  - Responses:
    - 200: `#/components/responses/pullEnvironment`
    - 400: `#/components/responses/environmentForks400Error`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/environmentForks404Error`
    - 500: `#/components/responses/common500Error`

### Key Features
- Environment CRUD operations
- Environment variable management
- Support for secret and default variable types
- Basic environment metadata management
- Version control features (fork, merge, pull)
- Workspace scoping
