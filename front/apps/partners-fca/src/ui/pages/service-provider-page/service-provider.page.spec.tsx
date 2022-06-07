import { render } from '@testing-library/react';

import { AccountContext, AccountInterface } from '@fc/account';

import { ServiceProviderPage } from './service-provider.page';

describe('ServiceProviderPage', () => {
  const accountContextMock = {
    connected: true,
    ready: false,
    userinfos: {
      firstname: 'firstnameValue',
      lastname: 'lastnameValue',
    },
  } as unknown as AccountInterface;

  beforeEach(() => {});

  it('should match the snapshot when user is connected', () => {
    const { container } = render(
      <AccountContext.Provider value={accountContextMock}>
        <ServiceProviderPage />
      </AccountContext.Provider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when user is connected but userinfos is undefined', () => {
    // given
    const userInfosUndefined = {
      ...accountContextMock,
      userinfos: undefined,
    };

    // when
    const { container } = render(
      <AccountContext.Provider value={userInfosUndefined}>
        <ServiceProviderPage />
      </AccountContext.Provider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when user is not connected', () => {
    // given
    const notConnectedUser = { ...accountContextMock, connected: false };

    // when
    const { container } = render(
      <AccountContext.Provider value={notConnectedUser}>
        <ServiceProviderPage />
      </AccountContext.Provider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });
});
