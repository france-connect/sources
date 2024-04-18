/* istanbul ignore file */
import { FcException } from '@fc/exceptions-deprecated';

export const anyFunction = () => false;

export class ImportFixture extends FcException {
  scope = 2;
  code = 2;
  message = 'any';
  static ERROR = 'error';
  static ERROR_DESCRIPTION = 'error description';
}
