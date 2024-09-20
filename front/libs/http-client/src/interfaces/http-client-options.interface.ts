/* istanbul ignore file */

// declarative file
import type { AxiosRequestConfig } from 'axios';

export interface HttpClientOptionsInterface
  extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {}
