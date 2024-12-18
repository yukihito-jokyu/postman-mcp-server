import { AxiosInstance } from 'axios';

export interface ToolCallContent {
  type: string;
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
    properties: Record<string, any>;
    required: string[];
  };
}

export interface ToolHandler {
  axiosInstance: AxiosInstance;
  getToolDefinitions(): ToolDefinition[];
  handleToolCall(name: string, args: unknown): Promise<ToolCallResponse>;
}
