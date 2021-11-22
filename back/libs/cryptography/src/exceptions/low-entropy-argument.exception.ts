/* istanbul ignore file */

// Declarative code
import { Description, Loggable } from '@fc/exceptions';

import { CryptographyBaseException } from './cryptography-base.exception';

@Loggable()
@Description(
  "Problème de configuration dans la librairie de cryptographie (Une fonction de génération d'aléa requiert une longueur minimale pour éviter des collisions)",
)
export class LowEntropyArgumentException extends CryptographyBaseException {
  constructor(length: number) {
    super();
    this.message = `Entropy must be at least 32 Bytes for random bytes generation, <${length}> given.`;
  }
}
