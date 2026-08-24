export enum Openid4vpAuthorizationError {
  INVALID_REQUEST = 'invalid_request',
  UNAUTHORIZED_CLIENT = 'unauthorized_client',
  ACCESS_DENIED = 'access_denied',
  UNSUPPORTED_RESPONSE_TYPE = 'unsupported_response_type',
  INVALID_SCOPE = 'invalid_scope',
  SERVER_ERROR = 'server_error',
  TEMPORARILY_UNAVAILABLE = 'temporarily_unavailable',
  VP_FORMATS_NOT_SUPPORTED = 'vp_formats_not_supported',
  INVALID_PRESENTATION_DEFINITION_URI = 'invalid_presentation_definition_uri',
  INVALID_PRESENTATION_DEFINITION_REFERENCE = 'invalid_presentation_definition_reference',
  INVALID_REQUEST_URI_METHOD = 'invalid_request_uri_method',
  WALLET_UNAVAILABLE = 'wallet_unavailable',
}
