import { render } from '@testing-library/react';
import Modal from 'react-modal';

import { userInfosMock } from '../__fixtures__/userinfos.fixture';
import { LogoutButtonComponent } from '../logout-button';
import { NavigationLinksComponent } from '../navigation-links';
import { UserWidgetComponent } from '../user-widget';
import { MobileNavigationComponent } from './mobile-navigation.component';
import { MobileNavigationCloseButtonComponent } from './mobile-navigation-close-button.component';

jest.mock('react-modal');
jest.mock('../user-widget/user-widget.component');
jest.mock('../logout-button/logout-button.component');
jest.mock('./mobile-navigation-close-button.component');
jest.mock('../navigation-links/navigation-links.component');

describe('MobileNavigationComponent', () => {
  // given
  const onCloseMock = jest.fn();
  const linksMock = [expect.any(Object), expect.any(Object)];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call Modal with the classes for the expected behavior params', () => {
    // when
    render(<MobileNavigationComponent mobileMenuIsOpen={false} onClose={onCloseMock} />);
    // then
    expect(Modal).toHaveBeenCalledTimes(1);
    expect(Modal).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'MobileNavigationComponent is-absolute fs14 lh24 py20',
        overlayClassName: 'MobileNavigationComponent-overlay is-fixed',
      }),
      {},
    );
  });

  it('should call Modal with isOpen as true', () => {
    // when
    render(<MobileNavigationComponent mobileMenuIsOpen onClose={onCloseMock} />);
    // then
    expect(Modal).toHaveBeenCalledTimes(1);
    expect(Modal).toHaveBeenCalledWith(expect.objectContaining({ isOpen: true }), {});
  });

  it('should call Modal with isOpen as false', () => {
    // when
    render(<MobileNavigationComponent mobileMenuIsOpen={false} onClose={onCloseMock} />);
    // then
    expect(Modal).toHaveBeenCalledTimes(1);
    expect(Modal).toHaveBeenCalledWith(expect.objectContaining({ isOpen: false }), {});
  });

  it('should call MobileNavigationCloseButtonComponent with defined params', () => {
    // when
    render(<MobileNavigationComponent mobileMenuIsOpen={false} onClose={onCloseMock} />);
    // then
    expect(MobileNavigationCloseButtonComponent).toHaveBeenCalledTimes(1);
    expect(MobileNavigationCloseButtonComponent).toHaveBeenCalledWith({ onClose: onCloseMock }, {});
  });

  it('should call NavigationLinksComponent with defined params', () => {
    // when
    render(
      <MobileNavigationComponent
        mobileMenuIsOpen={false}
        navigationLinks={linksMock}
        onClose={onCloseMock}
      />,
    );
    // then
    expect(NavigationLinksComponent).toHaveBeenCalledTimes(1);
    expect(NavigationLinksComponent).toHaveBeenCalledWith(
      {
        className: 'MobileNavigationComponent-item mx16 is-bold py12',
        items: linksMock,
        onItemClick: onCloseMock,
      },
      {},
    );
  });

  it('should call LogoutButtonComponent with defined params', () => {
    // when
    render(
      <MobileNavigationComponent
        mobileMenuIsOpen={false}
        userInfos={userInfosMock}
        onClose={onCloseMock}
      />,
    );
    // then
    expect(LogoutButtonComponent).toHaveBeenCalledTimes(1);
  });

  it('should call UserWidgetComponent with defined params', () => {
    // when
    render(
      <MobileNavigationComponent
        mobileMenuIsOpen={false}
        navigationLinks={linksMock}
        userInfos={userInfosMock}
        onClose={onCloseMock}
      />,
    );
    // then
    expect(UserWidgetComponent).toHaveBeenCalledTimes(1);
    expect(UserWidgetComponent).toHaveBeenCalledWith(
      { className: 'mx16 is-blue-france py12', userInfos: userInfosMock },
      {},
    );
  });

  it('should not call UserWidgetComponent & LogoutButtonComponent if userInfos is not defined', () => {
    // when
    render(<MobileNavigationComponent mobileMenuIsOpen={false} onClose={onCloseMock} />);
    // then
    expect(UserWidgetComponent).not.toHaveBeenCalled();
    expect(LogoutButtonComponent).not.toHaveBeenCalled();
  });

  it('should not call NavigationLinksComponent if navigationLinks is not defined', () => {
    // when
    render(<MobileNavigationComponent mobileMenuIsOpen={false} onClose={onCloseMock} />);
    // then
    expect(NavigationLinksComponent).not.toHaveBeenCalled();
  });
});
