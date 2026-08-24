import { ErrorCode } from '../enums';
import { FeatureHandlerBaseException } from './feature-handler-base.exception';

export class FeatureHandlerEmptyException extends FeatureHandlerBaseException {
  static CODE = ErrorCode.EMPTY_FEATURE_HANDLER;
  static DOCUMENTATION =
    'Le nom du feature handler est absent ou vide dans la configuration du fournisseur d’identité en base. Contacter le support N3.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'FeatureHandler.exceptions.featureHandlerEmpty';
}
