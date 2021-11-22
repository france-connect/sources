import { Description } from '@fc/exceptions';

import { CsmrHsmBaseException } from './csmr-hsm-base.exception';

/* istanbul ignore file */

// Declarative code
@Description(
  "Une erreur s'est produite lors de la signature d'un token par le HSM. Contacter le support N3. Cette erreur n'est normalement pas remontée aux utilisateurs",
)
export class CsmrHsmSignException extends CsmrHsmBaseException {
  code = 1;

  constructor() {
    super();
  }
}
