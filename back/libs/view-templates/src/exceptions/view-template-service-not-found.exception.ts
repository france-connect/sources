/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions/decorator';

import { ErrorCode } from '../enums';
import { ViewTemplateBaseException } from './view-template-base.exception';

@Description(
  "Un alias sur une méthode d'instance n'a pas pu être exposé aux templates, probablement car le service n'est pas enregistré comme provider.",
)
export class ViewTemplateServiceNotFoundException extends ViewTemplateBaseException {
  public readonly code = ErrorCode.SERVICE_NOT_FOUND;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor(provider: object, methodName: string) {
    super();
    this.message = `Could not find ${provider.constructor.name}.${methodName}(), is ${provider.constructor.name} defined as provider and '@Injectable()'?`;
  }
}
