import type { ISODate } from '@fc/common';

import type { Environment } from '../enums';
import type { VersionInterface } from './version.interface';

export interface InstanceInterface {
  createdAt: ISODate;
  updatedAt: ISODate;
  id: string;
  environment: Environment;
  versions: VersionInterface[];
}
