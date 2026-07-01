import type { EntityBaseInterface, PersonInterface, UUIDType } from '@fc/common';

import type { PartnersEnvironment } from '../enums';
import type { VersionInterface } from './version.interface';

export interface InstanceInterface extends EntityBaseInterface {
  environment: PartnersEnvironment;
  currentVersion: VersionInterface;
  creator?: InstanceCreatorInterface;
}

export interface InstanceCreatorInterface extends PersonInterface {
  id: UUIDType;
}
