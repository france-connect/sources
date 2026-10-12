import { useMemo } from 'react';

import type { SelectableInterface } from '@fc/common';
import type { TableColumnInterface } from '@fc/dsfr';
import { formatCellValue, TableComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { formatClientId, formatCreatedAt } from '../../../formatters';
import type { InstanceInterface } from '../../../interfaces';

export const ServiceProviderLinkInstancesTable = ({
  selectable,
  sources,
}: {
  selectable: SelectableInterface<InstanceInterface>;
  sources: InstanceInterface[];
}) => {
  const tableColumns: TableColumnInterface<InstanceInterface>[] = useMemo(
    () => [
      {
        className: 'fr-text--bold',
        key: 'currentVersion.data.name',
        label: t('CorePartners.linkInstances.columns.instanceName'),
      },
      {
        format: formatClientId,
        key: 'currentVersion.data.client_id',
        label: t('CorePartners.linkInstances.columns.clientId'),
      },
      {
        format: formatCellValue,
        key: 'currentVersion.data.signupId',
        label: t('CorePartners.linkInstances.columns.datapassRequestId'),
      },
      {
        format: formatCreatedAt,
        key: 'createdAt',
        label: t('CorePartners.linkInstances.columns.createdAt'),
      },
    ],
    [],
  );

  return (
    <TableComponent<InstanceInterface>
      multiline
      columns={tableColumns}
      id="service-provider-link-instances"
      selectable={selectable}
      sources={sources}
      toolbar={{ selectAll: true }}
    />
  );
};

ServiceProviderLinkInstancesTable.displayName = 'ServiceProviderLinkInstancesTable';
