import type { AxiosRequestConfig } from 'axios';

// @NOTE keep it as a shortcut to its super type
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HttpClientOptionsInterface
  extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {}
