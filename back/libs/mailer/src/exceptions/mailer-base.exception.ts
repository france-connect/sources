// declarative code
// istanbul ignore next line

import { FcException } from '@fc/exceptions-deprecated';

export class MailerBaseException extends FcException {
  public originalError: Error;
  public readonly scope = 27;
}
