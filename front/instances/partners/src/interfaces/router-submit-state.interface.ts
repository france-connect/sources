import type { MessageTypes } from '@fc/common';

import type { SubmitTypesMessage } from '../enums';

export interface RouterSubmitStateInterface {
  submitState?: {
    message: SubmitTypesMessage;
    type: MessageTypes.ERROR | MessageTypes.SUCCESS;
  };
}
