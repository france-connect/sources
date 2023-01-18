import { render } from '@testing-library/react';

import { AppContextProvider } from '@fc/state-management';

import { ReturnButtonComponent } from '../return-button';
import { LayoutHeaderToolsComponent } from './layout-header-tools.component';
import { LayoutHeaderToolsAccountComponent } from './layout-header-tools-account.component';
import { LayoutHeaderToolsLogoutButton } from './layout-header-tools-logout.button';

jest.mock('./layout-header-tools-logout.button');
jest.mock('./layout-header-tools-account.component');
jest.mock('../return-button/return-button.component');

describe('LayoutHeaderToolsComponent', () => {
  it('should match the snapshot', () => {
    // given
    const appContextConfigMock = {
      config: {
        // @TODO refacto OidcClient
        OidcClient: { endpoints: { endSessionUrl: undefined, returnButtonUrl: undefined } },
      },
    };

    // when
    const { container } = render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when OidcClient is not defined', () => {
    // given
    const appContextConfigMock = {
      config: {},
    };

    // when
    const { container } = render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent isModalMenu />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when OidcClient.endpoints is not defined', () => {
    // given
    const appContextConfigMock = {
      config: {
        // @TODO refacto OidcClient
        OidcClient: {},
      },
    };

    // when
    const { container } = render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent isModalMenu />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when isModalMenu is true', () => {
    // given
    const appContextConfigMock = {
      config: {
        // @TODO refacto OidcClient
        OidcClient: { endpoints: { endSessionUrl: undefined, returnButtonUrl: undefined } },
      },
    };

    // when
    const { container } = render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent isModalMenu />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when isMobile is true and returnButtonUrl is defined', () => {
    // given
    const appContextConfigMock = {
      config: {
        OidcClient: {
          // @TODO refacto OidcClient
          endpoints: { endSessionUrl: undefined, returnButtonUrl: expect.any(String) },
        },
      },
    };

    // when
    const { container } = render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent isDesktopViewport />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when user is connected but endSessionUrl is not defined', () => {
    // given
    const appContextConfigMock = {
      config: {
        OidcClient: {
          // @TODO refacto OidcClient
          endpoints: { endSessionUrl: undefined, returnButtonUrl: expect.any(String) },
        },
      },
    };

    // when
    const { container } = render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent firstname="any-firstname-mock" lastname="any-lastname-mock" />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when user is connected and endSessionUrl is defined', () => {
    // given
    const appContextConfigMock = {
      config: {
        OidcClient: {
          // @TODO refacto OidcClient
          endpoints: { endSessionUrl: expect.any(String), returnButtonUrl: expect.any(String) },
        },
      },
    };

    // when
    const { container } = render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent firstname="any-firstname-mock" lastname="any-lastname-mock" />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call LayoutHeaderToolsLogoutButton with props', () => {
    // given
    const appContextConfigMock = {
      config: {
        OidcClient: {
          endpoints: {
            endSessionUrl: 'any-endSessionUrl-mock',
            // @TODO refacto OidcClient
            returnButtonUrl: expect.any(String),
          },
        },
      },
    };

    // when
    render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent firstname="any-firstname-mock" lastname="any-lastname-mock" />
      </AppContextProvider>,
    );

    // then
    expect(LayoutHeaderToolsLogoutButton).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderToolsLogoutButton).toHaveBeenCalledWith(
      {
        endSessionUrl: 'any-endSessionUrl-mock',
        isMobile: false,
      },
      {},
    );
  });

  it('should call LayoutHeaderToolsLogoutButton with props, when isModalMenu is true', () => {
    // given
    const appContextConfigMock = {
      config: {
        OidcClient: {
          endpoints: {
            endSessionUrl: 'any-endSessionUrl-mock',
            // @TODO refacto OidcClient
            returnButtonUrl: expect.any(String),
          },
        },
      },
    };

    // when
    render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent
          isModalMenu
          firstname="any-firstname-mock"
          lastname="any-lastname-mock"
        />
      </AppContextProvider>,
    );

    // then
    expect(LayoutHeaderToolsLogoutButton).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderToolsLogoutButton).toHaveBeenCalledWith(
      {
        endSessionUrl: 'any-endSessionUrl-mock',
        isMobile: true,
      },
      {},
    );
  });

  it('should match the snapshot, when all props and config are defined', () => {
    // given
    const appContextConfigMock = {
      config: {
        OidcClient: {
          // @TODO refacto OidcClient
          endpoints: { endSessionUrl: expect.any(String), returnButtonUrl: expect.any(String) },
        },
      },
    };

    // when
    const { container } = render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent
          isDesktopViewport
          isModalMenu
          firstname="any-firstname-mock"
          lastname="any-lastname-mock"
        />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call LayoutHeaderToolsAccountComponent with props', () => {
    // given
    const appContextConfigMock = {
      config: {
        // @TODO refacto OidcClient
        OidcClient: { endpoints: { endSessionUrl: undefined, returnButtonUrl: undefined } },
      },
    };

    // when
    render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent firstname="any-firstname-mock" lastname="any-lastname-mock" />
      </AppContextProvider>,
    );

    // then
    expect(LayoutHeaderToolsAccountComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderToolsAccountComponent).toHaveBeenCalledWith(
      {
        firstname: 'any-firstname-mock',
        isMobile: false,
        lastname: 'any-lastname-mock',
      },
      {},
    );
  });

  it('should call LayoutHeaderToolsAccountComponent with props when isModalMenu is true', () => {
    // given
    const appContextConfigMock = {
      config: {
        // @TODO refacto OidcClient
        OidcClient: { endpoints: { endSessionUrl: undefined, returnButtonUrl: undefined } },
      },
    };

    // when
    render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent
          isModalMenu
          firstname="any-firstname-mock"
          lastname="any-lastname-mock"
        />
      </AppContextProvider>,
    );

    // then
    expect(LayoutHeaderToolsAccountComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderToolsAccountComponent).toHaveBeenCalledWith(
      {
        firstname: 'any-firstname-mock',
        isMobile: true,
        lastname: 'any-lastname-mock',
      },
      {},
    );
  });

  it('should call ReturnButtonComponent', () => {
    // given
    const appContextConfigMock = {
      config: {
        OidcClient: {
          // @TODO refacto OidcClient
          endpoints: { endSessionUrl: undefined, returnButtonUrl: 'any-returnButtonUrl-mock' },
        },
      },
    };

    // when
    render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent isDesktopViewport />
      </AppContextProvider>,
    );

    // then
    expect(ReturnButtonComponent).toHaveBeenCalledTimes(1);
    expect(ReturnButtonComponent).toHaveBeenCalledWith({ url: 'any-returnButtonUrl-mock' }, {});
  });

  it('should not call ReturnButtonComponent when OidcClient is undefined', () => {
    // given
    const appContextConfigMock = {
      config: {},
    };

    // when
    render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHeaderToolsComponent isDesktopViewport />
      </AppContextProvider>,
    );

    // then
    expect(ReturnButtonComponent).not.toHaveBeenCalled();
  });
});
