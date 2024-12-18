# Postman API Implementation Summary

This document outlines the prompts and processes used to implement the Postman API functionality within the MCP server tools.

## Summary documents

Each of the following documents contains a summary of the Postman API functionality that is used to cross-check against the MCP server tools implementation.

1. [Workspaces](workspaces.md)
2. [Collections](collections.md)
3. [Environments](environments.md)
4. [APIs](apis.md)
5. [Mocks](mocks.md)
6. [Monitors](monitors.md)
7. [Security Features](security-features.md)
8. [Additional Features](additional-features.md)
9. [Authentication & Authorization](auth.md)
10. [Common Features](common-features.md)
11. [Notes](notes.md)

## Prompts

**Using Cline 2.2.2 and Continue 0.9.246**

### Utilizing MCP Server Tools

#### List Workspaces
```prompt
Use Postman tools to list our workspaces.
```

```
Use postman tools to list environments in a workspace: 0ddc8458-12e6-48bf-8ff0-490ca0a8f775


```

### Improving MCP Server Tools

#### General Improvements
```prompt
@/docs/api-docs/workspaces.md

Review the postman MCP tools workspace API access against the Postman API summary. Make corrections in our implementation.

```

#### Specific Improvements

##### Workspaces
```prompt
@/docs/api-docs/environments.md

Review the postman MCP tools workspace API access against the Postman API summary. Make corrections in our implementation, paying particular attention to the request parameter naming and values.
```

##### Environments
```prompt
@/docs/api-docs/wokspaces.md
@/docs/api-docs/environments.md

Review the postman workspaces and environment docs. Understand the details and nuance around contstructuing environment identifier and using it appropriately when querying. Modify out MCP tools implementation accordingly.

@src/index.ts
@src/api/workspaces.ts
@src/api/environments.ts
```

```prompt
@/docs/api-docs/environments.md
@/docs/reference/postman-api-requestBodies.yaml

Review the postman environment md docs and yaml definitions. Understand the details and nuance of request bodies for POST/PUT requests. Modify out MCP tools implementation accordingly, including inline jsdocs.


@src/api/environments.ts
@src/types.ts


We may also need to update the MCP protocol endpoints to reflect the changes. IOW, updating our code that communicates with the Postman API is one part but we also may need to update the MCP protocol code that communicates with the MCP clients.

```

```prompt
@/docs/api-docs/collections.md
@/docs/reference/postman-api-parameters.yaml
@/docs/reference/postman-api-responsesonly.yaml
@/docs/reference/postman-api-requestBodies.yaml

Review the postman collection md docs and yaml definitions. Understand the details and nuance of request bodies for POST/PUT/PATCH requests. Modify out MCP tools implementation accordingly, including inline jsdocs.


@src/api/collections.ts
@src/types.ts


Refer to @/docs/dev/updating-request-bodies.md for what areas of the code need to be updated.
```

```prompt
@/docs/api-docs/collections.md
@/docs/reference/postman-api-parameters.yaml
@/docs/reference/postman-api-responsesonly.yaml
@/docs/reference/postman-api-requestBodies.yaml

Review the postman collection md docs and yaml definitions. Understand the details and nuance of requests and responses for GET/HEAD/OPTION/DELETE requests. Modify out MCP tools implementation accordingly, including inline jsdocs.


@src/api/collections.ts
@src/types.ts


Refer to @/docs/dev/updating-request-bodies.md for what areas of the code need to be updated.
```


##### MCP Protocol

```prompt

Revise the MCP protocol implementation to ensure the "List Resources", "List Prompts" endpoints are functionality fully and correctly.

@src/index.ts

```

### Improving codebase

#### Reduce duplication and emphasize concise files

More concise and focused files are easier to work with the models.

```prompt
@/src/index.ts

Review the main code entrypoint src/index.ts to devise a strategy to reduce duplication and manage complexity as functionality is added.


For example:
1)  `setupToolHandlers` currently defines the superset of all tool handlers which means it's length is unmitigated. Each tool should be responsible for defining its own handlers.

2) PostmanAPIServer should be defined in its own file and imported into the main index.ts file.

3) setupHandlers should be refactored similarly to setupToolHandlers.

4) Repetative function definitions should be refactored into at most one additional layer of abstraction.

```

```prompt
@/src/server.ts

Review the main server src/server.ts to continue reducing duplication and managing complexity as functionality is added.

`this.server.setRequestHandler(CallToolRequestSchema, async (request) => {...` can be update to implement like `ListToolsRequestSchema`.
```


### Improving Documentation

#### Linking to Postman API References
```prompt

Update this docs/references README.md file with a summary and links for each of:

Workspaces
Collections
Environments and variables
APIs
Mock servers
Monitors
Comments
Forks
Pull requests
User and usage data
Users and user groups
Roles
Billing

Add both the relevant `https://www.postman.com/postman/postman-public-workspace/` and  `https://learning.postman.com/docs` links to each of the above sections.
```

#### Adding Authentication Details

```prompt
@URL:https://learning.postman.com/docs/developer/postman-api/authentication/

Based on the content of the postman doc linked, add a new section with concise but complete details including relevant links (`learning.postman.com`, `go.postman.com`, `www.postman.com` pages) to this readme.md
```

#### Reviewing and Updating Documentation

```prompt
Proofread and tidy this markdown readme to a professional standard. Do not make up new content to add; and do not omit existing content, except where redundant and or unclear.
```


### Expanding Postman API Summaries

#### Working on Individual Files

##### Add Responses
```prompt
@/docs/reference/postman-api-pathsonly.yaml

Peruse the postman OpenAPI 3 paths definition (note this is a very abrridged version of the full document, containing just the paths objects), this time to add the expected response references and associated http status (e.g. 200 '#/components/responses/getAccounts').

Continue updating the individual summary markdown document that we can use later on to cross-check against our tool implementations:
@/docs/api-docs/collections.md

Workthrough the markdown summary document, operating one endpoint at a time, updating its documentation based on the contents of the pathsonly file. Each request endpoint in the pathsonly OpenAPI 3 definition document should have a list of `responses:`. Those are the details we want to add to the summary markdown doc.

Also continue to add missing endpoints that you come across. The goal is to be "additive" and "augmentative" so that we continually add and correct details each time we review. Do not remove details or re-summarize existing content.

When completed this file, request the next summary document to continue with. Keep doing this until I say stop or you get bored.
```

##### Add Parameters
```prompt
@/docs/reference/postman-api-pathsonly.yaml

Peruse the postman OpenAPI 3 paths definition (note this is a very abrridged version of the full document, containing just the paths objects), this time to add the expected parameters references and associated http status (e.g. '#/components/parameters/workspaceQuery').

Continue updating the individual summary markdown document that we can use later on to cross-check against our tool implementations:
@/docs/api-docs/environments.md
@/docs/api-docs/workspaces.md
@/docs/api-docs/collections.md
@/docs/api-docs/apis.md
@/docs/api-docs/mocks.md
@/docs/api-docs/monitors.md
@/docs/api-docs/security-features.md
@/docs/api-docs/additional-features.md
@/docs/api-docs/auth.md
@/docs/api-docs/common-features.md
@/docs/api-docs/notes.md

Workthrough the markdown summary document, operating one endpoint at a time, updating its documentation based on the contents of the definition file. Each request endpoint in the pathsonly OpenAPI 3 definition document should have a list of `parameters:`. Those are the details we want to add to the summary markdown doc.

Also continue to add missing endpoints that you come across. The goal is to be "additive" and "augmentative" so that we continually add and correct details each time we review. Do not remove details or re-summarize existing content.

When completed this file, request the next summary document to continue with. Keep doing this until I say stop or you get bored.
```

##### Add Parameter Details
```prompt
@/docs/reference/postman-api-parameters.yaml

Peruse the postman OpenAPI 3 definition (note this is a very abrridged version of the full document, containing just the parameters objects), this time to add parameter details by matching the parameter name (e.g. The workspaceQuery in '#/components/parameters/workspaceQuery').

Continue updating the individual summary markdown document that we can use later on to cross-check against our tool implementations:
@/docs/api-docs/environments.md
@/docs/api-docs/workspaces.md
@/docs/api-docs/collections.md
@/docs/api-docs/apis.md
@/docs/api-docs/mocks.md
@/docs/api-docs/monitors.md
@/docs/api-docs/security-features.md
@/docs/api-docs/additional-features.md
@/docs/api-docs/auth.md
@/docs/api-docs/common-features.md
@/docs/api-docs/notes.md

Workthrough the markdown summary document, operating one endpoint at a time, updating its documentation based on the contents of the definition file.

NOTE: The goal is to be "additive" and "augmentative" so that we continually add and correct details each time we review. Do not remove details or re-summarize existing content.

When completed this file, request the next summary document to continue with. Keep doing this until I say stop or you get bored.
```

##### Add Request Bodies (Paths Only)
```prompt
@/docs/reference/postman-api-pathsonly.yaml

Peruse the postman OpenAPI 3 definition (note this is a very abrridged version of the full document, containing just the paths objects), this time to augment the POST/PUT requests with body content add parameter details by matching the parameter name (e.g. The updateEnvironment in '#/components/requestBodies/updateEnvironment').

Continue updating the individual summary markdown document that we can use later on to cross-check against our tool implementations:
@/docs/api-docs/environments.md
@/docs/api-docs/workspaces.md
@/docs/api-docs/collections.md
@/docs/api-docs/apis.md
@/docs/api-docs/mocks.md
@/docs/api-docs/monitors.md
@/docs/api-docs/security-features.md
@/docs/api-docs/additional-features.md
@/docs/api-docs/auth.md
@/docs/api-docs/common-features.md
@/docs/api-docs/notes.md

Workthrough the markdown summary document, operating one endpoint at a time, updating its documentation based on the contents of the definition file. Each POST/PUT/etc request endpoint in the pathsonly OpenAPI 3 definition document should have at least one `requestBody:`. Those are the details we want to add to the summary markdown doc.

Also continue to add missing endpoints that you come across. The goal is to be "additive" and "augmentative" so that we continually add and correct details each time we review. Do not remove details or re-summarize existing content.

When completed this file, request the next summary document to continue with. Keep doing this until I say stop or you get bored.
```

##### Review for missing endpoints

```prompt
@/docs/reference/postman-api-pathsonly.yaml

Peruse the postman OpenAPI 3 paths definition (note this is a very abrridged version of the full document, containing just the paths objects). Compare to @/docs/api-docs/ .md files for missing endpoints. Add missing endpoints to the summary markdown files.
```

##### Add Request Bodies
```prompt
@/docs/reference/postman-api-requestbodies.yaml

Review the abridged Postman OpenAPI 3 definition (containing only the requestBody objects) to augment POST/PUT requests with body content by matching request body names (e.g., `updateEnvironment` in '#/components/requestBodies/updateEnvironment').

Update the corresponding summary markdown documents:
- @/docs/api-docs/environments.md
- @/docs/api-docs/workspaces.md
- @/docs/api-docs/collections.md
- @/docs/api-docs/apis.md
- @/docs/api-docs/mocks.md
- @/docs/api-docs/monitors.md
- @/docs/api-docs/security-features.md
- @/docs/api-docs/additional-features.md
- @/docs/api-docs/auth.md
- @/docs/api-docs/common-features.md
- @/docs/api-docs/notes.md

For each POST/PUT request endpoint, add `requestBody:` details to the summary markdown based on the definition file.

Continue adding missing endpoints to ensure comprehensive documentation. Maintain an additive and augmentative approach without removing existing content.

Upon completion, request the next summary document to continue. Repeat until instructed to stop.
```

### Splitting a Single Summary File into Multiple Files
```prompt
@docs/postman-api-summary.md

Let's split the single summary doc into multiple docs to help keep the size manageable. Create a new directory under docs/ and split the content at the `##` header level (e.g. "## Workspaces" is one document)
```

### Creating a Summary Document
```prompt
@/docs/reference/postman-api-index.yaml

Review the postman environment, collection API from the OpenAPI 3 definition. Make a summary document that we can use to cross-check against our tool implementations (This implementation covers the basic Postman API functionality in MCP)
```
