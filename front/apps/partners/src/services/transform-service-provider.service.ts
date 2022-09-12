import { DateTime } from 'luxon';

import { t } from '@fc/i18n';
import { ServiceProvider } from '@fc/service-providers';

import { ServiceProviderStatusColors } from '../enums';

export const transformServiceProvider = (item: ServiceProvider) => {
  try {
    const {
      createdAt,
      datapasses,
      id,
      name,
      organisation: { name: organisationName },
      platform: { name: platformName },
      status,
    } = item;

    const [lastDatapass] = datapasses;
    const datapassId = lastDatapass?.remoteId
      ? t('ServiceProvidersPage.ServiceProvider.datapassId', { datapassId: lastDatapass.remoteId })
      : '';

    const createdDatetime = DateTime.fromISO(createdAt).setLocale('fr-FR').setZone('Europe/Paris');
    if (createdDatetime.invalidReason) {
      throw new Error(`spId ${id}: createdAt is not a valid ISO DateTime: '${createdAt}'`);
    }

    const creationDate = createdDatetime.toLocaleString();
    return {
      color: ServiceProviderStatusColors[status as keyof typeof ServiceProviderStatusColors],
      createdAt: t('ServiceProvidersPage.ServiceProvider.creationDate', { creationDate }),
      datapassId,
      id,
      organisationName,
      platformName: t(`ServiceProvidersPage.ServiceProvider.platformName.${platformName}`),
      spName: name,
      status: t(`ServiceProvidersPage.ServiceProvider.status.${status}`),
    };
  } catch (err) {
    throw new Error('Unable to parse service provider payload item');
  }
};
