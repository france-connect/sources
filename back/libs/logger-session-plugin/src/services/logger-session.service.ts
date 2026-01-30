import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { LoggerPluginServiceInterface } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { SessionService } from '@fc/session';

@Injectable()
export class LoggerSessionService implements LoggerPluginServiceInterface {
  constructor(private moduleRef: ModuleRef) {}

  getContext(): Record<string, unknown> {
    const sessionService = this.moduleRef.get(SessionService, {
      strict: false,
    });

    const sessionId = sessionService.getId();
    const { browsingSessionId, spId, spName, idpId, idpName } =
      sessionService.get<OidcClientSession>('OidcClient') || {};

    const context = {
      sessionId,
      browsingSessionId,
      spId,
      spName,
      idpId,
      idpName,
    };

    return context;
  }
}
