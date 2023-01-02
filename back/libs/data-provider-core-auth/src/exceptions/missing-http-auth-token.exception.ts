/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions';

import { DataProviderCoreAuthBaseException } from './data-provider-core-auth-base.exception';

@Description(
  "Impossible d'extraire le token d'authentification, l'entête 'authorization' est absent",
)
export class MissingHttpAuthTokenException extends DataProviderCoreAuthBaseException {
  code = 2;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
}
