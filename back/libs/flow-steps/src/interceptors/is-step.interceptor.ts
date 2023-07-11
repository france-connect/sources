import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import { SessionService } from '@fc/session';

import { IsStep } from '../decorators';

@Injectable()
export class IsStepInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const isFlowStep = IsStep.get(this.reflector, context);

    if (!isFlowStep) {
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: this.setStep.bind(this, context),
        error: this.setStep.bind(this, context),
      }),
    );
  }

  private async setStep(context: ExecutionContext): Promise<void> {
    const req = context.switchToHttp().getRequest();

    if (!req.sessionId) {
      return;
    }

    const session = SessionService.getBoundedSession<OidcSession>(
      req,
      'OidcClient',
    );
    const { urlPrefix } = this.config.get<AppConfig>('App');

    const stepRoute = req.route.path.replace(urlPrefix, '');

    this.logger.trace(`new stepRoute: ${stepRoute}`);

    await session.set('stepRoute', stepRoute);
  }
}
