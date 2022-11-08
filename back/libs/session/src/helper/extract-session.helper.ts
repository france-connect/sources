import { IncomingMessage } from 'http';

import { ExecutionContext } from '@nestjs/common';

import { ISessionService } from '../interfaces';
import { SessionService } from '../services';

export function extractSessionFromRequest<T>(
  moduleName: string,
  req: IncomingMessage,
): ISessionService<T> {
  return SessionService.getBoundedSession<T>(req, moduleName);
}

export function extractSessionFromContext<T>(
  moduleName: string,
  ctx: ExecutionContext,
): ISessionService<T> {
  const req = ctx.switchToHttp().getRequest();
  return extractSessionFromRequest<T>(moduleName, req);
}
