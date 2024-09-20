/* istanbul ignore file */

// declarative file
export interface HttpClientConfig {
  apiCsrfURL: string;
  // @NOTE if not defined
  // request's endpoint should be an absolute URL
  baseURL?: string;
  // @NOTE any request timeout, default to 1000ms
  timeout?: number;
}
