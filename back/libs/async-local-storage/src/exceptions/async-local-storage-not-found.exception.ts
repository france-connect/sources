/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions/decorator/description.decorator';

import { ErrorCode } from '../enum';
import { AsyncLocalStorageBaseException } from './async-local-storage-base.exception';

@Description(
  "Le store n'a pas pu être récupéré dans le présent contexte. Vérifiez que l'appel actuel se situe bien dans le contexte du callback de l'appel à \"run\". Voir également la documentation NodeJS de AsyncLocalStorage pour plus de détail.",
)
export class AsyncLocalStorageNotFoundException extends AsyncLocalStorageBaseException {
  public readonly code = ErrorCode.ASYNC_LOCAL_STORAGE_NOT_FOUND;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
