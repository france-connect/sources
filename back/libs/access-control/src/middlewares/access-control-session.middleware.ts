import * as deepFreeze from 'deep-freeze';
import { NextFunction } from 'express';
import { IncomingMessage } from 'http';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { AccountPermission } from '@entities/typeorm';

import { uuid } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';
import { PartnerAccountSession } from '@fc/partner-account';
import { SessionService } from '@fc/session';

import { AccessControlSession, IPermission } from '../interfaces';
import { AccountPermissionRepository } from '../services';
import { ACCESS_CONTROL_TOKEN } from '../tokens';

@Injectable()
export class AccessControlSessionMiddleware
  implements NestMiddleware<IncomingMessage & AccessControlSession>
{
  constructor(
    private readonly logger: LoggerService,
    private readonly accountPermission: AccountPermissionRepository,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async use(
    req: IncomingMessage & AccessControlSession,
    _res: Response,
    next: NextFunction,
  ) {
    this.logger.trace('Call AccessControl Middleware');

    const id = await this.getAccountIdFromContext(req);

    let permissions: AccountPermission[] = [];

    if (id) {
      permissions = await this.accountPermission.getByAccountId(id);
    }

    this.injectPermissionsIntoContext(req, permissions);
    this.logger.trace({ id, permissions });

    next();
  }

  private async getAccountIdFromContext(
    req: IncomingMessage,
  ): Promise<string | undefined> {
    const userSession = SessionService.getBoundedSession<PartnerAccountSession>(
      req,
      'PartnerAccount',
    );

    const id: uuid = await userSession.get('id');
    this.logger.trace({ id });

    return id;
  }

  private injectPermissionsIntoContext(
    req: IncomingMessage,
    roles: IPermission[],
  ) {
    // Freeze and protect the roles definition
    Object.defineProperty(req, ACCESS_CONTROL_TOKEN, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: deepFreeze(roles),
    });
  }
}
