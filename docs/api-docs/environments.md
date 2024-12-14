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
