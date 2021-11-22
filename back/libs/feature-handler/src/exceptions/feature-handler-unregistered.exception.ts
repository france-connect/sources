import { ErrorCode } from '../enums';
import { FeatureHandlerBaseException } from './feature-handler-base.exception';

export class FeatureHandlerUnregisteredException extends FeatureHandlerBaseException {
  code = ErrorCode.UNREGISTERED_FEATURE_HANDLER;
  constructor() {
    super(
      `Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.`,
    );
  }
}
