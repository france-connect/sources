/* istanbul ignore file */

// declarative file
import type { AxiosRequestConfig } from 'axios';

export interface HttpClientOptions extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {}
