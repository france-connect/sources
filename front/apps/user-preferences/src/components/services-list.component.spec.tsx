import { render } from '@testing-library/react';

import type { AccountContextState } from '@fc/account';
import { useAccountContext } from '@fc/account';
import type { DashboardUserInfosInterface } from '@fc/core-user-dashboard';

import { ServiceComponent } from './service.component';
import { ServicesListComponent } from './services-list.component';

jest.mock('./service.component');

describe('ServicesListComponent', () => {
  // Given
  const identityProvidersMock = [
    {
      active: false,
      image: 'any-image',
      isChecked: false,
      name: 'any-name-1',
      title: 'any-title',
      uid: 'any-uid-1',
    },
    {
      active: false,
      image: 'any-image',
      isChecked: false,
      name: 'any-name-2',
      title: 'any-title',
      uid: 'any-uid-2',
    },
  ];

  const accountContextState = {
    connected: true,
    expired: false,
    ready: true,
    userinfos: {
      email: 'any email mock',
      firstname: 'any firstname mock',
      idpId: 'any-idp-id',
      lastname: 'any lastname mock',
    },
  };

  beforeEach(() => {
    // Given
    jest.mocked(useAccountContext).mockReturnValue(accountContextState);
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<ServicesListComponent identityProviders={[]} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useAccountContext', () => {
    // When
    render(<ServicesListComponent identityProviders={[]} />);

    // Then
    expect(useAccountContext).toHaveBeenCalledWith();
  });

  it('should call ServiceComponent with a service', () => {
    // When
    render(<ServicesListComponent identityProviders={identityProvidersMock} />);

    // Then
    expect(ServiceComponent).toHaveBeenCalledTimes(2);
    expect(ServiceComponent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ service: identityProvidersMock[0] }),
      undefined,
    );
    expect(ServiceComponent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ service: identityProvidersMock[1] }),
      undefined,
    );
  });

  it('should call a ServiceComponent with params when first element is not allowed to be updated', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({
      ...accountContextState,
      userinfos: { ...accountContextState.userinfos, idpId: identityProvidersMock[0].uid },
    } as AccountContextState<DashboardUserInfosInterface>);

    // When
    render(<ServicesListComponent identityProviders={identityProvidersMock} />);

    // Then
    expect(ServiceComponent).toHaveBeenCalledTimes(2);
    expect(ServiceComponent).toHaveBeenNthCalledWith(
      1,
      { allowToBeUpdated: false, service: identityProvidersMock[0] },
      undefined,
    );
    expect(ServiceComponent).toHaveBeenNthCalledWith(
      2,
      { allowToBeUpdated: true, service: identityProvidersMock[1] },
      undefined,
    );
  });
});
