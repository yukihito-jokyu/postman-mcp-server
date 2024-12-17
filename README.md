# Postman MCP Server
**Version:** v0.1.0

An MCP server that provides seamless access to [Postman](https://www.postman.com/).

## Overview

Postman MCP Server is a TypeScript-based MCP server that integrates with Postman, providing comprehensive management of Postman collections, environments, and APIs.

## Features

### Collections
- **CRUD Operations**: Create, retrieve, update, and delete Postman collections.
- **Folder Management**: Organize requests into folders within collections.
- **Request Management**: Add, update, and delete requests within collections.
- **Response Management**: Manage responses associated with requests.
- **Version Control**: Fork, merge, and pull changes for collections.
- **Comments**: Add and manage comments on collections.

### Environments
- **Manage Environments**: Create and retrieve environments for different setups.
- **CRUD Operations**: Full support for creating, updating, and deleting environments.

### APIs
- **API Management**: Create, retrieve, update, and delete APIs.
- **Schema Support**: Manage API schemas with multi-file support.
- **Tagging**: Add and manage tags for APIs.
- **Comments**: Add and manage comments on APIs.

### Authentication & Authorization
- **API Key Authentication**: Secure access using API keys.
- **Role-Based Access Control**: Manage permissions at workspace and collection levels.
- **Workspace Permissions**: Define permissions specific to workspaces.

### Additional Features
- **Private API Network**: Manage elements and folders within a private API network.
- **Webhooks**: Create webhooks to trigger collections with custom payloads.
- **Enterprise Features**: Advanced role controls and SCIM support for enterprise environments.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed.

### Steps

1. **Clone the repository:**
    ```bash
    git clone https://github.com/delano/postman-api-server.git
    cd postman-api-server
    ```

2. **Install dependencies:**
    ```bash
    pnpm install
    ```

3. **Build the server:**
    ```bash
    pnpm run build
    ```

4. **Run in development mode with auto-rebuild:**
    ```bash
    pnpm run watch
    ```

### Configuration with Claude Desktop

To use with Claude Desktop, add the server config:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

Example configuration:
```json
{
  "mcpServers": {
    "postman-api-server": {
      "command": "/path/to/postman-api-server/build/index.js"
    }
  }
}
```

## Documentation

API documentation is available in the [Postman Public Workspace](https://www.postman.com/postman/postman-public-workspace/).

See

postman-api-index.yaml

 for a local copy of the OpenAPI definition.

## Development

Install dependencies:
```bash
pnpm install
```

Build the server:
```bash
pnpm run build
```

For development with auto-rebuild:
```bash
pnpm run watch
```

## Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), available as a package script:

```bash
pnpm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## Other MCP Servers

- [Awesome MCP Servers by AppCypher](https://github.com/appcypher/awesome-mcp-servers)
- [Awesome MCP Servers by PunkPeye](https://github.com/punkpeye/awesome-mcp-servers)
