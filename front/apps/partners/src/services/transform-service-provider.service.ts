import { t } from '@fc/i18n';

import { ServiceProviderStatusColors } from '../enums';
import { ServiceProvider } from '../interfaces';

export const transformServiceProvider = (item: ServiceProvider) => {
  try {
    const {
      name,
      platform: { name: platformName },
      status,
    } = item;

    if (!status || !platformName || !name) {
      throw new Error('status, platformName or name is undefined');
    }
    return {
      color: ServiceProviderStatusColors[status as keyof typeof ServiceProviderStatusColors],
      platformName: t(`ServiceProvidersPage.ServiceProvider.platformName.${platformName}`),
      spName: name,
      status: t(`ServiceProvidersPage.ServiceProvider.status.${status}`),
    };
  } catch (err) {
    const isInstanceofError = err instanceof Error;
    const message = isInstanceofError ? `: ${err.message}` : '';

    throw new Error(`Unable to parse service provider payload item ${message}`);
  }
};
