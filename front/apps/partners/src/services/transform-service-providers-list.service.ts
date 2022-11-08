import { DateTime } from 'luxon';

import { t } from '@fc/i18n';

import { ServiceProvidersPermissionTypes, ServiceProviderStatusColors } from '../enums';
import { ServiceProviders } from '../interfaces';

export const transformServiceProvidersList = (item: ServiceProviders) => {
  try {
    const {
      createdAt,
      datapasses,
      id,
      name,
      organisation: { name: organisationName },
      platform: { name: platformName },
      status,
    } = item.payload;
    const { permissions, urls } = item.meta;

    const [lastDatapass] = datapasses;
    const datapassId = lastDatapass?.remoteId
      ? t('ServiceProvidersPage.ServiceProvider.datapassId', { datapassId: lastDatapass.remoteId })
      : '';

    const createdDatetime = DateTime.fromISO(createdAt).setLocale('fr-FR').setZone('Europe/Paris');
    if (createdDatetime.invalidReason) {
      throw new Error(`spId ${id}: createdAt is not a valid ISO DateTime: '${createdAt}'`);
    }
    const creationDate = createdDatetime.toLocaleString();

    const permission = ServiceProvidersPermissionTypes.SERVICE_PROVIDER_EDIT;
    const detailsUrl = permissions.includes(permission) ? urls.edit : urls.view;

    return {
      color: ServiceProviderStatusColors[status as keyof typeof ServiceProviderStatusColors],
      createdAt: t('ServiceProvidersPage.ServiceProvider.creationDate', { creationDate }),
      datapassId,
      id,
      organisationName,
      platformName: t(`ServiceProvidersPage.ServiceProvider.platformName.${platformName}`),
      spName: name,
      status: t(`ServiceProvidersPage.ServiceProvider.status.${status}`),
      url: detailsUrl,
    };
  } catch (err) {
    throw new Error('Unable to parse service provider payload item');
  }
};
