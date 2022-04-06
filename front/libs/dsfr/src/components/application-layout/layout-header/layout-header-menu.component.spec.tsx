import { render } from '@testing-library/react';
import { RiMenuFill } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { UserinfosInterface } from '@fc/oidc-client';

import { userInfosMock } from './__fixtures__';
import { LayoutHeaderMenuComponent } from './layout-header-menu.component';
import { LogoutButtonComponent } from './logout-button';
import { UserWidgetComponent } from './user-widget';

// given
const onMobileMenuOpenMock = jest.fn();
const ReturnButtonMock = jest.fn(() => <div>ReturnButtonMock</div>);

jest.mock('react-icons/ri');
jest.mock('./user-widget/user-widget.component');
jest.mock('./logout-button/logout-button.component');

describe('LayoutHeaderMenuComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have the classes for the expected behavior', () => {
    // when
    const { container } = render(
      <LayoutHeaderMenuComponent
        userInfos={userInfosMock}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    const element = container.firstChild;
    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('LayoutHeaderComponent-menu');
    expect(element).toHaveClass('flex-rows');
    expect(element).toHaveClass('items-end');
  });

  it('should call useMediaQuery with params', () => {
    // when
    render(
      <LayoutHeaderMenuComponent
        userInfos={userInfosMock}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    // then
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenCalledWith({ query: '(min-width: 768px)' });
  });

  it('should have the classes for a desktop viewport', () => {
    //
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { container } = render(
      <LayoutHeaderMenuComponent
        userInfos={userInfosMock}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    const element = container.firstChild;
    // then
    expect(element).toHaveClass('flex-2');
    expect(element).not.toHaveClass('no-flex');
  });

  it('should have the classes for a mobile viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(
      <LayoutHeaderMenuComponent
        userInfos={userInfosMock}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    const element = container.firstChild;
    // then
    expect(element).not.toHaveClass('flex-2');
    expect(element).toHaveClass('no-flex');
  });

  it('should have the class if userinfos is valid, displayed in a desktop viewport and return button is defined', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { getByTestId } = render(
      <LayoutHeaderMenuComponent
        returnButton={ReturnButtonMock}
        userInfos={userInfosMock}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    const elment = getByTestId('layout-header-component-menu-items');
    // then
    expect(elment).toHaveClass('mt16');
  });

  it('should not have the class if userinfos is valid, displayed in a desktop viewport and return button is not defined', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { getByTestId } = render(
      <LayoutHeaderMenuComponent
        userInfos={userInfosMock}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    const elment = getByTestId('layout-header-component-menu-items');
    // then
    expect(elment).not.toHaveClass('mt16');
  });

  it('should render the return button displayed in a desktop viewport if defined', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    render(
      <LayoutHeaderMenuComponent
        returnButton={ReturnButtonMock}
        userInfos={userInfosMock}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    // then
    expect(ReturnButtonMock).toHaveBeenCalledTimes(1);
  });

  it('should render a buger button when displayed with an icon in a mobile viewport and user infos are valid', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByRole } = render(
      <LayoutHeaderMenuComponent
        userInfos={userInfosMock}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    const element = getByRole('button');
    // then
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('BUTTON');
    expect(element).toHaveClass('text-right');
    expect(element).toHaveAttribute('type', 'button');
  });

  it('should not render the buger button when displayed in a mobile viewport and user infos are not valid', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByRole } = render(
      <LayoutHeaderMenuComponent
        userInfos={userInfosMock}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    const element = getByRole('button');
    // then
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('BUTTON');
    expect(element).toHaveClass('text-right');
    expect(element).toHaveAttribute('type', 'button');
    expect(RiMenuFill).toHaveBeenCalledTimes(1);
  });

  it('should render the user widget and the logout button when displayed in a desktop viewport and user infos not valid', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    render(
      <LayoutHeaderMenuComponent
        userInfos={userInfosMock}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    // then
    expect(LogoutButtonComponent).toHaveBeenCalledTimes(1);
    expect(UserWidgetComponent).toHaveBeenCalledTimes(1);
    expect(UserWidgetComponent).toHaveBeenCalledWith({ userInfos: userInfosMock }, {});
  });

  it('should not render the user widget and the logout button when displayed in a desktop viewport and user infos is undefined', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    render(
      <LayoutHeaderMenuComponent
        userInfos={undefined as unknown as UserinfosInterface}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    // then
    expect(LogoutButtonComponent).not.toHaveBeenCalled();
    expect(UserWidgetComponent).not.toHaveBeenCalled();
  });

  it('should not render the user widget and the logout button when displayed in a desktop viewport and user infos are not valid', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    const invalidUserInfosMock = {
      ...userInfosMock,
      // oidc spec defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name: String(),
      // oidc spec defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: String(),
    };
    // when
    render(
      <LayoutHeaderMenuComponent
        userInfos={invalidUserInfosMock}
        onMobileMenuOpen={onMobileMenuOpenMock}
      />,
    );
    // then
    expect(LogoutButtonComponent).not.toHaveBeenCalled();
    expect(UserWidgetComponent).not.toHaveBeenCalled();
  });
});
