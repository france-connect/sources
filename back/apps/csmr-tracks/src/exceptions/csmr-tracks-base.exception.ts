// declarative code
// istanbul ignore next line

import { FcException } from '@fc/exceptions-deprecated';

export class CsmrTracksBaseException extends FcException {
  public originalError: Error;
  public readonly scope = 28;
}
