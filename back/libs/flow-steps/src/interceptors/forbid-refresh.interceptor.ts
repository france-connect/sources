import { Observable } from 'rxjs';

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

import { ForbidRefresh } from '../decorators';
import { UnexpectedNavigationException } from '../exceptions';

@Injectable()
export class ForbidRefreshInterceptor implements NestInterceptor {
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
    const cantRefresh = ForbidRefresh.get(this.reflector, context);

    if (cantRefresh) {
      await this.checkRefresh(context);
    }

    return next.handle();
  }

  private async checkRefresh(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (!req.sessionId) {
      return;
    }
    const session = SessionService.getBoundedSession<OidcSession>(
      req,
      'OidcClient',
    );
    const { stepRoute } = await session.get();
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const currentRoute = req.route.path.replace(urlPrefix, '');

    if (currentRoute === stepRoute) {
      throw new UnexpectedNavigationException(stepRoute);
    }
  }
}
