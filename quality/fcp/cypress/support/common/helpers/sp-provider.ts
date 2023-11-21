import { ServiceProvider } from '../../common/types';

const DEFAULT_SP_DESCRIPTION = 'par défaut';

export const getServiceProviderNameByDescription = (
  serviceProviders: ServiceProvider[],
  description: string,
  shouldExist = true,
): string | undefined => {
  const { name: spName } =
    getServiceProviderByDescription(
      serviceProviders,
      description,
      shouldExist,
    ) ?? {};

  return spName;
};

export const getServiceProviderByDescription = (
  serviceProviders: ServiceProvider[],
  description: string,
  shouldExist = true,
): ServiceProvider | undefined => {
  const serviceProvider: ServiceProvider = serviceProviders.find(
    (serviceProvider) => serviceProvider.descriptions.includes(description),
  );
  if (shouldExist) {
    expect(
      serviceProvider,
      `No service provider matches the description '${description}'`,
    ).to.exist;
  }
  return serviceProvider;
};

export const getDefaultServiceProvider = (
  serviceProviders: ServiceProvider[],
): ServiceProvider =>
  getServiceProviderByDescription(serviceProviders, DEFAULT_SP_DESCRIPTION);
