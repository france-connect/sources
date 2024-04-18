import { Class } from 'type-fest';

import { createParamDecorator } from '@nestjs/common';

import { NestJsDependencyInjectionWrapper } from '@fc/common';

import { checkSession } from '../helper';
import { ISessionService } from '../interfaces';
import { SessionService } from '../services';
/**
 *
 * @param {string} moduleName  The session part we want our session service to be bound to
 * @param {class} [dto]  The DTO validation schema
 * @return ISessionService
 *
 * This decorator gets a sessionService
 * bound to the session part given as first argument (`moduleName`).
 *
 * If a second argument is provided, it is used as a DTO validation schema.
 * In this case, if the asked session part is undefined,
 * the decorator will throw a `SessionNotFoundException`.
 *
 * If the session part is defined but do not match the DTO,
 * the decorator will throw a `SessionInvalidSessionException`.
 *
 * @note Since NestJS built-in helper `createParamDecorator` expects only one parameter,
 * we use a closure to make multiple arguments available in the scope of the decorator.
 */
export function Session(moduleName: string, dto?: Class<unknown>) {
  /**
   * @param _arg `moduleName` and `_arg` are the same variable (first argument of the decorator)
   */
  const decorator = async function (): Promise<ISessionService<unknown>> {
    const sessionService =
      NestJsDependencyInjectionWrapper.get<SessionService>(SessionService);

    const boundSessionService = getBoundSession(sessionService, moduleName);

    if (dto) {
      const sessionData = await boundSessionService.get();
      await checkSession(sessionData, moduleName, dto);
    }

    return boundSessionService;
  };

  const paramDecoratorFactory = createParamDecorator(decorator);

  return paramDecoratorFactory();
}

export function getBoundSession<T = unknown>(
  sessionService: SessionService,
  moduleName: string,
): ISessionService<T> {
  return {
    get: sessionService.get.bind(sessionService, moduleName),
    set: sessionService.set.bind(sessionService, moduleName),
    setAlias: sessionService.setAlias.bind(sessionService),
    commit: sessionService.commit.bind(sessionService, moduleName),
  };
}
