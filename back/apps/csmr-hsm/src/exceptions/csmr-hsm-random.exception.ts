import { Description } from '@fc/exceptions';

import { CsmrHsmBaseException } from './csmr-hsm-base.exception';

/**
 * @todo
 * author: Olivier D.
 * Date: 21/06/2021
 * Context: Volonté d'ajouter une description pour le support, un message pour les usagers.
 * Vérifier la pertinence de cette erreur qui n'est pour le moment pas levée
 * mais passée en paramètre au logger
 */

/* istanbul ignore file */

// Declarative code
@Description(
  "Une erreur s'est produite lors de la génération d'un aléa par le HSM. Contacter le support N3. Cette erreur n'est normalement pas remontée aux utilisateurs",
)
export class CsmrHsmRandomException extends CsmrHsmBaseException {
  code = 2;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
