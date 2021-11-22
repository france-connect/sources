/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(
  `Le niveau eIDAS renvoyé par le FI est plus faible que celui demandé par le FS. L'utilisateur doit recommencer la cinématique. Si le problème persiste, contacter le support N3`,
)
export class CoreLowAcrException extends CoreBaseException {
  scope = 2; // identity provider scope
  code = ErrorCode.LOW_ACR;

  constructor() {
    super(
      'Le niveau de sécurité utilisé pour vous authentifier ne correspondant pas au niveau exigé pour votre démarche.',
    );
  }
}
