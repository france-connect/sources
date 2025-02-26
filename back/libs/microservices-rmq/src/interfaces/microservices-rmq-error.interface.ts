import { FSA, FSAMeta } from '@fc/common';

import { ResponseStatus } from '../enums';

export interface MicroservicesRmqErrorMetaInterface extends FSAMeta {
  readonly code: string;
  readonly id: string;
}
export interface MicroservicesRmqErrorInterface extends FSA {
  readonly type: ResponseStatus;
  readonly meta: MicroservicesRmqErrorMetaInterface;
  readonly payload: unknown;
}
