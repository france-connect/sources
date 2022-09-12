/* istanbul ignore file */

// declarative file
import { Method } from 'axios';

import { HttpClientData } from './http-client-data.interface';

export interface HttpClientRequest {
  url: string;
  method: Method;
  data?: HttpClientData | URLSearchParams;
}
