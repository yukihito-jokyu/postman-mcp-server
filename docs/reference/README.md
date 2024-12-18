# Postman API Reference
The YAML files in this directory are derived directly from the Postman API OpenAPI 3 specification. The files are organized by major section in the YAML document and are named according to the section they represent. We do this to make it easier to find the relevant information when working with Claude and AI tools.

NOTE: The `#/` references herein can be found in the relevant reference files of the same (or very similar) name. For example, `collectionId` can be found in docs/reference/postman-api-parameters. The `mergeEnvironmentFork` request and response objects can be found in docs/reference/postman-api-requestBodies.yaml and docs/reference/postman-api-responsesonly.yaml, respectively. Also docs/reference/postman-api-schemasonly.yaml contains the schemas for the request and response objects.

[Postman API - Docs](https://learning.postman.com/docs/developer/postman-api/intro-api/)

## Getting Started
Make your first API call by following these steps:

### Prerequisites
1. Access the [Postman API collection](https://www.postman.com/postman/postman-public-workspace/collection/i2uqzpp/postman-api?ctx=documentation)
2. Generate an API key at [Postman account settings](https://go.postman.co/settings/me/api-keys)
3. Store your API key securely:
   - Use [Postman Vault](https://learning.postman.com/docs/sending-requests/postman-vault/postman-vault-secrets/) for personal use
   - Use [environment variables](https://learning.postman.com/docs/sending-requests/variables/environment-variables/) (secret type) for team sharing

### Quick Start
1. Fork the Postman API collection to your workspace
2. Navigate to the User folder and locate the `/me` endpoint
3. Set your stored API key in the request headers
4. Send the request to verify authentication

Detailed guide: [Making your first Postman API call](https://learning.postman.com/docs/developer/postman-api/make-postman-api-call/)

## Authentication
The Postman API uses API key authentication for all requests.

### API Keys
- Generate API keys in your [Postman account settings](https://go.postman.co/settings/me/api-keys)
- Include the API key in the `X-API-Key` header for all API requests
- API keys provide access to all Postman resources you have permissions for
- Store API keys as `postman-api-key` variables to use automatically with the [Postman API collection](https://www.postman.com/postman/postman-public-workspace/documentation/i2uqzpp/postman-api)

### Collection Access Keys
- Generate collection-specific read-only access keys when sharing collections via API
- Manage collection access keys in the [API keys page](https://go.postman.co/settings/me/api-keys) under "Collection access keys"
- Each key grants access to a single collection only
- Keys can be revoked at any time

For detailed authentication documentation, see [Postman API Authentication](https://learning.postman.com/docs/developer/postman-api/authentication/).

## API Sections

### Workspaces
Manage Postman workspaces including creating temporary test workspaces and backing up workspace resources. Useful for workspace automation and management.
- API Reference: https://www.postman.com/postman/postman-public-workspace/folder/wppke9j/workspaces
- Documentation: https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/create-workspaces/

### Collections
Manage Postman Collections with operations like adding, deleting, updating collections and their contents. Includes collection fork/PR management and OpenAPI import/export capabilities.
- API Reference: https://www.postman.com/postman/postman-public-workspace/folder/b7pojjp/collections
- Documentation: https://learning.postman.com/docs/collections/collections-overview/

### Environments and variables
Programmatically manage Postman environments and variables (global and collection-level) to handle different deployment contexts.
- API Reference: https://www.postman.com/postman/postman-public-workspace/folder/t1fblas/environments
- Documentation: https://learning.postman.com/docs/sending-requests/variables/managing-environments/

### APIs
Manage APIs and integrate with CI/CD systems. Features include updating API definitions, version management, and collection synchronization.
- API Reference: https://www.postman.com/postman/postman-public-workspace/folder/j34rt1l/api
- Documentation: https://learning.postman.com/docs/designing-and-developing-your-api/creating-an-api/

### Mock servers
Create and manage mock servers with capabilities for public/private settings, call logging, and error response management.
- API Reference: https://www.postman.com/postman/postman-public-workspace/folder/zueaxnn/mocks
- Documentation: https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/

### Monitors
Run collections programmatically based on CI/CD events and manage webhooks for collection execution.
- API Reference: https://www.postman.com/postman/postman-public-workspace/folder/uu45lzt/monitors
- Documentation: https://learning.postman.com/docs/monitoring-your-api/intro-monitors/

### Comments
Manage comments across APIs, collections, folders, requests, and responses to facilitate team collaboration.
- API Reference: https://www.postman.com/postman/postman-public-workspace/folder/kyjatxe/comments
- Documentation: https://learning.postman.com/docs/collaborating-in-postman/comments/

### Forks
Create and manage forks of collections and environments, including fork creation, merging, and status checking.
- API Reference: https://www.postman.com/postman/postman-public-workspace/folder/yrtfwkg/forks
- Documentation: https://learning.postman.com/docs/collaborating-in-postman/using-version-control/forking-elements/

### Pull requests
Handle pull requests for collections including creation, updates, and status management for review processes.
- API Reference: https://www.postman.com/postman/postman-public-workspace/request/9wzo1v1/create-a-pull-request
- Documentation: https://learning.postman.com/docs/collaborating-in-postman/using-version-control/creating-pull-requests/

### User and usage data
Access authenticated user information and account usage details including API request limits.
- API Reference: https://www.postman.com/postman/postman-public-workspace/request/ay0ymqy/get-authenticated-user

### Users and user groups
Manage team users and groups with capabilities to retrieve team member information and group details.
- API Reference: https://www.postman.com/postman/postman-public-workspace/folder/gpu5rwc/users
- Documentation: https://learning.postman.com/docs/administration/managing-your-team/managing-your-team/

### Roles
Define and manage user permissions for workspaces, collections, and other Postman elements.
- API Reference: https://www.postman.com/postman/postman-public-workspace/folder/c5hrwtj/roles
- Documentation: https://learning.postman.com/docs/collaborating-in-postman/roles-and-permissions/

### Billing
Access billing account information and integrate with internal systems like SAP.
- API Reference: https://www.postman.com/postman/postman-public-workspace/folder/7iix2ud/billing

### Rate Limits
Manage API access with per-user rate limits of 300 requests per minute. Monitor usage through response headers and monthly allowances.
- API Reference: https://www.postman.com/postman/postman-public-workspace/collection/i2uqzpp/postman-api
- Documentation: https://learning.postman.com/docs/developer/postman-api/postman-api-rate-limits/
- Usage monitoring: https://go.postman.co/billing/add-ons/overview

Rate limit information is available through response headers:
- Current window limits via `RateLimit` and `X-RateLimit-*` headers
- Monthly usage via `RateLimit-Limit-Month` and `RateLimit-Remaining-Month`
- Retry timing via `RetryAfter` when limits are exceeded

For detailed plan limits and pricing, see:
- Plan comparison: https://www.postman.com/pricing/
- Resource usage docs: https://learning.postman.com/docs/billing/resource-usage/#postman-api-usage
