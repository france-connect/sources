import { FSA } from '@fc/common';

import { RMQ_MESSAGE_STORE_KEY } from '../tokens';

export interface MicroservicesRmqStoreContentInterface {
  message: FSA;
}

export interface MicroservicesRmqStoreInterface {
  [RMQ_MESSAGE_STORE_KEY]: MicroservicesRmqStoreContentInterface;
}
