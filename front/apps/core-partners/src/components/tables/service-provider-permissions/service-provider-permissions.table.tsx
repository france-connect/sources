import { toLower } from 'lodash';
import { DateTime } from 'luxon';
import React, { useCallback, useMemo } from 'react';

import type { ISODate } from '@fc/common';
import { getFullName, isoToDate } from '@fc/common';
import type { TableColumnActionsInterface, TableColumnInterface } from '@fc/dsfr';
import { TableComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { AccessControlPermission } from '../../../enums';
import { useCanManageContributors, useServiceProviderContributors } from '../../../hooks';
import type { ServiceProviderPermissionInterface } from '../../../interfaces';
import { DeleteContributorButton } from '../../buttons';

interface ServiceProviderPermissionsTableProps {
  permissions: ServiceProviderPermissionInterface[];
}

// @NOTE should be renamed to ServiceProviderContributorsTable
export const ServiceProviderPermissionsTable = React.memo(
  ({ permissions }: ServiceProviderPermissionsTableProps) => {
    const canManageContributors = useCanManageContributors();
    const { deleteContributorHandler } = useServiceProviderContributors();

    // @NOTE tableColumns can not be exported as a static
    // because the `t` function is injected at compilation time
    const tableColumns: TableColumnInterface<ServiceProviderPermissionInterface>[] = useMemo(
      () => [
        {
          className: 'fr-text--bold',
          getValue: (row) => {
            const permission = row;
            const { firstname, lastname } = permission.account;
            return getFullName(firstname, lastname);
          },
          label: t('CorePartners.serviceProvidersPage.permissionsSection.table.name'),
        },
        {
          getValue: (row) => {
            const permission = row;
            const value = t(`CorePartners.permission.${permission.permissionType}`);
            return value;
          },
          label: t('CorePartners.serviceProvidersPage.permissionsSection.table.role'),
        },
        {
          format: (value) => toLower(value as string),
          key: 'account.email',
          label: t('CorePartners.serviceProvidersPage.permissionsSection.table.email'),
        },
        {
          format: (value) => {
            if (!value) {
              return undefined;
            }
            const result = isoToDate(value as ISODate, DateTime.DATETIME_SHORT);
            return result;
          },
          key: 'account.lastConnection',
          label: t('CorePartners.serviceProvidersPage.permissionsSection.table.lastConnection'),
        },
      ],
      [],
    );

    const hasRevocablePermission = useMemo(
      () =>
        permissions.some(
          ({ permissionType }) => permissionType === AccessControlPermission.SP_CONTRIBUTOR,
        ),
      [permissions],
    );

    const tableActions: TableColumnActionsInterface<ServiceProviderPermissionInterface> =
      useCallback(
        (permission: ServiceProviderPermissionInterface) => {
          if (permission.permissionType !== AccessControlPermission.SP_CONTRIBUTOR) {
            return null;
          }

          return (
            <DeleteContributorButton permission={permission} onDelete={deleteContributorHandler} />
          );
        },
        [deleteContributorHandler],
      );

    const showActions = canManageContributors && hasRevocablePermission;

    return (
      <TableComponent<ServiceProviderPermissionInterface>
        multiline
        actions={showActions ? tableActions : undefined}
        columns={tableColumns}
        id="service-provider-permissions"
        sources={permissions}
      />
    );
  },
);

ServiceProviderPermissionsTable.displayName = 'ServiceProviderPermissionsTable';
