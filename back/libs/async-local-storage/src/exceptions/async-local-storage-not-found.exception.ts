import { ErrorCode } from '../enum';
import { AsyncLocalStorageBaseException } from './async-local-storage-base.exception';

export class AsyncLocalStorageNotFoundException extends AsyncLocalStorageBaseException {
  static CODE = ErrorCode.ASYNC_LOCAL_STORAGE_NOT_FOUND;
  static DOCUMENTATION =
    "Le store n'a pas pu être récupéré dans le présent contexte. Vérifiez que l'appel actuel se situe bien dans le contexte du callback de l'appel à \"run\". Voir également la documentation NodeJS de AsyncLocalStorage pour plus de détail.";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'AsyncLocalStorage.exceptions.asyncLocalStorageNotFound';
}
