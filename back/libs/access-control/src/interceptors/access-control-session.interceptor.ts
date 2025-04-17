import * as deepFreeze from 'deep-freeze';
import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import { PartnersAccountSession } from '@fc/partners-account';
import { SessionService } from '@fc/session';

import { AccountPermissionRepository } from '../services';
import { ACCESS_CONTROL_TOKEN } from '../tokens';

@Injectable()
export class AccessControlSessionInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly sessionService: SessionService,
    private readonly accountPermission: AccountPermissionRepository,
  ) {
    this.logger.debug(this.constructor.name);
  }

  async intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const sessionData =
      this.sessionService.get<PartnersAccountSession>('PartnersAccount');

    if (sessionData?.identity?.email) {
      const permissions = await this.accountPermission.getByEmail(
        sessionData.identity.email,
      );

      this.sessionService.set('PartnersAccount', {
        [ACCESS_CONTROL_TOKEN]: {
          userPermissions: deepFreeze(permissions),
        },
      });
    }

    return next.handle();
  }
}
