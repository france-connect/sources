import { ErrorCode } from '../enums';
import { CsmrHsmBaseException } from './csmr-hsm-base.exception';

/**
 * @todo
 * author: Olivier D.
 * Date: 21/06/2021
 * Context: Volonté d'ajouter une description pour le support, un message pour les usagers.
 * Vérifier la pertinence de cette erreur qui n'est pour le moment pas levée
 * mais passée en paramètre au logger
 */

export class CsmrHsmRandomException extends CsmrHsmBaseException {
  static DOCUMENTATION =
    "Une erreur s'est produite lors de la génération d'un aléa par le HSM. Contacter le support N3. Cette erreur n'est normalement pas remontée aux utilisateurs";
  static CODE = ErrorCode.HSM_RANDOM_GENERATE;
  static UI = 'CsmrHsm.exceptions.csmrHsmRandom';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
