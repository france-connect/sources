import { FcException } from '../../../exceptions';

export class ImportFixture extends FcException {
  static DOCUMENTATION = 'documentation';
  static SCOPE = 1;
  static CODE = 2;
  static ERROR = 'error';
  static ERROR_DESCRIPTION = 'error description';
  static UI = 'ui';
  readonly message = 'message';
  static LOG_LEVEL = 20;
}
