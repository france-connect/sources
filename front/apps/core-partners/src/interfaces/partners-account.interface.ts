import type { PersonInterface } from '@fc/common';

export interface PartnersAccountInterface extends PersonInterface {
  email: string;
  lastConnection?: Date;
}
