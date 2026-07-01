import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';

import { LayoutHeaderAccountComponent } from './account';
import { LayoutHeaderToolsComponent } from './layout-header.tools';
import { LayoutHeaderToolsLink } from './link';
import { LayoutHeaderLogoutButton } from './logout';

jest.mock('./logout/layout-header.logout');
jest.mock('./account/layout-header.account');
jest.mock('./link/layout-header.tools-link');

describe('LayoutHeaderToolsComponent', () => {
  // Given
  const toolsLinkAlwaysMock = {
    href: '/always',
    label: 'always link',
  };
  const toolsLinkOnlyIfConnectedMock = {
    href: '/only-logged',
    label: 'only logged link',
    onlyIfConnected: true,
  };
  const accountConfigMock = {
    endpoints: { logout: 'any logout url mock' },
  };
  const layoutConfigMock = {
    header: { toolsLinks: [toolsLinkAlwaysMock, toolsLinkOnlyIfConnectedMock] },
  };

  it('should match the snapshot when user is connected', () => {
    // Given
    jest
      .mocked(ConfigService.get)
      .mockReturnValueOnce(accountConfigMock)
      .mockReturnValueOnce(layoutConfigMock);

    // When
    const { container } = render(<LayoutHeaderToolsComponent isUserConnected />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LayoutHeaderAccountComponent).toHaveBeenCalledExactlyOnceWith({}, undefined);
    expect(LayoutHeaderLogoutButton).toHaveBeenCalledExactlyOnceWith(
      { endSessionUrl: 'any logout url mock' },
      undefined,
    );
  });

  it('should call ConfigService.get with AccountConfig then LayoutConfig names', () => {
    // Given
    jest
      .mocked(ConfigService.get)
      .mockReturnValueOnce(accountConfigMock)
      .mockReturnValueOnce(layoutConfigMock);

    // When
    render(<LayoutHeaderToolsComponent isUserConnected />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledTimes(2);
    expect(ConfigService.get).toHaveBeenNthCalledWith(1, 'Account');
    expect(ConfigService.get).toHaveBeenNthCalledWith(2, 'Layout');
  });

  it('should match the snapshot, when AccountConfig?.endpoints are undefined', () => {
    // Given
    jest
      .mocked(ConfigService.get)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ header: { toolsLinks: [toolsLinkAlwaysMock] } });

    // When
    const { container } = render(<LayoutHeaderToolsComponent isUserConnected />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LayoutHeaderLogoutButton).not.toHaveBeenCalled();
  });

  it('should match the snapshot, when AccountConfig?.endpoints.logout is undefined', () => {
    // Given
    jest
      .mocked(ConfigService.get)
      .mockReturnValueOnce({ endpoints: {} })
      .mockReturnValueOnce({ header: { toolsLinks: [toolsLinkAlwaysMock] } });

    // When
    const { container } = render(<LayoutHeaderToolsComponent isUserConnected />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LayoutHeaderLogoutButton).not.toHaveBeenCalled();
  });

  it('should render all toolsLinks when user is connected', () => {
    // Given
    jest
      .mocked(ConfigService.get)
      .mockReturnValueOnce(accountConfigMock)
      .mockReturnValueOnce(layoutConfigMock);

    // When
    render(<LayoutHeaderToolsComponent isUserConnected />);

    // Then
    expect(LayoutHeaderToolsLink).toHaveBeenCalledTimes(2);
    expect(LayoutHeaderToolsLink).toHaveBeenNthCalledWith(
      1,
      {
        dataTestId: undefined,
        external: undefined,
        href: toolsLinkAlwaysMock.href,
        icon: undefined,
        label: toolsLinkAlwaysMock.label,
        title: undefined,
      },
      undefined,
    );
    expect(LayoutHeaderToolsLink).toHaveBeenNthCalledWith(
      2,
      {
        dataTestId: undefined,
        external: undefined,
        href: toolsLinkOnlyIfConnectedMock.href,
        icon: undefined,
        label: toolsLinkOnlyIfConnectedMock.label,
        title: undefined,
      },
      undefined,
    );
  });

  it('should filter out onlyIfConnected toolsLinks when user is not connected', () => {
    // Given
    jest
      .mocked(ConfigService.get)
      .mockReturnValueOnce(accountConfigMock)
      .mockReturnValueOnce(layoutConfigMock);

    // When
    render(<LayoutHeaderToolsComponent isUserConnected={false} />);

    // Then
    expect(LayoutHeaderToolsLink).toHaveBeenCalledExactlyOnceWith(
      {
        dataTestId: undefined,
        external: undefined,
        href: toolsLinkAlwaysMock.href,
        icon: undefined,
        label: toolsLinkAlwaysMock.label,
        title: undefined,
      },
      undefined,
    );
  });

  it('should not render any toolsLinks when header.toolsLinks is undefined', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce(accountConfigMock).mockReturnValueOnce({});

    // When
    render(<LayoutHeaderToolsComponent isUserConnected />);

    // Then
    expect(LayoutHeaderToolsLink).not.toHaveBeenCalled();
  });

  it('should not render Account nor Logout when user is not connected', () => {
    // Given
    jest
      .mocked(ConfigService.get)
      .mockReturnValueOnce(accountConfigMock)
      .mockReturnValueOnce(layoutConfigMock);

    // When
    render(<LayoutHeaderToolsComponent isUserConnected={false} />);

    // Then
    expect(LayoutHeaderAccountComponent).not.toHaveBeenCalled();
    expect(LayoutHeaderLogoutButton).not.toHaveBeenCalled();
  });
});
