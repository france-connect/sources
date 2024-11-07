/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreFcaBaseException } from './core-fca-base.exception';

@Description('')
export class CoreFcaUnauthorizedEmailException extends CoreFcaBaseException {
  constructor(
    private spName: string,
    private spContact: string,
    private authorizedFqdns: string[],
  ) {
    super();
  }

  code = ErrorCode.UNAUTHORIZED_EMAIL;
  readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  illustration = 'unauthorized-email-error';
  title = 'Email non autorisé';
  description =
    `Vous essayez de vous connecter à ${this.spName}.\n\n` +
    `Réessayez en utilisant votre adresse email professionnelle :\n\n` +
    `✅ ${this.authorizedFqdns.join(', ')}\n` +
    `❌ gmail, yahoo, orange`;
  public displayContact = true;
  public contactMessage = `Si cela ne fonctionne pas, contactez le support utilisateur du service ${this.spName} pour régler le problème.`;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a configuration limitation';

  public contactHref = `mailto:${this.spContact}`;
}
