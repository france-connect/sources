import type { Path } from 'react-router';

import type { AnyObjectInterface, MessageTypes } from '@fc/common';

export interface LocationStateInterface extends AnyObjectInterface {
  from?: Path | string;
}

export interface LocationWithTypeStateInterface extends LocationStateInterface {
  type: MessageTypes;
}
