import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';

import { SessionTemplateService } from '../services/session-template.service';

@Injectable()
export class SessionTemplateInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly sessionTemplate: SessionTemplateService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    this.logger.trace('SessionTemplateInterceptor');

    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();

    const isHandleSession = req.sessionId !== undefined;

    if (isHandleSession) {
      await this.sessionTemplate.bindSessionToRes(req, res);
    }

    return next.handle();
  }
}
