import { render } from '@testing-library/react';

import { getFullName, isoToDate } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LinkComponent } from '@fc/dsfr';

import serviceProviderPermissionsFixture from '../../../__fixtures__/service-provider-permissions.fixture.json';
import { ContributorAlert, CreateContributorButton } from '../../../components';
import { ServiceProviderPermissionsTable } from '../../../components/tables';
import { useCanCreateContributor } from '../../../hooks';
import type { ServiceProviderPermissionInterface } from '../../../interfaces';
import { ServiceProviderContributorsComponent } from './service-provider-contributors.component';

jest.mock('../../../components/buttons/create-contributor/create-contributor.button');
jest.mock('../../../components/alerts/contributor/contributor.alert');
jest.mock('../../../hooks/can-create-contributor/can-create-contributor.hook');
jest.mock(
  '../../../components/tables/service-provider-permissions/service-provider-permissions.table',
);

describe('ServiceProviderContributorsComponent', () => {
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
    jest.mocked(useCanCreateContributor).mockReturnValue(true);
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(
      <ServiceProviderContributorsComponent permissions={permissionsMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render ContributorAlert', () => {
    // When
    render(<ServiceProviderContributorsComponent permissions={permissionsMock} />);

    // Then
    expect(ContributorAlert).toHaveBeenCalledExactlyOnceWith({}, undefined);
  });

  it('should render LinkComponent with datapass doc url', () => {
    // When
    render(<ServiceProviderContributorsComponent permissions={permissionsMock} />);

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

  it('should render the CreateContributorButton when useCanCreateContributor returns true', () => {
    // Given
    jest.mocked(useCanCreateContributor).mockReturnValueOnce(true);

    // When
    render(<ServiceProviderContributorsComponent permissions={permissionsMock} />);

    // Then
    expect(CreateContributorButton).toHaveBeenCalledOnce();
  });

  it('should not render the CreateContributorButton when useCanCreateContributor returns false', () => {
    // Given
    jest.mocked(useCanCreateContributor).mockReturnValueOnce(false);

    // When
    render(<ServiceProviderContributorsComponent permissions={permissionsMock} />);

    // Then
    expect(CreateContributorButton).not.toHaveBeenCalled();
  });

  it('should render ServiceProviderPermissionsTable with params', () => {
    // When
    render(<ServiceProviderContributorsComponent permissions={permissionsMock} />);

    // Then
    expect(ServiceProviderPermissionsTable).toHaveBeenCalledWith(
      { permissions: permissionsMock },
      undefined,
    );
  });
});
