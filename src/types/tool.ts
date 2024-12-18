import { AxiosInstance } from 'axios';

export interface ToolCallContent {
  type: 'text';  // Simplified since we only use 'text' type
  text: string;
}

export interface ToolCallResponse {
  content: ToolCallContent[];
  isError?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

/**
 * Interface for handling tool operations
 * Note: The HTTP client implementation is considered an implementation detail
 * and should not be exposed through the interface
 */
export interface ToolHandler {
  getToolDefinitions(): ToolDefinition[];
  handleToolCall(name: string, args: unknown): Promise<ToolCallResponse>;
}
