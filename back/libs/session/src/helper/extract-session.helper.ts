import { ExecutionContext } from '@nestjs/common';

import { ISessionRequest, ISessionService } from '../interfaces';
import { SessionService } from '../services';

export function extractSessionFromRequest<T>(
  moduleName: string,
  req: ISessionRequest,
): ISessionService<T> {
  return SessionService.getBoundSession<T>(req, moduleName);
}

export function extractSessionFromContext<T>(
  moduleName: string,
  ctx: ExecutionContext,
): ISessionService<T> {
  const req = ctx.switchToHttp().getRequest();
  return extractSessionFromRequest<T>(moduleName, req);
}
