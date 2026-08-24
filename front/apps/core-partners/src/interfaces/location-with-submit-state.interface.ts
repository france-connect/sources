import type { LocationWithTypeStateInterface } from '@fc/routing';

import type { PartnersAlertVariants } from '../enums';

export interface LocationWithSubmitStateInterface extends LocationWithTypeStateInterface {
  variant?: PartnersAlertVariants;
  title: string;
  message?: string;
}
