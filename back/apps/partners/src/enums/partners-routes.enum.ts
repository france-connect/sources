export const enum PartnersRoutes {
  CSRF = '/csrf',
  ME = '/me',
  LOGIN = '/login',
  SERVICE_PROVIDER_LIST = '/service-providers',
  SERVICE_PROVIDER_VIEW = '/service-providers/:id/view',
  SERVICE_PROVIDER_EDIT = '/service-providers/:id/edit',
  SERVICE_PROVIDER_CONFIGURATION_CREATE = '/service-provider-configurations',
  SERVICE_PROVIDER_CONFIGURATION_DELETE = '/service-provider-configurations/:id',
  // New eslint rule
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  SERVICE_PROVIDER_CONFIGURATION_LIST = '/service-provider-configurations',
}
