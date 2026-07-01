import { render } from '@testing-library/react';

import { useAccountContext } from '@fc/account';
import { AlertComponent, NoticeComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { LoginFormComponent } from '@fc/login-form';

import { LoginPage } from './login.page';

describe('Login Page', () => {
  const accountContextState = {
    connected: true,
    expired: false,
    ready: true,
    userinfos: undefined,
  };

  beforeEach(() => {
    jest.mocked(useAccountContext).mockReturnValue(accountContextState);
    jest.mocked(t).mockReturnValue('any-translation-value');
  });

  it('should match the snapshot', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce(accountContextState);
    jest
      .mocked(t)
      .mockReturnValueOnce('Partners.layout.noticeDescription-mock')
      .mockReturnValueOnce('Partners.layout.noticeTitle-mock')
      .mockReturnValueOnce('Partners.loginpage.title-mock')
      .mockReturnValueOnce('Partners.loginpage.description-mock');

    // When
    const { container, getByText } = render(<LoginPage />);
    const loginTitleElt = getByText('Partners.loginpage.title-mock');
    const loginDescriptionElt = getByText('Partners.loginpage.description-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(useAccountContext).toHaveBeenCalledOnce();
    expect(useAccountContext).toHaveBeenCalledWith();
    expect(t).toHaveBeenCalledTimes(4);
    expect(t).toHaveBeenNthCalledWith(1, 'Partners.layout.noticeDescription');
    expect(t).toHaveBeenNthCalledWith(2, 'Partners.layout.noticeTitle');
    expect(t).toHaveBeenNthCalledWith(3, 'Partners.loginpage.title');
    expect(t).toHaveBeenNthCalledWith(4, 'Partners.loginpage.description');
    expect(NoticeComponent).toHaveBeenCalledOnce();
    expect(NoticeComponent).toHaveBeenCalledWith(
      {
        description: 'Partners.layout.noticeDescription-mock',
        title: 'Partners.layout.noticeTitle-mock',
      },
      undefined,
    );
    expect(AlertComponent).not.toHaveBeenCalledOnce();
    expect(loginTitleElt).toBeInTheDocument();
    expect(loginDescriptionElt).toBeInTheDocument();
    expect(LoginFormComponent).toHaveBeenCalledOnce();
    expect(LoginFormComponent).toHaveBeenCalledWith(
      {
        className: 'flex-rows items-start',
        connectType: 'ProConnect',
        showHelp: true,
      },
      undefined,
    );
  });

  it('shoud match the snapshot, when user session has expired', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({ ...accountContextState, expired: true });
    jest
      .mocked(t)
      .mockReturnValueOnce('Partners.layout.noticeDescription-mock')
      .mockReturnValueOnce('Partners.layout.noticeTitle-mock')
      .mockReturnValueOnce('FC.session.expired-mock')
      .mockReturnValueOnce('Partners.loginpage.title-mock')
      .mockReturnValueOnce('Partners.loginpage.description-mock');

    // When
    const { container } = render(<LoginPage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledTimes(5);
    expect(t).toHaveBeenNthCalledWith(3, 'FC.session.expired');
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        size: 'md',
        title: 'FC.session.expired-mock',
        type: 'error',
      },
      undefined,
    );
  });
});
