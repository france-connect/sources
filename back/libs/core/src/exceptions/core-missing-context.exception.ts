/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(
  "La requête HTTP n'est pas valide, FranceConnect+ n'a pas pu la traiter car il manque des élements obligatoires ( headers, ... ). Cette erreur ne devrait pas se produire, contacter le service technique",
)
export class CoreMissingContextException extends CoreBaseException {
  code = ErrorCode.MISSING_CONTEXT;

  /* eslint-disable @typescript-eslint/no-unused-vars */
  constructor(param: string) {
    // param désactivé car pas utilisé dans le message usager.
    // En revanche il est passé dans le code et laissé en param ici
    // car il sera potentiellement utilisé pour le message pour les développeurs
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
