import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';

import { ReturnButtonComponent } from '../return-button';
import { LayoutHeaderToolsComponent } from './layout-header-tools.component';
import { LayoutHeaderToolsAccountComponent } from './layout-header-tools-account.component';
import { LayoutHeaderToolsLogoutButton } from './layout-header-tools-logout.button';

jest.mock('./layout-header-tools-logout.button');
jest.mock('./layout-header-tools-account.component');
jest.mock('../return-button/return-button.component');

jest.mock('@fc/config', () => ({
  ConfigService: {
    get: jest.fn(() => ({ endpoints: { endSessionUrl: undefined, returnButtonUrl: undefined } })),
  },
}));

describe('LayoutHeaderToolsComponent', () => {
  it('should call ConfigService.get with OidcClient config name', () => {
    // when
    render(<LayoutHeaderToolsComponent />);

    // then
    expect(ConfigService.get).toHaveBeenCalledWith('OidcClient');
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutHeaderToolsComponent />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when OidcClient?.endpoints are undefined', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({});

    // when
    const { container } = render(<LayoutHeaderToolsComponent isModalMenu />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when isModalMenu is true', () => {
    // when
    const { container } = render(<LayoutHeaderToolsComponent isModalMenu />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when isMobile is true and returnButtonUrl is defined', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      endpoints: { endSessionUrl: undefined, returnButtonUrl: expect.any(String) },
    });

    // when
    const { container } = render(<LayoutHeaderToolsComponent isDesktopViewport />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when user is connected but endSessionUrl is not defined', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      endpoints: { endSessionUrl: undefined, returnButtonUrl: expect.any(String) },
    });

    // when
    const { container } = render(
      <LayoutHeaderToolsComponent firstname="any-firstname-mock" lastname="any-lastname-mock" />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when user is connected and endSessionUrl is defined', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      endpoints: { endSessionUrl: expect.any(String), returnButtonUrl: expect.any(String) },
    });

    // when
    const { container } = render(
      <LayoutHeaderToolsComponent firstname="any-firstname-mock" lastname="any-lastname-mock" />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call LayoutHeaderToolsLogoutButton with props', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      endpoints: { endSessionUrl: 'any-endSessionUrl-mock', returnButtonUrl: expect.any(String) },
    });

    // when
    render(
      <LayoutHeaderToolsComponent firstname="any-firstname-mock" lastname="any-lastname-mock" />,
    );

    // then
    expect(LayoutHeaderToolsLogoutButton).toHaveBeenCalledOnce();
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
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      endpoints: { endSessionUrl: 'any-endSessionUrl-mock', returnButtonUrl: expect.any(String) },
    });

    // when
    render(
      <LayoutHeaderToolsComponent
        isModalMenu
        firstname="any-firstname-mock"
        lastname="any-lastname-mock"
      />,
    );

    // then
    expect(LayoutHeaderToolsLogoutButton).toHaveBeenCalledOnce();
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
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      endpoints: { endSessionUrl: expect.any(String), returnButtonUrl: expect.any(String) },
    });

    // when
    const { container } = render(
      <LayoutHeaderToolsComponent
        isDesktopViewport
        isModalMenu
        firstname="any-firstname-mock"
        lastname="any-lastname-mock"
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call LayoutHeaderToolsAccountComponent with props', () => {
    // when
    render(
      <LayoutHeaderToolsComponent firstname="any-firstname-mock" lastname="any-lastname-mock" />,
    );

    // then
    expect(LayoutHeaderToolsAccountComponent).toHaveBeenCalledOnce();
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
    // when
    render(
      <LayoutHeaderToolsComponent
        isModalMenu
        firstname="any-firstname-mock"
        lastname="any-lastname-mock"
      />,
    );

    // then
    expect(LayoutHeaderToolsAccountComponent).toHaveBeenCalledOnce();
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
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      endpoints: { endSessionUrl: undefined, returnButtonUrl: 'any-returnButtonUrl-mock' },
    });

    // when
    render(<LayoutHeaderToolsComponent isDesktopViewport />);

    // then
    expect(ReturnButtonComponent).toHaveBeenCalledOnce();
    expect(ReturnButtonComponent).toHaveBeenCalledWith({ url: 'any-returnButtonUrl-mock' }, {});
  });

  it('should not call ReturnButtonComponent when OidcClient is undefined', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({});

    // when
    render(<LayoutHeaderToolsComponent isDesktopViewport />);

    // then
    expect(ReturnButtonComponent).not.toHaveBeenCalled();
  });
});
