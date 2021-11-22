/* istanbul ignore file */

// Declarative code
export interface HttpProxyResponse<T = any> {
  data?: T;
  status: number;
  message: string;
  headers?: any;
}
