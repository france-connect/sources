import { ServiceProvider } from '../../common/types';

const DEFAULT_SP_DESCRIPTION = 'par défaut';

export const getServiceProviderByDescription = (
  serviceProviders: ServiceProvider[],
  description: string,
): ServiceProvider => {
  const serviceProvider: ServiceProvider = serviceProviders.find(
    (serviceProvider) => serviceProvider.descriptions.includes(description),
  );
  expect(
    serviceProvider,
    `No service provider matches the description '${description}'`,
  ).to.exist;
  cy.wrap(serviceProvider).as('serviceProvider');
  return serviceProvider;
};

export const getDefaultServiceProvider = (
  serviceProviders: ServiceProvider[],
): ServiceProvider =>
  getServiceProviderByDescription(serviceProviders, DEFAULT_SP_DESCRIPTION);
