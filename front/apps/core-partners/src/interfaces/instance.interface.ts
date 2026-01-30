import type { ISODate, UUIDType } from '@fc/common';

import type { PartnersEnvironment } from '../enums';
import type { VersionInterface } from './version.interface';

export interface InstanceInterface {
  createdAt: ISODate;
  updatedAt: ISODate;
  id: UUIDType;
  environment: PartnersEnvironment;
  versions: VersionInterface[];
}
