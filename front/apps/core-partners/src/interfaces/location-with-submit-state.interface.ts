import type { LocationWithTypeStateInterface } from '@fc/routing';

export interface LocationWithSubmitStateInterface extends LocationWithTypeStateInterface {
  title: string;
  message?: string;
}
