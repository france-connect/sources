import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import type { ISODate } from '@fc/common';
import { getFullName, isoToDate } from '@fc/common';
import type { TableColumnActionsInterface, TableColumnInterface } from '@fc/dsfr';
import { TableComponent } from '@fc/dsfr';

import serviceProviderPermissionsFixture from '../../../__fixtures__/service-provider-permissions.fixture.json';
import { AccessControlPermission } from '../../../enums';
import { useCanManageContributors, useServiceProviderContributors } from '../../../hooks';
import type { ServiceProviderPermissionInterface } from '../../../interfaces';
import { DeleteContributorButton } from '../../buttons';
import { ServiceProviderPermissionsTable } from './service-provider-permissions.table';

jest.mock('../../buttons/delete-contributor/delete-contributor.button');
jest.mock('../../../hooks/can-manage-contributors/can-manage-contributors.hook');
jest.mock('../../../hooks/service-provider-contributors/service-provider-contributors.hook');

describe('ServiceProviderPermissionsTable', () => {
  // Given
  const permissionsMock =
    serviceProviderPermissionsFixture as unknown as ServiceProviderPermissionInterface[];

  const deleteContributorHandlerMock = jest.fn();

  const buildPermission = (permissionType: AccessControlPermission) =>
    ({
      account: { email: 'contributor@example.com', id: 'any-account-id-mock' },
      permissionType,
    }) as unknown as ServiceProviderPermissionInterface;

  type TableProps = {
    actions?: TableColumnActionsInterface<ServiceProviderPermissionInterface>;
    columns?: TableColumnInterface<ServiceProviderPermissionInterface>[];
    sources?: ServiceProviderPermissionInterface[];
  };

  const renderTable = (permissions: ServiceProviderPermissionInterface[] = permissionsMock) => {
    let tableProps = {} as TableProps;

    jest.mocked(TableComponent).mockImplementationOnce((props) => {
      tableProps = props as TableProps;
      return <div>TableComponent</div>;
    });

    render(<ServiceProviderPermissionsTable permissions={permissions} />);

    return tableProps;
  };

  beforeEach(() => {
    // Given
    jest.mocked(getFullName).mockReturnValue('John Doe');
    jest.mocked(isoToDate).mockReturnValue('01/06/2024 14:00');
    jest.mocked(useCanManageContributors).mockReturnValue(true);
    jest.mocked(useServiceProviderContributors).mockReturnValue({
      confirmDeleteContributor: jest.fn(),
      deleteContributorHandler: deleteContributorHandlerMock,
    });
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
        actions: expect.any(Function),
        columns: [
          {
            className: 'fr-text--bold',
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
    // Given
    const { columns } = renderTable();

    // When
    const result = columns?.[0]?.getValue!(permissionsMock[0]);

    // Then
    expect(result).toBe('John Doe');
  });

  it('should translate permission type via getValue column', () => {
    // Given
    const { columns } = renderTable();

    // When
    const result = columns?.[1]?.getValue!(permissionsMock[0]);

    // Then
    expect(result).toBe(`CorePartners.permission.${AccessControlPermission.SP_ADMIN}`);
  });

  it('should lowercase email via format column', () => {
    // Given
    const { columns } = renderTable();

    // When
    const result = columns?.[2]?.format!('John.Doe@Example.com');

    // Then
    expect(result).toBe('john.doe@example.com');
  });

  it('should format last connection via isoToDate', () => {
    // Given
    const { columns } = renderTable();
    const isoDate = '2024-06-01T12:00:00.000Z' as ISODate;

    // When
    columns?.[3]?.format!(isoDate);

    // Then
    expect(isoToDate).toHaveBeenCalledWith(isoDate, DateTime.DATETIME_SHORT);
  });

  it('should not format last connection via isoToDate if value is undefined', () => {
    // Given
    const { columns } = renderTable();

    // When
    const result = columns?.[3]?.format!(undefined);

    // Then
    expect(result).toBeUndefined();
    expect(isoToDate).not.toHaveBeenCalled();
  });

  it('should render a delete button for a contributor through the actions render prop', () => {
    // Given
    const contributorMock = buildPermission(AccessControlPermission.SP_CONTRIBUTOR);
    const { actions } = renderTable();

    // When
    render(<div>{actions?.(contributorMock, 0)}</div>);

    // Then
    expect(DeleteContributorButton).toHaveBeenCalledExactlyOnceWith(
      {
        onDelete: deleteContributorHandlerMock,
        permission: contributorMock,
      },
      undefined,
    );
  });

  it('should not render a delete button for an administrator', () => {
    // Given
    const { actions } = renderTable();

    // When
    const result = actions?.(buildPermission(AccessControlPermission.SP_ADMIN), 0);

    // Then
    expect(result).toBeNull();
    expect(DeleteContributorButton).not.toHaveBeenCalled();
  });

  it('should not render a delete button for a technical contact', () => {
    // Given
    const { actions } = renderTable();

    // When
    const result = actions?.(buildPermission(AccessControlPermission.SP_TECH), 0);

    // Then
    expect(result).toBeNull();
    expect(DeleteContributorButton).not.toHaveBeenCalled();
  });

  it('should not render the actions column when the user can not manage the contributors', () => {
    // Given
    jest.mocked(useCanManageContributors).mockReturnValueOnce(false);

    // When
    render(<ServiceProviderPermissionsTable permissions={permissionsMock} />);

    // Then
    expect(TableComponent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ actions: undefined }),
      undefined,
    );
  });

  it('should not render the actions column when no permission is revocable', () => {
    // Given
    const permissions = [
      buildPermission(AccessControlPermission.SP_ADMIN),
      buildPermission(AccessControlPermission.SP_TECH),
    ];

    // When
    render(<ServiceProviderPermissionsTable permissions={permissions} />);

    // Then
    expect(TableComponent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ actions: undefined }),
      undefined,
    );
  });
});
