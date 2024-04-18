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
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
    private readonly session: SessionService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const cantRefresh = ForbidRefresh.get(this.reflector, context);

    if (cantRefresh) {
      this.checkRefresh(context);
    }

    return next.handle();
  }

  // eslint-disable-next-line complexity
  private checkRefresh(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { stepRoute } = this.session.get<OidcSession>('OidcClient') || {};
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
