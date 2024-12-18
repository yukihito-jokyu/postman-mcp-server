# Postman MCP Server
**Version:** v0.2.0

An MCP server that provides seamless access to [Postman](https://www.postman.com/). Functionality is based on the OpenAPI specification. For more information, see the [Postman API documentation](https://www.postman.com/postman-public-workspace/).

This project is part of the Model Context Protocol (MCP) initiative. For more information, visit the [MCP GitHub repository]([https://github.com/mcp-project/mcp](https://github.com/modelcontextprotocol)).



> [!WARNING]
> This project is currently under active development. Please use with caution and expect breaking changes.

> [!NOTE]
> AI Generated Code. I used Cline v2.2.2 with Claude 3.5 Sonnet (2024-10-22). See docs/README.md for prompts and details about how this code was generated.

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

> [!IMPORTANT]
> If you're updating this provider, Claude must be restarted to pick up API changes from the input schema (i.e. When the MCP server's ToolDefinition elements have changed). This is because Claude caches the tool definitions when it starts up.
>
> To restart Claude:
> 1. Close the Claude application completely
> 2. Relaunch Claude
> 3. Claude will reload with the updated tool definitions from the MCP server

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


## Rationale

The MCP wrapper for Postman tools makes sense primarily as an AI interaction layer for complex, multi-step operations where structure and safety are paramount. However, it may be overengineered for simple operations where direct CLI or API usage would suffice. The MCP wrapper provides most value when:

1. **Complex Operations**
- Managing multiple collections
- Coordinating environments
- Generating comprehensive reports

2. **AI-Driven Automation**
- Automated testing workflows
- API documentation maintenance
- Environment management

3. **Error-Sensitive Operations**
- Critical API testing
- Production deployments
- Compliance checking

It provides less value for:

1. **Simple Operations**
- Basic collection runs
- Single API calls
- Quick environment checks
2. **Direct CLI Usage**
- Developer-driven operations
- Local testing
- Quick iterations


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

The Inspector will provide a URL to access debugging tools in your browser: http://localhost:5173. You will need to add the POSTMAN_API_KEY before connecting. Navigate to "Tools" to get started.

## Other MCP Servers

- [Awesome MCP Servers by AppCypher](https://github.com/appcypher/awesome-mcp-servers)
- [Awesome MCP Servers by PunkPeye](https://github.com/punkpeye/awesome-mcp-servers)
