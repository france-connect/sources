import type { PersonInterface, UUIDType } from '@fc/common';

export interface PartnersAccountInterface extends PersonInterface {
  id: UUIDType;
  email: string;
  lastConnection?: Date;
}
