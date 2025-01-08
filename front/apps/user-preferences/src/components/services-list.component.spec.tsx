import { render } from '@testing-library/react';

import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';

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

  beforeEach(() => {
    // Given
    jest.mocked(useSafeContext).mockReturnValue({ userinfos: {} });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<ServicesListComponent identityProviders={[]} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useSafeContext with AccountContext as parameter', () => {
    // When
    render(<ServicesListComponent identityProviders={[]} />);

    // Then
    expect(useSafeContext).toHaveBeenCalledWith(AccountContext);
  });

  it('should call ServiceComponent with a service', () => {
    // When
    render(<ServicesListComponent identityProviders={identityProvidersMock} />);

    // Then
    expect(ServiceComponent).toHaveBeenCalledTimes(2);
    expect(ServiceComponent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ service: identityProvidersMock[0] }),
      {},
    );
    expect(ServiceComponent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ service: identityProvidersMock[1] }),
      {},
    );
  });

  it('should call a ServiceComponent with params when first element is not allowed to be updated', () => {
    // Given
    const userinfos = { idpId: identityProvidersMock[0].uid };
    jest.mocked(useSafeContext).mockReturnValueOnce({ userinfos });

    // When
    render(<ServicesListComponent identityProviders={identityProvidersMock} />);

    // Then
    expect(ServiceComponent).toHaveBeenCalledTimes(2);
    expect(ServiceComponent).toHaveBeenNthCalledWith(
      1,
      { allowToBeUpdated: false, service: identityProvidersMock[0] },
      {},
    );
    expect(ServiceComponent).toHaveBeenNthCalledWith(
      2,
      { allowToBeUpdated: true, service: identityProvidersMock[1] },
      {},
    );
  });
});
