/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enums';
import { ViewTemplateBaseException } from './view-template-base.exception';

export class ViewTemplateServiceNotFoundException extends ViewTemplateBaseException {
  static CODE = ErrorCode.SERVICE_NOT_FOUND;
  static DOCUMENTATION = 'ViewTemplates.exceptions.viewTemplateServiceNotFound';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'ViewTemplates.exceptions.viewTemplateServiceNotFound';

  constructor(provider: object, methodName: string) {
    super();
    const providerName = provider?.constructor?.name;

    this.log = `Could not find ${providerName}.${methodName}(), is ${providerName} defined as provider and '@Injectable()'?`;
  }
}
