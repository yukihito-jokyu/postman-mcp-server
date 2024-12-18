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

export interface ToolHandler {
  axiosInstance: AxiosInstance;
  getToolDefinitions(): ToolDefinition[];
  handleToolCall(name: string, args: unknown): Promise<ToolCallResponse>;
}
