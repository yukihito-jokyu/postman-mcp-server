import axios, { AxiosInstance } from 'axios';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

interface PostmanToolOptions {
  baseURL?: string;
  acceptHeader?: string;
}

/**
 * Base class for Postman API tools
 * Provides common functionality and client setup
 */
export class BasePostmanTool {
  protected client: AxiosInstance;

  constructor(
    apiKey: string,
    options: PostmanToolOptions = {},
    existingClient?: AxiosInstance
  ) {
    const baseURL = options.baseURL || 'https://api.getpostman.com';

    if (existingClient) {
      this.client = existingClient;
    } else {
      this.client = axios.create({
        baseURL,
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });
    }

    // Add custom Accept header if provided
    if (options.acceptHeader) {
      this.client.interceptors.request.use(config => {
        config.headers['Accept'] = options.acceptHeader;
        return config;
      });
    }

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          // Map HTTP status codes to appropriate MCP error codes
          switch (error.response.status) {
            case 400:
              throw new McpError(
                ErrorCode.InvalidRequest,
                error.response.data?.error?.message || 'Invalid request parameters'
              );
            case 401:
              throw new McpError(
                ErrorCode.InvalidRequest,
                'Unauthorized: Invalid or missing API key'
              );
            case 403:
              throw new McpError(
                ErrorCode.InvalidRequest,
                'Forbidden: Insufficient permissions or feature unavailable'
              );
            case 404:
              throw new McpError(
                ErrorCode.InvalidRequest,
                'Resource not found'
              );
            case 422:
              throw new McpError(
                ErrorCode.InvalidRequest,
                error.response.data?.error?.message || 'Invalid request parameters'
              );
            case 429:
              throw new McpError(
                ErrorCode.InvalidRequest,
                'Rate limit exceeded'
              );
            default:
              throw new McpError(
                ErrorCode.InternalError,
                error.response.data?.error?.message || 'Internal server error'
              );
          }
        } else if (error.request) {
          throw new McpError(
            ErrorCode.InternalError,
            'No response received from Postman API'
          );
        } else {
          throw new McpError(
            ErrorCode.InternalError,
            `Error making request: ${error.message}`
          );
        }
      }
    );
  }
}
