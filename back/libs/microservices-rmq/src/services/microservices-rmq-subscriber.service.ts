import { Injectable } from '@nestjs/common';

import { AsyncLocalStorageService } from '@fc/async-local-storage';

import { ResponseStatus } from '../enums';
import {
  MicroservicesRmqResponseInterface,
  MicroservicesRmqStoreInterface,
} from '../interfaces';
import { RMQ_MESSAGE_STORE_KEY } from '../tokens';

@Injectable()
export class MicroservicesRmqSubscriberService {
  constructor(
    private readonly asyncLocalStorage: AsyncLocalStorageService<MicroservicesRmqStoreInterface>,
  ) {}

  response<Response extends MicroservicesRmqResponseInterface>(
    payload: unknown,
  ): Response {
    const store = this.asyncLocalStorage.get(RMQ_MESSAGE_STORE_KEY);

    return {
      type: ResponseStatus.SUCCESS,
      meta: {
        message: store.message,
      },
      payload,
    } as Response;
  }
}
