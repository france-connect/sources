/* istanbul ignore file */

// Declarative code
import { ErrorCode } from '@fc/core';
import { Description } from '@fc/exceptions';

import { UserDashboardBaseException } from './user-dashboard-base.exception';

/**
 * @todo
 * author: Olivier D.
 * Date: 21/06/2021
 * Context: Volonté d'ajouter une description pour le support, un message pour les usagers.
 * Vérifier la pertinence de cette erreur qui n'est pour le moment pas levée
 */
@Description('Ne semble pas utilisée - UserDashboard')
export class UserDashboardInvalidIdentityException extends UserDashboardBaseException {
  code = ErrorCode.INVALID_IDENTITY;

  constructor() {
    super('Ne semble pas utilisée - UserDashboard');
  }
}
