/* istanbul ignore file */

// Declarative code

import { ErrorCode } from '../enums';
import { OidcProviderBaseRenderedException } from './oidc-provider-base-rendered.exception';

export class OidcProviderInteractionNotFoundException extends OidcProviderBaseRenderedException {
  static CODE = ErrorCode.INTERACTION_NOT_FOUND;
  static DOCUMENTATION =
    "L'identifiant de cinématique ( interactionId ou sub ) n'a pas été retrouvé dans le contexte de la requête. Cela peut-être dû à un problème de session ou une manipulation de cet identifiant par l'utilisateur (pour l'interactionId).  Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'OidcProvider.exceptions.oidcProviderInteractionNoFound';
}
