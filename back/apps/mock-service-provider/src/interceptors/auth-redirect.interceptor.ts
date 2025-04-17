import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { OidcSession } from '@fc/oidc';
import { SessionService } from '@fc/session';

import { MockServiceProviderAuthException } from '../exceptions';

@Injectable()
export class AuthRedirectInterceptor implements NestInterceptor {
  constructor(private readonly session: SessionService) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const oidcClient = this.session.get<OidcSession>('OidcClient');
    this.redirectIfNotConnected(oidcClient);
    return next.handle();
  }

  private redirectIfNotConnected(oidcClient: OidcSession): void {
    const { idpIdentity } = oidcClient || {};
    // Redirect to the login page if no idpIdentity present in the session
    if (!idpIdentity) {
      throw new MockServiceProviderAuthException();
    }
  }
}
