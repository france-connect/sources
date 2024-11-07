import { Response } from 'express';
import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { OidcSession } from '@fc/oidc';
import { SessionService } from '@fc/session';

import { MockServiceProviderRoutes } from '../enums';

@Injectable()
export class AuthRedirectInterceptor implements NestInterceptor {
  constructor(private readonly session: SessionService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const res = context.switchToHttp().getResponse<Response>();
    const oidcClient = this.session.get<OidcSession>('OidcClient');
    this.redirectIfNotConnected(res, oidcClient);
    return next.handle();
  }

  private redirectIfNotConnected(res: Response, oidcClient: OidcSession): void {
    const { idpIdentity } = oidcClient || {};
    // Redirect to the login page if no idpIdentity present in the session
    if (!idpIdentity) {
      res.redirect(MockServiceProviderRoutes.LOGIN);
    }
  }
}
