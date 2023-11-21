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
import {
  UndefinedStepRouteException,
  UnexpectedNavigationException,
} from '../exceptions';

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

  // eslint-disable-next-line complexity
  private async checkRefresh(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (!req.sessionId) {
      return;
    }
    const session = SessionService.getBoundSession<OidcSession>(
      req,
      'OidcClient',
    );
    const { stepRoute } = (await session.get()) || {};
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const currentRoute = req.route.path.replace(urlPrefix, '');

    if (!stepRoute) {
      throw new UndefinedStepRouteException();
    }

    if (currentRoute === stepRoute) {
      throw new UnexpectedNavigationException(stepRoute);
    }
  }
}
