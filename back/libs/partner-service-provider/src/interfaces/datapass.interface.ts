/* istanbul ignore file */

// Declarative file
import { uuid } from '@fc/common';

export interface Datapass {
  id: uuid;
  remoteId: number;
  createdAt: Date;
}
