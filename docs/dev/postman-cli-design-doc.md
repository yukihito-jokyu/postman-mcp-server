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
│   │   └── cli/                # CLI operations
│   │       └── index.ts        # CLI tool implementations
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
        name: 'run_collection',
        description: 'Run a Postman collection locally or in CI/CD',
        inputSchema: {
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              description: 'Collection ID'
            },
            environment: {
              type: 'string',
              description: 'Optional environment ID'
            },
            apiKey: {
              type: 'string',
              description: 'Postman API key'
            },
            // Run configuration
            iterationCount: {
              type: 'number',
              description: 'Number of iterations to run'
            },
            folderIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific folder/request UIDs to run in order'
            },
            // CI/CD options
            ciProvider: {
              type: 'string',
              enum: ['github', 'gitlab', 'jenkins', 'azure', 'circleci'],
              description: 'CI/CD provider for configuration'
            },
            // Output options
            reporters: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['cli', 'json', 'junit', 'html']
              },
              description: 'Report formats to generate'
            },
            // Advanced options
            bail: {
              type: 'boolean',
              description: 'Stop on first test failure'
            },
            delayRequest: {
              type: 'number',
              description: 'Delay between requests in ms'
            },
            timeoutRequest: {
              type: 'number',
              description: 'Request timeout in ms'
            }
          },
          required: ['collection', 'apiKey']
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
            apiKey: {
              type: 'string',
              description: 'Postman API key'
            },
            failSeverity: {
              type: 'string',
              enum: ['HINT', 'INFO', 'WARN', 'ERROR'],
              description: 'Minimum severity to trigger failure'
            }
          },
          required: ['api', 'apiKey']
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

    // Authentication
    cliArgs.push('--api-key', args.apiKey);

    // Environment
    if (args.environment) {
      cliArgs.push('-e', args.environment);
    }

    // Run configuration
    if (args.iterationCount) {
      cliArgs.push('-n', args.iterationCount.toString());
    }

    // Specific folder/request order
    if (args.folderIds?.length) {
      args.folderIds.forEach(id => {
        cliArgs.push('-i', id);
      });
    }

    // Reporters
    if (args.reporters?.length) {
      cliArgs.push('--reporters', args.reporters.join(','));
    }

    // Advanced options
    if (args.bail) cliArgs.push('--bail');
    if (args.delayRequest) cliArgs.push('--delay-request', args.delayRequest.toString());
    if (args.timeoutRequest) cliArgs.push('--timeout-request', args.timeoutRequest.toString());

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
    this.toolHandlers.set('run_collection', this.cliTools);
    this.toolHandlers.set('api_lint', this.cliTools);
  }
}
```

## 6. Implementation Strategy

1. Phase 1: Core Collection Runner
   - Basic collection run functionality
   - Environment support
   - Authentication handling
   - Basic reporting

2. Phase 2: Advanced Collection Features
   - Folder/request ordering
   - Test data file support
   - Package integration
   - Advanced reporting options

3. Phase 3: CI/CD Integration
   - Provider-specific configurations
   - Environment variable handling
   - Pipeline integration examples

4. Phase 4: Testing & Documentation
   - Unit tests
   - Integration tests
   - Usage examples
   - CI/CD workflow examples

## 7. Key Features & Limitations

### Features
1. **Collection Running**
   - Local and CI/CD execution
   - Custom run order support
   - Multiple reporter formats
   - Environment integration

2. **Authentication**
   - API key based auth
   - Secure key handling
   - CI/CD variable support

3. **Reporting**
   - CLI output
   - JSON reports
   - JUnit reports
   - HTML reports

### Limitations
1. **Test Data Files**
   - Files must be uploaded to Postman
   - Local file references not supported

2. **OAuth 2.0**
   - Interactive auth flows not supported
   - Pre-configured tokens required

3. **Package Support**
   - Limited to Professional/Enterprise plans
   - Package Library integration required

## 8. Conclusion

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

The implementation provides a clean and efficient interface to Postman CLI capabilities while maintaining simplicity and reliability. Key improvements in this revision include:

1. Simplified authentication handling
2. Enhanced collection run options
3. Better CI/CD integration
4. Clearer limitations documentation
5. More detailed reporting configuration
