/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enums';
import { FeatureHandlerBaseException } from './feature-handler-base.exception';

export class FeatureHandlerEmptyException extends FeatureHandlerBaseException {
  static CODE = ErrorCode.EMPTY_FEATURE_HANDLER;
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'FeatureHandler.exceptions.featureHandlerEmpty';
}
