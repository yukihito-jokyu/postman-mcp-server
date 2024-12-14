# postman-api-server MCP Server

An MCP server for Postman API

This is a TypeScript-based MCP server that implements a simple notes system. It demonstrates core MCP concepts by providing:

- Resources representing text notes with URIs and metadata
- Tools for creating new notes
- Prompts for generating summaries of notes

## Features

### Resources
- List and access notes via `note://` URIs
- Each note has a title, content and metadata
- Plain text mime type for simple content access

### Tools
- `create_note` - Create new text notes
  - Takes title and content as required parameters
  - Stores note in server state

### Prompts
- `summarize_notes` - Generate a summary of all stored notes
  - Includes all note contents as embedded resources
  - Returns structured prompt for LLM summarization

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "postman-api-server": {
      "command": "/path/to/postman-api-server/build/index.js"
    }
  }
}
```

### Documentation

The API documentation is available in the Postman public workspace:
https://www.postman.com/postman/postman-public-workspace/api/72a32ca3-f06a-4e83-a933-2821a0e6616f/definition/024624cf-e622-4836-9d19-efd067f6cbdb/file/024624cf-e622-4836-9d19-efd067f6cbdb?version=67667e0a-44fd-4746-b7a9-6c3980a7d9de&ctx=documentation

See also docs/postman-api-index.yaml for a local copy of the OpenAPI definition.


### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## Other MCP Servers

https://github.com/appcypher/awesome-mcp-servers
https://github.com/punkpeye/awesome-mcp-servers
