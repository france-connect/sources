import { FcException } from '../../../exceptions';

export const anyFunction = () => false;

export class ImportFixture2 extends FcException {
  static DOCUMENTATION = 'documentation';
  static SCOPE = 2;
  static CODE = 2;
  static ERROR = 'error';
  static ERROR_DESCRIPTION = 'error description';
  static UI = 'ui';
  readonly message = 'message';
  static LOG_LEVEL = 20;
}
