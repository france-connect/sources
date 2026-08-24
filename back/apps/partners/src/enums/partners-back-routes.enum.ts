export enum PartnersBackRoutes {
  INDEX = '/',
  USER_INFO = '/me',
  CSRF_TOKEN = '/csrf-token',
  LOGOUT = '/logout',
  LOGOUT_CALLBACK = '/logout-callback',

  SERVICE_PROVIDERS = '/service-providers',
  SERVICE_PROVIDER = '/service-providers/:serviceProviderId',
  SERVICE_PROVIDER_CREATE_INSTANCE = '/service-providers/:serviceProviderId/instances',
  SERVICE_PROVIDER_INSTANCE_FORM_METADATA = '/service-providers/:serviceProviderId/versions/form-metadata',
  SERVICE_PROVIDER_CONTRIBUTORS = '/service-providers/:serviceProviderId/contributors',

  SP_INSTANCES = '/instances',
  SP_INSTANCE = '/instances/:instanceId',

  LINKABLE_INSTANCES = '/linkable-instances/:serviceProviderId',
  LINK_INSTANCES = '/link-instances',

  SP_VERSION_FORM_METADATA = '/versions/form-metadata',

  SP_CONTRIBUTORS_FORM_METADATA = '/contributors/form-metadata',

  DATAPASS_WEBHOOK = '/datapass/webhook',
}
