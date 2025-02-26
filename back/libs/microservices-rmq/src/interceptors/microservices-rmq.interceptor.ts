import { Observable, Subscriber } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { AsyncLocalStorageService } from '@fc/async-local-storage';
import { FSA } from '@fc/common';

import { MicroservicesRmqStoreInterface } from '../interfaces';
import { RMQ_MESSAGE_STORE_KEY } from '../tokens';

@Injectable()
export class MicroservicesRmqInterceptor implements NestInterceptor {
  constructor(
    private readonly asyncLocalStorage: AsyncLocalStorageService<MicroservicesRmqStoreInterface>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const message = context.switchToRpc().getData();

    return new Observable(this.setContext.bind(this, next, message));
  }

  private setContext(
    next: CallHandler,
    message: FSA,
    subscriber: Subscriber<unknown>,
  ) {
    /**
     * Initialize asyncLocalStorage manually
     * because NestJS doesn't support middlewares in microservices yet
     * @see https://github.com/nestjs/nest/issues/1627
     */
    this.asyncLocalStorage.run(
      this.handle.bind(this, next, message, subscriber),
    );
  }

  private handle(
    next: CallHandler,
    message: FSA,
    subscriber: Subscriber<unknown>,
  ) {
    this.asyncLocalStorage.set(RMQ_MESSAGE_STORE_KEY, { message });

    next.handle().subscribe(subscriber);
  }
}
