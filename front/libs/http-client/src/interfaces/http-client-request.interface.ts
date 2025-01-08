import type { Method } from 'axios';

import type { HttpClientDataInterface } from './http-client-data.interface';

export interface HttpClientRequestInterface {
  url: string;
  method: Method;
  data?: HttpClientDataInterface | URLSearchParams;
}
