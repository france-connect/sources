import { Class } from 'type-fest';

import { validateDto } from '@fc/common';

import {
  SessionInvalidSessionException,
  SessionNotFoundException,
} from '../exceptions';

export async function checkSession(
  sessionData: unknown,
  moduleName: string,
  dto: Class<unknown>,
) {
  if (!sessionData) {
    throw new SessionNotFoundException(moduleName);
  }

  /**
   * @todo #1166
   *
   * Use strict validation options
   *   whitelist: true,
   *   forbidNonWhitelisted: true,
   *
   * For now we only have one generic DTO
   */
  const validationOptions = {};
  const errors = await validateDto(sessionData as any, dto, validationOptions);

  if (errors.length) {
    /**
     * @todo #587 pass the `errors` to the exception
     * so that the error message is available in logs
     */
    throw new SessionInvalidSessionException();
  }
}
