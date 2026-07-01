import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import type { ISODate } from '@fc/common';
import { getFullName, isoToDate } from '@fc/common';
import { TableComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import serviceProviderPermissionsFixture from '../../../__fixtures__/service-provider-permissions.fixture.json';
import { AccessControlPermission } from '../../../enums';
import type { ServiceProviderPermissionInterface } from '../../../interfaces';
import { ServiceProviderPermissionsTable } from './service-provider-permissions.table';

describe('ServiceProviderPermissionsTable', () => {
  // Given
  const permissionsMock =
    serviceProviderPermissionsFixture as unknown as ServiceProviderPermissionInterface[];

  const getTableColumns = () => jest.mocked(TableComponent).mock.calls[0][0].columns;

  beforeEach(() => {
    // Given
    jest.mocked(getFullName).mockReturnValue('John Doe');
    jest.mocked(isoToDate).mockReturnValue('01/06/2024 14:00');
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<ServiceProviderPermissionsTable permissions={permissionsMock} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render TableComponent with params', () => {
    // When
    render(<ServiceProviderPermissionsTable permissions={permissionsMock} />);

    // Then
    expect(TableComponent).toHaveBeenCalledExactlyOnceWith(
      {
        columns: [
          {
            getValue: expect.any(Function),
            label: 'CorePartners.serviceProvidersPage.permissionsSection.table.name',
          },
          {
            getValue: expect.any(Function),
            label: 'CorePartners.serviceProvidersPage.permissionsSection.table.role',
          },
          {
            format: expect.any(Function),
            key: 'account.email',
            label: 'CorePartners.serviceProvidersPage.permissionsSection.table.email',
          },
          {
            format: expect.any(Function),
            key: 'account.lastConnection',
            label: 'CorePartners.serviceProvidersPage.permissionsSection.table.lastConnection',
          },
        ],
        id: 'service-provider-permissions',
        multiline: true,
        sources: permissionsMock,
      },
      undefined,
    );
  });

  it('should resolve full name via getValue column', () => {
    // When
    render(<ServiceProviderPermissionsTable permissions={permissionsMock} />);

    // Then
    const nameColumn = getTableColumns()?.[0];
    const result = nameColumn?.getValue?.(permissionsMock[0]);

    expect(result).toBe('John Doe');
  });

  it('should translate permission type via getValue column', () => {
    // When
    render(<ServiceProviderPermissionsTable permissions={permissionsMock} />);
    const roleColumn = getTableColumns()?.[1];
    const result = roleColumn?.getValue?.(permissionsMock[0]);

    // Then
    expect(t).toHaveBeenCalledWith(`CorePartners.permission.${AccessControlPermission.SP_ADMIN}`);
    expect(result).toBe(`CorePartners.permission.${AccessControlPermission.SP_ADMIN}`);
  });

  it('should lowercase email via format column', () => {
    // When
    render(<ServiceProviderPermissionsTable permissions={permissionsMock} />);
    const emailColumn = getTableColumns()?.[2];
    const formatted = emailColumn?.format?.('John.Doe@Example.com');

    // Then
    expect(formatted).toBe('john.doe@example.com');
  });

  it('should format last connection via isoToDate', () => {
    // When
    render(<ServiceProviderPermissionsTable permissions={permissionsMock} />);
    const dateColumn = getTableColumns()?.[3];
    const isoDate = '2024-06-01T12:00:00.000Z' as ISODate;
    dateColumn?.format?.(isoDate);

    // Then
    expect(isoToDate).toHaveBeenCalledWith(isoDate, DateTime.DATETIME_SHORT);
  });

  it('should not format last connection via isoToDate if value is undefined', () => {
    // When
    render(<ServiceProviderPermissionsTable permissions={permissionsMock} />);
    const dateColumn = getTableColumns()?.[3];
    dateColumn?.format?.(undefined);

    // Then
    expect(isoToDate).not.toHaveBeenCalled();
  });
});
