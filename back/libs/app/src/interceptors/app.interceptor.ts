import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();

    this.logger.debug(`${req.method}/ ${req.path}`);

    return next.handle();
  }
}
