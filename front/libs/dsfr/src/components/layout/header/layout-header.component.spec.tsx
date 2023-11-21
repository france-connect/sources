import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';

import { AccountContext, AccountInterface } from '@fc/account';
import { AppContextProvider } from '@fc/state-management';

import { LayoutHeaderComponent } from './layout-header.component';
import { LayoutHeaderLogosComponent } from './logos';
import { LayoutHeaderMenuComponent } from './menu';
import { LayoutHeaderMobileBurgerButton } from './mobile-burger-button';
import { ReturnButtonComponent } from './return-button';
import { LayoutHeaderServiceComponent } from './service';
import { LayoutHeaderToolsComponent } from './tools';

jest.mock('./tools/layout-header-tools.component');
jest.mock('./logos/layout-header-logos.component');
jest.mock('./menu/layout-header-menu.component');
jest.mock('./mobile-burger-button/layout-header-mobile-burger.button');
jest.mock('./return-button/return-button.component');
jest.mock('./service/layout-header-service.component');

describe('LayoutHeaderComponent', () => {
  // given
  const navigationItemsMock = [
    { a11y: 'any-a11y-mock-1', href: 'any-href-mock-1', label: 'any-label-mock-1' },
    { a11y: 'any-a11y-mock-2', href: 'any-href-mock-2', label: 'any-label-mock-2' },
  ];

  const accountContextMock = {
    connected: false,
    ready: false,
    userinfos: {
      firstname: expect.any(String),
      lastname: expect.any(String),
    },
  } as unknown as AccountInterface;

  const appContextConfigMock = {
    config: {
      Layout: {
        footerLinkTitle: 'any-title',
        logo: 'any-logo-mock',
        navigationItems: navigationItemsMock,
      },
      OidcClient: { endpoints: {} },
    },
  };

  it('should match the snapshot', () => {
    // when
    const { container } = render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderComponent />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when user is connected', () => {
    // given
    const accountMock = { ...accountContextMock, connected: true, ready: true };

    // when
    const { container } = render(
      <AccountContext.Provider value={accountMock}>
        <AppContextProvider value={appContextConfigMock}>
          <LayoutHeaderComponent />
        </AppContextProvider>
      </AccountContext.Provider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call LayoutHeaderLogosComponent with params', () => {
    // when
    render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderComponent />
      </AppContextProvider>,
    );

    // then
    expect(LayoutHeaderLogosComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderLogosComponent).toHaveBeenCalledWith(
      { logo: 'any-logo-mock', title: 'any-title' },
      {},
    );
  });

  it('should call LayoutHeaderMobileBurgerButton with params when user is connected', () => {
    // given
    const accountMock = { ...accountContextMock, connected: true, ready: true };

    // when
    render(
      <AccountContext.Provider value={accountMock}>
        <AppContextProvider value={appContextConfigMock}>
          <LayoutHeaderComponent />
        </AppContextProvider>
      </AccountContext.Provider>,
    );

    // then
    expect(LayoutHeaderMobileBurgerButton).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderMobileBurgerButton).toHaveBeenCalledWith(
      { onOpen: expect.any(Function), opened: false },
      {},
    );
  });

  it('should call LayoutHeaderToolsComponent with params when user is connected', () => {
    // given
    const accountMock = { ...accountContextMock, connected: true, ready: true };

    // when
    render(
      <AccountContext.Provider value={accountMock}>
        <AppContextProvider value={appContextConfigMock}>
          <LayoutHeaderComponent />
        </AppContextProvider>
      </AccountContext.Provider>,
    );

    // then
    expect(LayoutHeaderToolsComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderToolsComponent).toHaveBeenCalledWith(
      {
        firstname: expect.any(String),
        isDesktopViewport: false,
        isModalMenu: false,
        lastname: expect.any(String),
      },
      {},
    );
  });

  it('should call LayoutHeaderMenuComponent with params when user is connected', () => {
    // given
    const accountMock = { ...accountContextMock, connected: true, ready: true };

    // when
    render(
      <AccountContext.Provider value={accountMock}>
        <AppContextProvider value={appContextConfigMock}>
          <LayoutHeaderComponent />
        </AppContextProvider>
      </AccountContext.Provider>,
    );

    // then
    expect(LayoutHeaderMenuComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderMenuComponent).toHaveBeenCalledWith(
      {
        firstname: expect.any(String),
        isMobile: expect.any(Boolean),
        lastname: expect.any(String),
        navigationItems: navigationItemsMock,
        onClose: expect.any(Function),
        opened: false,
      },
      {},
    );
  });

  it('should not call ReturnButtonComponent into a mobile viewport, if returnButtonUrl is undefined from OidcClient config', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(true);
    const accountMock = { ...accountContextMock, connected: true, ready: true };

    // when
    render(
      <AccountContext.Provider value={accountMock}>
        <AppContextProvider value={appContextConfigMock}>
          <LayoutHeaderComponent />
        </AppContextProvider>
      </AccountContext.Provider>,
    );

    // then
    expect(ReturnButtonComponent).not.toHaveBeenCalled();
  });

  it('should call ReturnButtonComponent into a mobile viewport, if returnButtonUrl is defined from OidcClient config', () => {
    // given
    const returnButtonUrlMock = 'any-returnButtonUrlMock-mock';
    jest.mocked(useMediaQuery).mockReturnValueOnce(true);
    const accountMock = { ...accountContextMock, connected: true, ready: true };

    // when
    render(
      <AccountContext.Provider value={accountMock}>
        <AppContextProvider
          value={{
            config: {
              Layout: {
                logo: 'any-logo-mock',
                navigationItems: navigationItemsMock,
              },
              OidcClient: { endpoints: { returnButtonUrl: returnButtonUrlMock } },
            },
          }}>
          <LayoutHeaderComponent />
        </AppContextProvider>
      </AccountContext.Provider>,
    );

    // then
    expect(ReturnButtonComponent).toHaveBeenCalledTimes(1);
    expect(ReturnButtonComponent).toHaveBeenCalledWith(
      {
        isMobileViewport: true,
        url: returnButtonUrlMock,
      },
      {},
    );
  });

  it('should call LayoutHeaderServiceComponent with params when serice is defined in layout config', () => {
    // given
    const serviceConfigMock = {
      name: 'any-service-name-mock',
    };

    // when
    render(
      <AppContextProvider
        value={{
          config: {
            Layout: {
              logo: 'any-logo-mock',
              navigationItems: navigationItemsMock,
              service: serviceConfigMock,
            },
          },
        }}>
        <LayoutHeaderComponent />
      </AppContextProvider>,
    );

    // then
    expect(LayoutHeaderServiceComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderServiceComponent).toHaveBeenCalledWith(
      {
        service: serviceConfigMock,
      },
      {},
    );
  });
});
