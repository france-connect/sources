import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ISessionService } from '../interfaces';
import { SessionService } from '../services';

export function extractSessionFromRequest(
  moduleName: string,
  ctx: ExecutionContext,
): ISessionService<unknown> {
  const request = ctx.switchToHttp().getRequest();

  return SessionService.getBoundedSession(request, moduleName);
}

export const Session = createParamDecorator(extractSessionFromRequest);
