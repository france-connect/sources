import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { AppContext } from '@fc/state-management';
import { renderWithRouter } from '@fc/tests-utils';

import { userInfosMock } from './__fixtures__';
import { LayoutHeaderComponent } from './layout-header.component';
import { LayoutHeaderLogosComponent } from './layout-header-logos.component';
import { LayoutHeaderMenuComponent } from './layout-header-menu.component';
import { DesktopNavigationComponent } from './navigation-desktop';
import { MobileNavigationComponent } from './navigation-mobile';

jest.mock('react-responsive');
jest.mock('../../assets/logo-marianne.component');
jest.mock('./layout-header-menu.component');
jest.mock('./layout-header-logos.component');
jest.mock('./navigation-mobile/mobile-navigation.component');
jest.mock('./navigation-desktop/desktop-navigation.component');

describe('LayoutHeaderComponent', () => {
  // given
  const useMediaQueryMock = mocked(useMediaQuery);
  const accessibleTitle = 'mock-accessible-title';
  const mobileMenuToggleHandlerMock = jest.fn();
  const navigationLinksMock = [expect.any(Object), expect.any(Object)];
  const LogoComponent = jest.fn(() => <div data-testid="mock-logo-component" />);
  const ReturnButtonComponent = jest.fn(() => <div data-testid="mock-return-button" />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call useMediaQuery with params', () => {
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(useMediaQueryMock).toHaveBeenCalledTimes(1);
    expect(useMediaQueryMock).toHaveBeenCalledWith({ query: '(min-width: 992px)' });
  });

  it('should call useContext with AppContext params', () => {
    // given
    const useContextMock = jest.spyOn(React, 'useContext');
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(useContextMock).toHaveBeenCalledTimes(1);
    expect(useContextMock).toHaveBeenCalledWith(AppContext);
  });

  it('should render the header with classes', () => {
    // when
    const { getByRole } = renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    const element = getByRole('banner');
    // then
    expect(element).toHaveClass('LayoutHeaderComponent');
    expect(element).toHaveClass('shadow-bottom');
    expect(element).toHaveClass('mb80');
    expect(element).not.toHaveClass('mb40');
  });

  it('should not have the class mb80 in a mobile viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByRole } = renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    const element = getByRole('banner');
    // then
    expect(element).not.toHaveClass('mb80');
  });

  it('should have the class mb40 in a mobile viewport and return button is defined', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByRole } = renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    const element = getByRole('banner');
    // then
    expect(element).not.toHaveClass('mb80');
  });

  it('should not have the class mb40 in a mobile viewport and return button is not defined', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByRole } = renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    const element = getByRole('banner');
    // then
    expect(element).not.toHaveClass('mb40');
  });

  it('should render the banner-content with classes', () => {
    // when
    const { getByTestId } = renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    const element = getByTestId('banner-content');
    // then
    expect(element).toHaveClass('flex-columns');
    expect(element).toHaveClass('flex-between');
    expect(element).toHaveClass('content-wrapper-lg');
    expect(element).toHaveClass('px16');
    expect(element).toHaveClass('py12');
    expect(element).toHaveClass('items-center');
    expect(element).not.toHaveClass('items-start');
  });

  it('should have the class iems-start in a mobile viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByTestId } = renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    const element = getByTestId('banner-content');
    // then
    expect(element).not.toHaveClass('items-center');
    expect(element).toHaveClass('items-start');
  });

  it('should render LayoutHeaderLogosComponent with params', () => {
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(LayoutHeaderLogosComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderLogosComponent).toHaveBeenCalledWith(
      { logo: LogoComponent, title: accessibleTitle },
      {},
    );
  });

  it('should render LayoutHeaderMenuComponent with params', () => {
    // given
    jest.spyOn(React, 'useContext').mockImplementation(() => userInfosMock);
    jest.spyOn(React, 'useCallback').mockReturnValue(mobileMenuToggleHandlerMock);
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(LayoutHeaderMenuComponent).toHaveBeenCalledTimes(1);
    expect(LayoutHeaderMenuComponent).toHaveBeenCalledWith(
      {
        onMobileMenuOpen: mobileMenuToggleHandlerMock,
        returnButton: ReturnButtonComponent,
        user: userInfosMock,
      },
      {},
    );
  });

  it('should render DesktopNavigationComponent with params if displayed in a desktop viewport, user is connected and navigationItems are valid', () => {
    // given
    const userInfosMockImplem = { ...userInfosMock, connected: true };
    jest.spyOn(React, 'useContext').mockImplementation(() => userInfosMockImplem);
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        navigationItems={navigationLinksMock}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(DesktopNavigationComponent).toHaveBeenCalledTimes(1);
    expect(DesktopNavigationComponent).toHaveBeenCalledWith(
      { navigationLinks: navigationLinksMock },
      {},
    );
  });

  it('should not render DesktopNavigationComponent if not displayed in a desktop viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        navigationItems={navigationLinksMock}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(DesktopNavigationComponent).not.toHaveBeenCalled();
  });

  it('should not render DesktopNavigationComponent if user is null', () => {
    // given
    jest.spyOn(React, 'useContext').mockImplementation(() => null);
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        navigationItems={navigationLinksMock}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(DesktopNavigationComponent).not.toHaveBeenCalled();
  });

  it('should not render DesktopNavigationComponent if navigationItems are not valid', () => {
    // given
    jest.spyOn(React, 'useContext').mockImplementation(() => userInfosMock);
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(DesktopNavigationComponent).not.toHaveBeenCalled();
  });

  it('should render MobileNavigationComponent with params if displayed in a mobile viewport and user is connected', () => {
    // given
    const userInfosMockImplem = { ...userInfosMock, connected: true };
    jest.spyOn(React, 'useContext').mockImplementation(() => userInfosMockImplem);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, expect.any(Function)]);
    jest.spyOn(React, 'useCallback').mockReturnValueOnce(mobileMenuToggleHandlerMock);
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        navigationItems={navigationLinksMock}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(MobileNavigationComponent).toHaveBeenCalledTimes(1);
    expect(MobileNavigationComponent).toHaveBeenCalledWith(
      {
        mobileMenuIsOpen: false,
        navigationLinks: navigationLinksMock,
        onClose: mobileMenuToggleHandlerMock,
        userInfos: userInfosMockImplem.userinfos,
      },
      {},
    );
  });

  it('should not render MobileNavigationComponent if displayed in a desktop viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        navigationItems={navigationLinksMock}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(MobileNavigationComponent).not.toHaveBeenCalled();
  });

  it('should not render MobileNavigationComponent if userinfos are not valid', () => {
    // given
    jest.spyOn(React, 'useContext').mockImplementation(() => null);
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        navigationItems={navigationLinksMock}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(MobileNavigationComponent).not.toHaveBeenCalled();
  });

  it('should render ReturnButton if displayed in a mobile viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(ReturnButtonComponent).toHaveBeenCalledTimes(1);
  });

  it('should not render ReturnButton if displayed in a desktop viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(ReturnButtonComponent).not.toHaveBeenCalled();
  });
});
