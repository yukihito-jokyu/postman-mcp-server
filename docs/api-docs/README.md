# Postman API Implementation Summary

This document outlines the prompts and processes used to implement the Postman API functionality within the MCP server tools.

## Table of Contents

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

**Using Cline 2.2.2**

### Utilizing MCP Server Tools

#### List Workspaces
```bash
Use Postman tools to list our workspaces.
```

```
Use postman tools to list environments in a workspace: 0ddc8458-12e6-48bf-8ff0-490ca0a8f775


```

### Improving MCP Server Tools

#### General Improvements
```bash
@/docs/api-docs/workspaces.md

Review the postman MCP tools workspace API access against the Postman API summary. Make corrections in our implementation.

```

#### Specific Improvements
```bash
@/docs/api-docs/environments.md

Review the postman MCP tools workspace API access against the Postman API summary. Make corrections in our implementation, paying particular attention to the request parameter naming and values.
```

### Expanding Postman API Summaries

#### Working on Individual Files

##### Add Responses
```bash
@/docs/postman-api-pathsonly.yaml

Peruse the postman OpenAPI 3 paths definition (note this is a very abrridged version of the full document, containing just the paths objects), this time to add the expected response references and associated http status (e.g. 200 '#/components/responses/getAccounts').

Continue updating the individual summary markdown document that we can use later on to cross-check against our tool implementations:
@/docs/api-docs/collections.md

Workthrough the markdown summary document, operating one endpoint at a time, updating its documentation based on the contents of the pathsonly file. Each request endpoint in the pathsonly OpenAPI 3 definition document should have a list of `responses:`. Those are the details we want to add to the summary markdown doc.

Also continue to add missing endpoints that you come across. The goal is to be "additive" and "augmentative" so that we continually add and correct details each time we review. Do not remove details or re-summarize existing content.

When completed this file, request the next summary document to continue with. Keep doing this until I say stop or you get bored.
```

##### Add Parameters
```bash
@/docs/postman-api-pathsonly.yaml

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
```bash
@/docs/postman-api-parameters.yaml

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
```bash
@/docs/postman-api-pathsonly.yaml

Peruse the postman OpenAPI 3 definition (note this is a very abrridged version of the full document, containing just the paths objects), this time to augment the POST/PUT requests with body content add parameter details by matching the parameter name (e.g. The workspaceQuery in '#/components/requestBodies/updateEnvironment').

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

##### Add Request Bodies
```bash
@/docs/postman-api-requestbodies.yaml

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
```bash
@docs/postman-api-summary.md

Let's split the single summary doc into multiple docs to help keep the size manageable. Create a new directory under docs/ and split the content at the `##` header level (e.g. "## Workspaces" is one document)
```

### Creating a Summary Document
```bash
@/docs/postman-api-index.yaml

Review the postman environment, collection API from the OpenAPI 3 definition. Make a summary document that we can use to cross-check against our tool implementations (This implementation covers the basic Postman API functionality in MCP)
```
