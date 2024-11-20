/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enums';
import { ViewTemplateBaseException } from './view-template-base.exception';

export class ViewTemplateConflictingAliasException extends ViewTemplateBaseException {
  static CODE = ErrorCode.CONFLICTING_ALIAS;
  static DOCUMENTATION =
    'ViewTemplates.exceptions.viewTemplateConflictingAlias';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'ViewTemplates.exceptions.viewTemplateConflictingAlias';

  constructor(alias: string) {
    super();
    this.log = `View template alias "${alias}" is already registered`;
  }
}
