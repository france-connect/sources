import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ISessionService } from '../interfaces';
import { SessionService } from '../services';

export function extractSessionFromRequest(
  moduleName: string,
  ctx: ExecutionContext,
): ISessionService<unknown> {
  const request = ctx.switchToHttp().getRequest();
  const {
    sessionId,
    sessionService,
  }: {
    sessionId: string;
    sessionService: SessionService;
  } = request;

  const boundSessionContext = {
    sessionId,
    moduleName,
  };

  /**
   * The binding occurs to force the "set" and "get" operations within the
   * current module (set by the decorator used in a controller)
   */
  return {
    get: sessionService.get.bind(sessionService, boundSessionContext),
    set: sessionService.set.bind(sessionService, boundSessionContext),
  };
}

export const Session = createParamDecorator(extractSessionFromRequest);
