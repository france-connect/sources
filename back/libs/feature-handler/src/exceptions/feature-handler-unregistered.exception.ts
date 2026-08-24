import { ErrorCode } from '../enums';
import { FeatureHandlerBaseException } from './feature-handler-base.exception';

export class FeatureHandlerUnregisteredException extends FeatureHandlerBaseException {
  static CODE = ErrorCode.UNREGISTERED_FEATURE_HANDLER;
  static DOCUMENTATION =
    'Aucun feature handler n’est enregistré sous le nom configuré pour le fournisseur d’identité : erreur de saisie en base ou handler absent du code. Contacter le support N3.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'FeatureHandler.exceptions.featureHandlerUnregistered';
}
