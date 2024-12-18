# Postman API & CLI MCP Server Design Document

## 1. Overview

This document outlines the design for integrating Postman CLI capabilities into the existing Postman API MCP server. The design focuses on providing a simple and efficient interface to the official Postman CLI tool while leveraging the existing API infrastructure.

## 2. System Architecture

### 2.1 Core Components

```
postman-api-server/
├── src/
│   ├── index.ts                # Entry point
│   ├── server.ts               # Main server implementation
│   ├── types.ts                # Shared type definitions
│   ├── tools/                  # API operation tools
│   │   ├── api/                # API-specific operations
│   │   │   ├── collections.ts  # Collection operations
│   │   │   ├── environments.ts # Environment operations
│   │   │   ├── users.ts        # User management
│   │   │   └── workspaces.ts   # Workspace operations
│   │   └── cli/               # CLI operations
│   │       └── index.ts       # CLI tool implementations
```

### 2.2 Key Design Decisions

1. **Direct CLI Integration**
   - Maps directly to official Postman CLI commands
   - Uses native CLI functionality for core operations
   - Leverages built-in reporting capabilities

2. **Pattern Usage**
   - Tool Handler Pattern for consistent interface
   - Command Pattern for CLI operations
   - Error Handler Pattern for consistent error management

3. **Simplicity First**
   - Minimal custom logic
   - Direct command mapping
   - Native CLI behavior preservation

## 3. Core Functionality

### 3.1 CLI Tools

The CLI tools provide direct access to core Postman CLI capabilities:

```typescript
class PostmanCLITools implements ToolHandler {
  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'cli_login',
        description: 'Sign in to Postman CLI using an API key',
        inputSchema: {
          type: 'object',
          properties: {
            apiKey: {
              type: 'string',
              description: 'Postman API key'
            }
          },
          required: ['apiKey']
        }
      },
      {
        name: 'cli_logout',
        description: 'Sign out from Postman CLI',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'run_collection',
        description: 'Run a Postman collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              description: 'Collection ID or file path'
            },
            environment: {
              type: 'string',
              description: 'Environment ID or file path'
            },
            folder: {
              type: 'string',
              description: 'Specific folder to run'
            },
            iterationCount: {
              type: 'number',
              description: 'Number of iterations'
            },
            delayRequest: {
              type: 'number',
              description: 'Delay between requests (ms)'
            },
            timeoutRequest: {
              type: 'number',
              description: 'Request timeout (ms)'
            },
            reporters: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['cli', 'json', 'junit', 'html']
              },
              description: 'Report formats to generate'
            },
            bail: {
              type: 'boolean',
              description: 'Stop on first error'
            },
            workingDir: {
              type: 'string',
              description: 'Working directory for file paths'
            }
          },
          required: ['collection']
        }
      },
      {
        name: 'api_lint',
        description: 'Run API governance checks (Enterprise only)',
        inputSchema: {
          type: 'object',
          properties: {
            api: {
              type: 'string',
              description: 'API ID or definition file'
            },
            failSeverity: {
              type: 'string',
              enum: ['HINT', 'INFO', 'WARN', 'ERROR'],
              description: 'Minimum severity to trigger failure'
            }
          },
          required: ['api']
        }
      },
      {
        name: 'publish_api',
        description: 'Publish an API version',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID'
            },
            name: {
              type: 'string',
              description: 'Version name'
            },
            releaseNotes: {
              type: 'string',
              description: 'Release notes (supports Markdown)'
            },
            collections: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Collection IDs or paths to include'
            },
            apiDefinition: {
              type: 'string',
              description: 'API definition ID, directory, or file'
            }
          },
          required: ['apiId', 'name']
        }
      }
    ];
  }
}
```

### 3.2 Command Execution

```typescript
class PostmanCLITools {
  private async executeCommand(command: string, args: string[]): Promise<string> {
    // Implementation using child_process
    // Handles command execution and output capture
    // Returns formatted result or throws error
  }

  private async runCollection(args: any): Promise<ToolCallResponse> {
    const cliArgs = ['collection', 'run'];

    // Build command arguments from tool parameters
    cliArgs.push(args.collection);
    if (args.environment) cliArgs.push('-e', args.environment);
    if (args.folder) cliArgs.push('-i', args.folder);
    if (args.iterationCount) cliArgs.push('-n', args.iterationCount.toString());
    if (args.delayRequest) cliArgs.push('--delay-request', args.delayRequest.toString());
    if (args.timeoutRequest) cliArgs.push('--timeout-request', args.timeoutRequest.toString());
    if (args.reporters?.length) cliArgs.push('--reporters', args.reporters.join(','));
    if (args.bail) cliArgs.push('--bail');
    if (args.workingDir) cliArgs.push('--working-dir', args.workingDir);

    try {
      const result = await this.executeCommand('postman', cliArgs);
      return {
        content: [{
          type: 'text',
          text: result
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Collection run failed: ${error.message}`
        }],
        isError: true
      };
    }
  }
}
```

## 4. Error Handling

```typescript
class PostmanCLITools {
  private handleError(error: unknown): ToolCallResponse {
    // Standard error response format
    return {
      content: [{
        type: 'text',
        text: error instanceof Error ? error.message : 'Unknown error occurred'
      }],
      isError: true
    };
  }
}
```

## 5. Server Integration

```typescript
class PostmanAPIServer {
  constructor() {
    // Initialize CLI tools
    this.cliTools = new PostmanCLITools();

    // Add CLI tool definitions
    this.toolDefinitions = [
      ...this.workspaceTools.getToolDefinitions(),
      ...this.environmentTools.getToolDefinitions(),
      ...this.collectionTools.getToolDefinitions(),
      ...this.userTools.getToolDefinitions(),
      ...this.cliTools.getToolDefinitions()
    ];

    // Register CLI tool handlers
    this.toolHandlers.set('cli_login', this.cliTools);
    this.toolHandlers.set('cli_logout', this.cliTools);
    this.toolHandlers.set('run_collection', this.cliTools);
    this.toolHandlers.set('api_lint', this.cliTools);
    this.toolHandlers.set('publish_api', this.cliTools);
  }
}
```

## 6. Implementation Strategy

1. Phase 1: Core CLI Integration
   - Implement CLI tool handler
   - Add authentication commands
   - Basic command execution infrastructure
   - Error handling setup

2. Phase 2: Collection Runner
   - Collection run command
   - Environment support
   - Report generation
   - Working directory handling

3. Phase 3: API Operations
   - API governance checks
   - Version publishing
   - Git integration support

4. Phase 4: Testing & Documentation
   - Unit tests for command handling
   - Integration tests with CLI
   - Usage documentation
   - Example workflows

## 7. Conclusion

This design provides a streamlined implementation of Postman CLI functionality through the MCP server, with focus on:

1. **Simplicity**
   - Direct CLI command mapping
   - Minimal custom logic
   - Clear interfaces

2. **Reliability**
   - Native CLI functionality
   - Built-in reporting
   - Standard error handling

3. **Usability**
   - Familiar command structure
   - Consistent interface
   - Clear documentation

4. **Maintainability**
   - Simple architecture
   - Easy to update
   - Well-defined boundaries

The implementation provides a clean and efficient interface to Postman CLI capabilities while maintaining simplicity and reliability.
