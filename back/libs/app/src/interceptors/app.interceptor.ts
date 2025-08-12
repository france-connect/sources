import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    switch (context.getType()) {
      case 'http':
        this.interceptHttp(context);
        break;
      case 'rpc':
        this.interceptRpc(context);
        break;
    }

    return next.handle();
  }

  private interceptHttp(context: ExecutionContext): void {
    const req = context.switchToHttp().getRequest();

    this.logger.debug(`${req.method} ${req.path}`);
  }

  private interceptRpc(context: ExecutionContext): void {
    const message = context.switchToRpc().getData();
    const {
      args: [, , pattern],
    } = context.switchToRpc().getContext();

    this.logger.debug({ msg: `Ms:ReceiveMessage:${pattern}`, message });
  }
}
