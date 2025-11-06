import type { Environment, ISODate, UUIDType } from '@fc/common';

import type { VersionInterface } from './version.interface';

export interface InstanceInterface {
  createdAt: ISODate;
  updatedAt: ISODate;
  id: UUIDType;
  environment: Environment;
  versions: VersionInterface[];
}
