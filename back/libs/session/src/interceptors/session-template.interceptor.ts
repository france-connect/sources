import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { SessionTemplateService } from '../services/session-template.service';

@Injectable()
export class SessionTemplateInterceptor implements NestInterceptor {
  constructor(private readonly sessionTemplate: SessionTemplateService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();

    const isHandleSession = req.sessionId !== undefined;

    if (isHandleSession) {
      await this.sessionTemplate.bindSessionToRes(req, res);
    }

    return next.handle();
  }
}
