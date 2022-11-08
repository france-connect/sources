/* istanbul ignore file */

// Declarative file
import { uuid } from '@fc/common';

export interface Organisation {
  id: uuid;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
