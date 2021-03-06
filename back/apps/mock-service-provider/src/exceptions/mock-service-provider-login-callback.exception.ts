import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { MockServiceProviderBaseException } from './mock-service-provider-base.exception';

/**
 * @todo
 * author: Olivier D.
 * Date: 21/06/2021
 * Context: Volonté d'ajouter une description pour le support, un message pour les usagers.
 * Vérifier la pertinence de cette erreur qui n'est pour le moment pas levée
 */

// declarative code
// istanbul ignore next line
@Description('Ne semble pas utilisée - FS Mock')
export class MockServiceProviderLoginCallbackException extends MockServiceProviderBaseException {
  code = ErrorCode.LOGIN_CALLBACK;

  constructor() {
    super('Ne semble pas utilisée - FS Mock');
  }
}
