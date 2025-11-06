export enum PartnersBackRoutes {
  INDEX = '/',
  USER_INFO = '/me',
  CSRF_TOKEN = '/csrf-token',
  LOGOUT = '/logout',
  LOGOUT_CALLBACK = '/logout-callback',

  SERVICE_PROVIDERS = '/service-providers',

  SP_INSTANCES = '/instances',
  SP_INSTANCE = '/instances/:instanceId',

  SP_VERSION_FORM_METADATA = '/versions/form-metadata',

  DATAPASS_WEBHOOK = '/datapass/webhook',
  INVITATION = '/invitation',
}
