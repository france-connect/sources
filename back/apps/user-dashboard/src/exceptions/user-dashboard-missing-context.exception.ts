/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { UserDashboardBaseException } from './user-dashboard-base.exception';

@Description(
  "La requête HTTP n'est pas valide, le tableau de bord n'a pas pu la traiter car il manque des éléments obligatoires ( headers, ... ). Cette erreur ne devrait pas se produire, contacter le service technique",
)
export class UserDashboardMissingContextException extends UserDashboardBaseException {
  code = ErrorCode.MISSING_CONTEXT;

  public readonly message =
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';
}
