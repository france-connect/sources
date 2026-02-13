import * as deepFreeze from 'deep-freeze';
import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';

import { AccessControlAccountSession } from '../dto';
import { AccountPermissionRepository } from '../services';

@Injectable()
export class AccessControlSessionInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly sessionService: SessionService,
    private readonly accountPermission: AccountPermissionRepository<
      string,
      string
    >,
  ) {
    this.logger.debug(this.constructor.name);
  }

  async intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const sessionData =
      this.sessionService.get<AccessControlAccountSession<string, string>>(
        'PartnersAccount',
      );

    if (sessionData?.identity?.email) {
      const permissions = await this.accountPermission.getByEmail(
        sessionData.identity.email,
      );

      this.sessionService.set('PartnersAccount', {
        permissions: deepFreeze(permissions),
      });
    }

    return next.handle();
  }
}
