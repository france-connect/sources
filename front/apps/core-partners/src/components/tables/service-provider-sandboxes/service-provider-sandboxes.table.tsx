import React, { useCallback, useMemo } from 'react';

import type { ISODate } from '@fc/common';
import { getFullName, isoToDate, truncateMiddle } from '@fc/common';
import type { TableColumnActionsInterface, TableColumnInterface } from '@fc/dsfr';
import { TableComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import type { InstanceInterface } from '../../../interfaces';
import { DeleteInstanceButton } from '../../buttons';

interface ServiceProviderSandboxesTableProps {
  sandboxes: InstanceInterface[];
  onDelete: (instance: InstanceInterface) => void;
}

export const ServiceProviderSandboxesTable = React.memo(
  ({ onDelete, sandboxes }: ServiceProviderSandboxesTableProps) => {
    const tableColumns: TableColumnInterface<InstanceInterface>[] = useMemo(
      () => [
        {
          key: 'currentVersion.data.name',
          label: t('Partners.serviceProviderPage.sandboxes.columns.instanceName'),
          styles: 'fr-text--bold',
        },
        {
          getValue: (row) => {
            const { firstname, lastname } = row.creator ?? {};
            return getFullName(firstname, lastname);
          },
          label: t('Partners.serviceProviderPage.sandboxes.columns.createdBy'),
        },
        {
          format: (value) => truncateMiddle(value as string),
          key: 'currentVersion.data.client_id',
          label: t('Partners.serviceProviderPage.sandboxes.columns.clientId'),
        },
        {
          format: (value) => isoToDate(value as ISODate),
          key: 'createdAt',
          label: t('Partners.serviceProviderPage.sandboxes.columns.createdAt'),
        },
      ],
      [],
    );

    const tableActions: TableColumnActionsInterface<InstanceInterface> = useCallback(
      (instance: InstanceInterface) => (
        <DeleteInstanceButton instance={instance} onDelete={onDelete} />
      ),
      [onDelete],
    );

    return (
      <TableComponent<InstanceInterface>
        multiline
        actions={tableActions}
        columns={tableColumns}
        id="service-provider-sandboxes-table"
        sources={sandboxes}
      />
    );
  },
);

ServiceProviderSandboxesTable.displayName = 'ServiceProviderSandboxesTable';
