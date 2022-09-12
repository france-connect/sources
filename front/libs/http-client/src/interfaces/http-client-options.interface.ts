/* istanbul ignore file */

// declarative file
import { AxiosRequestConfig } from 'axios';

export interface HttpClientOptions extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {}
