import { render } from '@testing-library/react';
import React from 'react';

import { AccountContext } from '@fc/account';

import { ServiceComponent } from './service.component';
import { ServicesListComponent } from './services-list.component';

jest.mock('./service.component');

describe('ServicesListComponent', () => {
  // given
  let useContextMock: jest.SpyInstance;
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
    // given
    useContextMock = jest.spyOn(React, 'useContext');
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<ServicesListComponent identityProviders={[]} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call useContext with AccountContext as parameter', () => {
    // when
    render(<ServicesListComponent identityProviders={[]} />);

    // then
    expect(useContextMock).toHaveBeenCalledWith(AccountContext);
  });

  it('should call ServiceComponent with a service', () => {
    // when
    render(<ServicesListComponent identityProviders={identityProvidersMock} />);

    // then
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
    // given
    const userinfos = { idpId: identityProvidersMock[0].uid };
    useContextMock.mockReturnValueOnce({ userinfos });

    // when
    render(<ServicesListComponent identityProviders={identityProvidersMock} />);

    // then
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
