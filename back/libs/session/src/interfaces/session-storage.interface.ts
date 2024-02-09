/* istanbul ignore file */

import { SESSION_STORE_KEY } from '../tokens';

// Declarative file
export interface SessionStoreContentInterface {
  id: string;
  data: any;
  sync: boolean;
}

export interface SessionStoreInterface {
  [SESSION_STORE_KEY]: SessionStoreContentInterface;
}
