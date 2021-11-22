/* istanbul ignore file */

// Declarative code
export interface HttpProxyRequest<T = any> {
  url?: string;
  method?: string;
  headers?: any;
  data?: T;
  responseType?: string;
}
