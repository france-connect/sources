export enum WalletBridgeRoutes {
  OPENID4VP_AUTHORIZE_REQUEST_URI = '/ui/authorize-request-uri/:interactionId',
  OPENID4VP_AUTHORIZE_REQUEST_STATUS = '/api/authorize-request-status/:interactionId',
  OPENID4VP_AUTHORIZE_REQUEST_OBJECT = '/api/authorize-request-object/:interactionId/:state',
  OPENID4VP_AUTHORIZE_RESPONSE = '/api/authorize-response/:interactionId',
  OPENID4VP_AUTHORIZE_REDIRECT = '/ui/authorize-redirect/:interactionId',
  OIDC_INTERACTION = '/interaction/:interactionId',
}
