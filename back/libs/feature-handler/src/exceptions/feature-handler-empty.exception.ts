import { ErrorCode } from '../enums';
import { FeatureHandlerBaseException } from './feature-handler-base.exception';

export class FeatureHandlerEmptyException extends FeatureHandlerBaseException {
  code = ErrorCode.EMPTY_FEATURE_HANDLER;
  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
