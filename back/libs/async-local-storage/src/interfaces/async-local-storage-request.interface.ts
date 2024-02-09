/* istanbul ignore file */

// Declarative code
import { Request } from 'express';

export interface AsyncLocalStorageRequestInterface {
  request?: Request & { sessionId?: string };
}
