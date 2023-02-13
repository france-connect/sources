import { Class } from 'type-fest';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { checkSession, extractSessionFromContext } from '../helper';
import { ISessionService } from '../interfaces';

/**
 *
 * @param {string} moduleName  The session part we want our session service to be bounded to
 * @param {class} [dto]  The DTO validation schema
 * @return ISessionService
 *
 * This decorator gets a sessionService
 * bounded to the session part given as first argument (`moduleName`).
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
  const decorator = async function (
    _arg: string,
    ctx: ExecutionContext,
  ): Promise<ISessionService<unknown>> {
    const sessionService = extractSessionFromContext(moduleName, ctx);

    if (dto) {
      const sessionData = await sessionService.get();
      await checkSession(sessionData, moduleName, dto);
    }

    return sessionService;
  };

  const paramDecoratorFactory = createParamDecorator(decorator);

  return paramDecoratorFactory();
}
