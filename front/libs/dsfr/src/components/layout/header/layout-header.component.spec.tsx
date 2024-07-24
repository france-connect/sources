import { fireEvent, render } from '@testing-library/react';
import { useToggle } from 'usehooks-ts';

import type { AccountInterface } from '@fc/account';
import { AccountContext } from '@fc/account';
import { ConfigService } from '@fc/config';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { LayoutHeaderComponent } from './layout-header.component';
import { LayoutHeaderLogosComponent } from './logos';
import { LayoutHeaderMenuComponent } from './menu';
import { LayoutHeaderMobileBurgerButton } from './mobile-burger-button';
import { ReturnButtonComponent } from './return-button';
import { LayoutHeaderServiceComponent } from './service';
import { LayoutHeaderToolsComponent } from './tools';

jest.mock('@fc/styles');
jest.mock('./tools/layout-header-tools.component');
jest.mock('./logos/layout-header-logos.component');
jest.mock('./menu/layout-header-menu.component');
jest.mock('./mobile-burger-button/layout-header-mobile-burger.button');
jest.mock('./return-button/return-button.component');
jest.mock('./service/layout-header-service.component');

jest.mock('@fc/config', () => ({
  ConfigService: {
    get: jest.fn(),
  },
}));

describe('LayoutHeaderComponent', () => {
  // given
  const navigationItemsMock = [
    { href: 'any-href-mock-1', label: 'any-label-mock-1', title: 'any-title-mock-1' },
    { href: 'any-href-mock-2', label: 'any-label-mock-2', title: 'any-title-mock-2' },
  ];

  const layoutConfigMock = {
    footerLinkTitle: 'any-title',
    logo: 'any-logo-mock',
    navigationItems: navigationItemsMock,
  };

  const accountContextMock = {
    connected: false,
    ready: false,
    userinfos: {
      firstname: expect.any(String),
      lastname: expect.any(String),
    },
  } as unknown as AccountInterface;

  beforeEach(() => {
    // given
    jest
      .mocked(ConfigService.get)
      .mockReturnValueOnce(layoutConfigMock)
      .mockReturnValueOnce({ endpoints: {} });
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValueOnce([expect.any(Number), expect.any(Number)]);
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutHeaderComponent />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call toggle wrapped when calling onOpen on LayoutHeaderMobileBurgerButton', () => {
    // given
    const accountMock = { ...accountContextMock, connected: true, ready: true };
    const toggleFunctionMock = jest.fn();
    jest
      .mocked(useToggle)
      .mockReturnValueOnce([expect.any(Boolean), toggleFunctionMock, expect.any(Function)]);

    // when
    const { getByTestId } = render(
      <AccountContext.Provider value={accountMock}>
        <LayoutHeaderComponent />
      </AccountContext.Provider>,
    );
    // @NOTE we are using LayoutHeaderMobileBurgerButton toggle button mock
    // to simulate a click event and calling the useCallback function
    const button = getByTestId('LayoutHeaderMobileBurgerButton-button-mock');
    fireEvent.click(button);

    // then
    expect(toggleFunctionMock).toHaveBeenCalledOnce();
  });

  it('should call toggle wrapped when calling onClose on LayoutHeaderMenuComponent', () => {
    // given
    const accountMock = { ...accountContextMock, connected: true, ready: true };
    const toggleFunctionMock = jest.fn();
    jest
      .mocked(useToggle)
      .mockReturnValueOnce([expect.any(Boolean), toggleFunctionMock, expect.any(Function)]);

    // when
    const { getByTestId } = render(
      <AccountContext.Provider value={accountMock}>
        <LayoutHeaderComponent />
      </AccountContext.Provider>,
    );
    // @NOTE we are using LayoutHeaderMobileBurgerButton toggle button mock
    // to simulate a click event and calling the useCallback function
    const button = getByTestId('LayoutHeaderMenuComponent-button-mock');
    fireEvent.click(button);

    // then
    expect(toggleFunctionMock).toHaveBeenCalledOnce();
  });

  it('should match the snapshot, when user is connected', () => {
    // given
    const accountMock = { ...accountContextMock, connected: true, ready: true };

    // when
    const { container } = render(
      <AccountContext.Provider value={accountMock}>
        <LayoutHeaderComponent />
      </AccountContext.Provider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call LayoutHeaderLogosComponent with params', () => {
    // when
    render(<LayoutHeaderComponent />);

    // then
    expect(LayoutHeaderLogosComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderLogosComponent).toHaveBeenCalledWith(
      { logo: 'any-logo-mock', title: 'any-title' },
      {},
    );
  });

  it('should call LayoutHeaderMobileBurgerButton with params when user is connected', () => {
    // given
    const accountMock = { ...accountContextMock, connected: true, ready: true };

    const toggleValueMock = true;
    jest
      .mocked(useToggle)
      .mockReturnValueOnce([toggleValueMock, expect.any(Function), expect.any(Function)]);

    // when
    render(
      <AccountContext.Provider value={accountMock}>
        <LayoutHeaderComponent />
      </AccountContext.Provider>,
    );

    // then
    expect(LayoutHeaderMobileBurgerButton).toHaveBeenCalledOnce();
    expect(LayoutHeaderMobileBurgerButton).toHaveBeenCalledWith(
      { onOpen: expect.any(Function), opened: toggleValueMock },
      {},
    );
  });

  it('should call LayoutHeaderToolsComponent with params when user is connected', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValue(true);
    const accountMock = { ...accountContextMock, connected: true, ready: true };

    // when
    render(
      <AccountContext.Provider value={accountMock}>
        <LayoutHeaderComponent />
      </AccountContext.Provider>,
    );

    // then
    expect(LayoutHeaderToolsComponent).toHaveBeenCalledOnce();
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
    jest.mocked(useStylesQuery).mockReturnValue(false);
    const accountMock = { ...accountContextMock, connected: true, ready: true };

    const toggleValueMock = true;
    jest
      .mocked(useToggle)
      .mockReturnValueOnce([toggleValueMock, expect.any(Function), expect.any(Function)]);

    // when
    render(
      <AccountContext.Provider value={accountMock}>
        <LayoutHeaderComponent />
      </AccountContext.Provider>,
    );

    // then
    expect(LayoutHeaderMenuComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderMenuComponent).toHaveBeenCalledWith(
      {
        firstname: expect.any(String),
        isMobile: expect.any(Boolean),
        lastname: expect.any(String),
        navigationItems: navigationItemsMock,
        onClose: expect.any(Function),
        opened: toggleValueMock,
      },
      {},
    );
  });

  it('should not call ReturnButtonComponent into a mobile viewport, if returnButtonUrl is undefined from OidcClient config', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    const accountMock = { ...accountContextMock, connected: true, ready: true };

    // when
    render(
      <AccountContext.Provider value={accountMock}>
        <LayoutHeaderComponent />
      </AccountContext.Provider>,
    );

    // then
    expect(ReturnButtonComponent).not.toHaveBeenCalled();
  });

  it('should call ReturnButtonComponent into a mobile viewport, if returnButtonUrl is defined from OidcClient config', () => {
    // given
    const returnButtonUrlMock = 'any-returnButtonUrlMock-mock';

    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    jest
      .mocked(ConfigService.get)
      .mockReset()
      .mockReturnValueOnce(layoutConfigMock)
      .mockReturnValueOnce({ endpoints: { returnButtonUrl: returnButtonUrlMock } });

    const accountMock = { ...accountContextMock, connected: true, ready: true };

    // when
    render(
      <AccountContext.Provider value={accountMock}>
        <LayoutHeaderComponent />
      </AccountContext.Provider>,
    );

    // then
    expect(ReturnButtonComponent).toHaveBeenCalledOnce();
    expect(ReturnButtonComponent).toHaveBeenCalledWith(
      {
        isMobileViewport: true,
        url: returnButtonUrlMock,
      },
      {},
    );
  });

  it('should call LayoutHeaderServiceComponent with params when service is defined in layout config', () => {
    // given
    const serviceConfigMock = {
      name: 'any-service-name-mock',
    };

    jest
      .mocked(ConfigService.get)
      .mockReset()
      .mockReturnValueOnce({
        logo: 'any-logo-mock',
        navigationItems: navigationItemsMock,
        service: serviceConfigMock,
      })
      .mockReturnValueOnce({ endpoints: {} });

    // when
    render(<LayoutHeaderComponent />);

    // then
    expect(LayoutHeaderServiceComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderServiceComponent).toHaveBeenCalledWith(
      {
        service: serviceConfigMock,
      },
      {},
    );
  });
});
