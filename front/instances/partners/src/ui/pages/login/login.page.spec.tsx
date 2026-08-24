import { render } from '@testing-library/react';

import { useAccountContext } from '@fc/account';
import { AlertComponent } from '@fc/dsfr';
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
  });

  it('should match the snapshot', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce(accountContextState);

    // When
    const { container, getByText } = render(<LoginPage />);
    const loginTitleElt = getByText('Partners.loginpage.title');
    const loginDescriptionElt = getByText('Partners.loginpage.description');

    // Then
    expect(container).toMatchSnapshot();
    expect(useAccountContext).toHaveBeenCalledOnce();
    expect(useAccountContext).toHaveBeenCalledWith();
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

    // When
    const { container } = render(<LoginPage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledTimes(3);
    expect(t).toHaveBeenNthCalledWith(1, 'FC.session.expired');
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        size: 'md',
        title: 'FC.session.expired',
        type: 'error',
      },
      undefined,
    );
  });
});
