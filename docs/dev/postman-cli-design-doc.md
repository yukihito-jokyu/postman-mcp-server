# Postman API & CLI MCP Server Design Document

## 1. Overview

This document outlines the design for integrating Postman CLI capabilities into the existing Postman API MCP server. The design leverages the existing API infrastructure while adding CLI-specific functionality to enable automated collection runs, API governance checks, and authentication management.

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
│   │   │   ├── environments.ts # Environments & variables
│   │   │   ├── users.ts        # Auth & user management
│   │   │   └── workspaces.ts   # Workspace operations
│   │   └── cli/               # CLI operations
│   │       ├── runner.ts      # Collection runner functionality
│   │       ├── governance.ts  # API governance checks
│   │       ├── auth.ts        # CLI authentication
│   │       └── sync.ts        # Cloud result syncing
│   └── reporting/             # Test run reporting
       ├── formatters/         # Report formatters
       │   ├── cli.ts         # CLI output formatter
       │   ├── json.ts        # JSON report formatter
       │   └── junit.ts       # JUnit XML formatter
       └── manager.ts         # Report generation manager
```

### 2.2 Key Design Decisions

1. **Separation of Concerns**
   - API operations remain isolated in `tools/api/`
   - CLI-specific logic contained in `tools/cli/`
   - Cloud sync and reporting separated for clarity

2. **Pattern Usage**
   - Strategy Pattern for report formats
   - Singleton Pattern for CLI auth management
   - Factory Pattern for report formatter creation
   - Observer Pattern for API rate tracking

3. **Extensibility**
   - New CLI commands can be added without modifying API tools
   - Additional report formats via new formatters
   - Configurable governance rules
   - Pluggable cloud sync strategies

### 2.3 Component Relationships

```mermaid
graph TD
    A[PostmanAPIServer] --> B[API Tools]
    A --> C[CLI Operations]
    A --> D[Report Manager]

    B --> E[Collections]
    B --> F[Environments]
    B --> G[Users]
    B --> H[Workspaces]

    C --> I[Collection Runner]
    C --> J[API Governance]
    C --> K[Auth Manager]
    C --> L[Cloud Sync]

    I --> D
    J --> D
    D --> M[Report Formatters]
    D --> N[Cloud Reporting]

    M --> O[CLI Output]
    M --> P[JSON Report]
    M --> Q[JUnit XML]

    N --> R[Result Sync]
    N --> S[Rate Tracking]
```

## 3. Core Functionality

### 3.1 CLI Operations

```typescript
class CLIOperations implements ToolHandler {
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
        description: 'Run a collection with configuration',
        inputSchema: {
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              description: 'Collection ID, URL, or local file path'
            },
            environment: {
              type: 'string',
              description: 'Environment ID, URL, or local file path'
            },
            folder: {
              type: 'string',
              description: 'Specific folder to run'
            },
            iterations: {
              type: 'number',
              description: 'Number of iterations to run'
            },
            delay: {
              type: 'number',
              description: 'Delay between requests in ms'
            },
            timeout: {
              type: 'number',
              description: 'Request timeout in ms'
            },
            reportFormat: {
              type: 'string',
              enum: ['cli', 'json', 'junit'],
              description: 'Report format'
            },
            reportPath: {
              type: 'string',
              description: 'Path to save the run report'
            },
            bail: {
              type: 'boolean',
              description: 'Stop on first test failure'
            },
            suppressExitCode: {
              type: 'boolean',
              description: 'Always exit with code 0'
            },
            disableCloudSync: {
              type: 'boolean',
              description: 'Disable syncing results to Postman cloud'
            }
          },
          required: ['collection']
        }
      },
      {
        name: 'api_lint',
        description: 'Check API definitions against governance rules',
        inputSchema: {
          type: 'object',
          properties: {
            api: {
              type: 'string',
              description: 'API ID, URL, or local definition file'
            },
            ruleset: {
              type: 'string',
              description: 'Governance ruleset name or path'
            },
            rules: {
              type: 'object',
              description: 'Custom rule configurations',
              additionalProperties: true
            },
            reportPath: {
              type: 'string',
              description: 'Path to save the lint report'
            },
            disableCloudSync: {
              type: 'boolean',
              description: 'Disable syncing results to Postman cloud'
            }
          },
          required: ['api']
        }
      },
      {
        name: 'contract_test',
        description: 'Run contract tests for an API',
        inputSchema: {
          type: 'object',
          properties: {
            api: {
              type: 'string',
              description: 'API ID, URL, or local definition file'
            },
            collection: {
              type: 'string',
              description: 'Contract test collection ID or file'
            },
            environment: {
              type: 'string',
              description: 'Environment ID or file path'
            },
            reportFormat: {
              type: 'string',
              enum: ['cli', 'json', 'junit'],
              description: 'Report format'
            },
            reportPath: {
              type: 'string',
              description: 'Path to save the test report'
            },
            disableCloudSync: {
              type: 'boolean',
              description: 'Disable syncing results to Postman cloud'
            }
          },
          required: ['api', 'collection']
        }
      }
    ];
  }
}
```

### 3.2 Collection Runner

```typescript
class CollectionRunner {
  constructor(
    private cloudSync: CloudSyncManager,
    private rateTracker: RateTracker
  ) {}

  async runCollection(args: RunCollectionArgs): Promise<RunResult> {
    // Track API usage
    await this.rateTracker.checkLimit();

    // 1. Validate and load collection
    const collection = await this.loadCollection(args.collection);
    await this.rateTracker.trackCall('collection_fetch');

    // 2. Set up environment if provided
    let environment;
    if (args.environment) {
      environment = await this.loadEnvironment(args.environment);
      await this.rateTracker.trackCall('environment_fetch');
    }

    // 3. Configure run options
    const options = {
      folder: args.folder,
      iterations: args.iterations,
      delay: args.delay,
      timeout: args.timeout,
      bail: args.bail,
      suppressExitCode: args.suppressExitCode
    };

    // 4. Execute collection run
    const results = await this.executeRun(collection, environment, options);

    // 5. Generate report
    const report = await this.reportManager.generateReport(results, {
      format: args.reportFormat || 'cli',
      reportPath: args.reportPath
    });

    // 6. Sync results to cloud if enabled
    if (!args.disableCloudSync) {
      await this.cloudSync.syncResults(results);
      await this.rateTracker.trackCall('results_sync');
    }

    return {
      success: results.failures === 0,
      summary: results.summary,
      report
    };
  }

  private async loadCollection(source: string): Promise<Collection> {
    if (this.isLocalFile(source)) {
      return this.loadLocalCollection(source);
    }
    if (this.isCollectionId(source)) {
      return this.loadRemoteCollection(source);
    }
    if (this.isUrl(source)) {
      return this.loadCollectionFromUrl(source);
    }
    throw new CLIError(
      CLIErrorCode.ValidationError,
      'Invalid collection source'
    );
  }

  private async loadEnvironment(source: string): Promise<Environment> {
    if (this.isLocalFile(source)) {
      return this.loadLocalEnvironment(source);
    }
    if (this.isEnvironmentId(source)) {
      return this.loadRemoteEnvironment(source);
    }
    if (this.isUrl(source)) {
      return this.loadEnvironmentFromUrl(source);
    }
    throw new CLIError(
      CLIErrorCode.ValidationError,
      'Invalid environment source'
    );
  }
}
```

### 3.3 API Governance

```typescript
class APIGovernance {
  constructor(
    private cloudSync: CloudSyncManager,
    private rateTracker: RateTracker
  ) {}

  async lintAPI(args: LintAPIArgs): Promise<LintResult> {
    // Track API usage
    await this.rateTracker.checkLimit();

    // 1. Load API definition
    const api = await this.loadAPIDefinition(args.api);

    // 2. Load governance rules
    const rules = await this.loadRules(args.ruleset, args.rules);
    await this.rateTracker.trackCall('rules_fetch');

    // 3. Run governance checks
    const violations = await this.checkRules(api, rules);

    // 4. Generate report
    const report = {
      success: violations.length === 0,
      violations,
      summary: this.generateSummary(violations)
    };

    // 5. Sync results if enabled
    if (!args.disableCloudSync) {
      await this.cloudSync.syncLintResults(report);
      await this.rateTracker.trackCall('results_sync');
    }

    return report;
  }

  private async loadRules(
    ruleset?: string,
    customRules?: Record<string, unknown>
  ): Promise<GovernanceRules> {
    // Load base ruleset
    const baseRules = ruleset
      ? await this.loadRulesetFromSource(ruleset)
      : this.getDefaultRules();

    // Merge with custom rules if provided
    return customRules
      ? this.mergeRules(baseRules, customRules)
      : baseRules;
  }
}
```


## 4. Authentication Management

```typescript
class AuthManager {
  private static instance: AuthManager;
  private apiKey: string | null = null;

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  async login(apiKey: string): Promise<void> {
    // 1. Validate API key format
    this.validateApiKeyFormat(apiKey);

    // 2. Test API key with a simple API call
    await this.testApiKey(apiKey);

    // 3. Store API key securely
    this.apiKey = apiKey;
  }

  async logout(): Promise<void> {
    this.apiKey = null;
  }

  getApiKey(): string {
    if (!this.apiKey) {
      throw new CLIError(
        CLIErrorCode.AuthenticationError,
        'Not authenticated. Please login first.'
      );
    }
    return this.apiKey;
  }
```


## 5. Reporting System

### 5.1 Report Formatters

```typescript
interface ReportFormatter {
  format(results: RunResult): Promise<string>;
}

class CLIFormatter implements ReportFormatter {
  async format(results: RunResult): Promise<string> {
    return this.formatCLIOutput(results);
  }
}

class JSONFormatter implements ReportFormatter {
  async format(results: RunResult): Promise<string> {
    return JSON.stringify(results, null, 2);
  }
}

class JUnitFormatter implements ReportFormatter {
  async format(results: RunResult): Promise<string> {
    return this.formatJUnitXML(results);
  }
}
```

### 5.2 Report Manager

```typescript
class ReportManager {
  private formatters: Map<string, ReportFormatter>;

  constructor() {
    this.formatters = new Map([
      ['cli', new CLIFormatter()],
      ['json', new JSONFormatter()],
      ['junit', new JUnitFormatter()]
    ]);
  }

  async generateReport(
    results: RunResult,
    options: ReportOptions
  ): Promise<string> {
    const formatter = this.formatters.get(options.format);
    if (!formatter) {
      throw new CLIError(
        CLIErrorCode.ValidationError,
        `Unsupported format: ${options.format}`
      );
    }

    const report = await formatter.format(results);

    if (options.reportPath) {
      await this.exportReport(report, options.reportPath);
    }

    return report;
  }
}
```

## 6. Error Handling

```typescript
enum CLIErrorCode {
  AuthenticationError = 'CLI_AUTH_ERROR',
  CollectionNotFound = 'COLLECTION_NOT_FOUND',
  EnvironmentNotFound = 'ENVIRONMENT_NOT_FOUND',
  ExecutionError = 'EXECUTION_ERROR',
  ValidationError = 'VALIDATION_ERROR',
  RateLimit = 'RATE_LIMIT_ERROR',
  CloudSyncError = 'CLOUD_SYNC_ERROR'
}

class CLIError extends Error {
  constructor(
    public code: CLIErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

class ErrorHandler {
  handle(error: unknown): ToolCallResponse {
    if (error instanceof CLIError) {
      return this.handleCLIError(error);
    }
    if (error instanceof RateLimitError) {
      return this.handleRateLimit(error);
    }
    if (axios.isAxiosError(error)) {
      return this.handleAPIError(error);
    }
    return this.handleUnknownError(error);
  }

  private handleRateLimit(error: RateLimitError): ToolCallResponse {
    return {
      content: [
        {
          type: 'text',
          text: `Rate limit exceeded. Please wait ${error.retryAfter} seconds.`
        }
      ],
      isError: true
    };
  }
}
```

## 7. Implementation Strategy

1. Phase 1: Core Authentication & Rate Management
   - Implement CLI login/logout
   - Add secure API key management
   - Implement rate tracking system
   - Set up error handling

2. Phase 2: Collection Runner & Cloud Sync
   - Basic collection execution
   - Support for local and remote collections
   - Cloud result syncing
   - Multiple report formats

3. Phase 3: API Governance
   - API definition loading
   - Configurable rule system
   - Violation reporting
   - Cloud sync integration

4. Phase 4: Testing & Documentation
   - Unit tests for all components
   - Integration tests
   - Rate limit tests
   - CLI usage documentation

## 8. Conclusion

This design provides a comprehensive implementation of Postman CLI functionality through the MCP server, with particular attention to:

1. **Cloud Integration**
   - Automatic result syncing
   - Rate limit handling
   - Usage tracking
   - Configurable sync behavior

2. **Robust Architecture**
   - Clear separation of concerns
   - Flexible source loading
   - Comprehensive error handling
   - Extensible reporting system

3. **User-Friendly Integration**
   - Multiple report formats
   - Local file support
   - Custom rule configurations
   - Detailed error messages

4. **Performance & Reliability**
   - Rate limit awareness
   - Automatic retries
   - Usage optimization
   - Error recovery

This implementation provides a solid foundation for integrating Postman CLI capabilities while maintaining flexibility for future extensions and ensuring reliable cloud integration.
