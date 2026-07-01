import { render } from '@testing-library/react';

import { getFullName, isoToDate } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LinkComponent } from '@fc/dsfr';

import serviceProviderPermissionsFixture from '../../../__fixtures__/service-provider-permissions.fixture.json';
import { ServiceProviderPermissionsTable } from '../../../components/tables';
import type { ServiceProviderPermissionInterface } from '../../../interfaces';
import { ServiceProviderPermissionsComponent } from './service-provider-permissions.component';

jest.mock(
  '../../../components/tables/service-provider-permissions/service-provider-permissions.table',
);

describe('ServiceProviderPermissionsComponent', () => {
  // Given
  const datapassDocUrlMock = 'https://example.com/datapass-doc-mock';
  const permissionsMock =
    serviceProviderPermissionsFixture as unknown as ServiceProviderPermissionInterface[];

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      datapassDocUrl: datapassDocUrlMock,
    });
    jest.mocked(getFullName).mockReturnValue('John Doe');
    jest.mocked(isoToDate).mockReturnValue('01/06/2024 14:00');
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(
      <ServiceProviderPermissionsComponent permissions={permissionsMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render LinkComponent with datapass doc url', () => {
    // When
    render(<ServiceProviderPermissionsComponent permissions={permissionsMock} />);

    // Then
    expect(LinkComponent).toHaveBeenCalledWith(
      {
        children: 'Partners.serviceProviderPage.usersSection.description.link',
        external: true,
        href: datapassDocUrlMock,
      },
      undefined,
    );
  });

  it('should render ServiceProviderPermissionsTable with params', () => {
    // When
    render(<ServiceProviderPermissionsComponent permissions={permissionsMock} />);

    // Then
    expect(ServiceProviderPermissionsTable).toHaveBeenCalledWith(
      { permissions: permissionsMock },
      undefined,
    );
  });
});
