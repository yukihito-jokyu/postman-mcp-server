import axios, { AxiosInstance } from 'axios';

/**
 * Base class for Postman API tools
 * Provides common functionality and client setup
 */
export class BasePostmanTool {
  protected client: AxiosInstance;

  constructor(apiKey: string, baseURL: string = 'https://api.getpostman.com') {
    this.client = axios.create({
      baseURL,
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          throw new Error(`Postman API Error (${status}): ${data.error?.message || 'Unknown error'}`);
        } else if (error.request) {
          // Request made but no response
          throw new Error('No response received from Postman API');
        } else {
          // Error setting up request
          throw new Error(`Error making request: ${error.message}`);
        }
      }
    );
  }
}
