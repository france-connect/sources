import type { EventTypes } from '@fc/common';

import type { SubmitTypesMessage } from '../enums';

export interface RouterSubmitStateInterface {
  submitState?: {
    message: SubmitTypesMessage;
    type: EventTypes.ERROR | EventTypes.SUCCESS;
  };
}
