import { FSA } from '@fc/common';

import { ResponseStatus } from '../enums';

export interface MicroservicesRmqResponseInterface extends FSA {
  type: ResponseStatus;
  meta: {
    message: FSA;
  };
  payload: unknown;
}
