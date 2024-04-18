/* istanbul ignore file */

// declarative file
import type { Method } from 'axios';

import type { HttpClientData } from './http-client-data.interface';

export interface HttpClientRequest {
  url: string;
  method: Method;
  data?: HttpClientData | URLSearchParams;
}
