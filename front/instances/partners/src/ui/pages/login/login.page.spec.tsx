import { render } from '@testing-library/react';

import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';
import { AlertComponent, NoticeComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { LoginFormComponent } from '@fc/login-form';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { LoginPage } from './login.page';

describe('Login Page', () => {
  beforeEach(() => {
    jest.mocked(useSafeContext).mockReturnValue({ expired: false });
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(Number)]);
    jest.mocked(useStylesQuery).mockReturnValue(true);
    jest.mocked(t).mockReturnValue('any-translation-value');
  });

  it('should match the snapshot', () => {
    // Given
    const breakpointMock = Symbol(1234) as unknown as string;
    jest.mocked(useStylesVariables).mockReturnValueOnce([breakpointMock]);
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    jest.mocked(useSafeContext).mockReturnValueOnce({ expired: false });
    jest
      .mocked(t)
      .mockReturnValueOnce('Partners.page.noticeDescription-mock')
      .mockReturnValueOnce('Partners.page.noticeTitle-mock')
      .mockReturnValueOnce('Partners.loginpage.title-mock')
      .mockReturnValueOnce('Partners.loginpage.description-mock');

    // When
    const { container, getByText } = render(<LoginPage />);
    const loginTitleElt = getByText('Partners.loginpage.title-mock');
    const loginDescriptionElt = getByText('Partners.loginpage.description-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AccountContext);
    expect(useStylesVariables).toHaveBeenCalledOnce();
    expect(useStylesVariables).toHaveBeenCalledWith(['breakpoint-lg']);
    expect(useStylesQuery).toHaveBeenCalledOnce();
    expect(useStylesQuery).toHaveBeenCalledWith({ minWidth: breakpointMock });
    expect(t).toHaveBeenCalledTimes(4);
    expect(t).toHaveBeenNthCalledWith(1, 'Partners.page.noticeDescription');
    expect(t).toHaveBeenNthCalledWith(2, 'Partners.page.noticeTitle');
    expect(t).toHaveBeenNthCalledWith(3, 'Partners.loginpage.title');
    expect(t).toHaveBeenNthCalledWith(4, 'Partners.loginpage.description');
    expect(NoticeComponent).toHaveBeenCalledOnce();
    expect(NoticeComponent).toHaveBeenCalledWith(
      {
        description: 'Partners.page.noticeDescription-mock',
        title: 'Partners.page.noticeTitle-mock',
      },
      {},
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
      {},
    );
  });

  it('shoud match the snapshot, greater than desktop viewport', () => {
    // Given
    const breakpointDesktopMock = Symbol(1234) as unknown as string;
    jest.mocked(useStylesVariables).mockReturnValueOnce([breakpointDesktopMock]);
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    // When
    const { container } = render(<LoginPage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(useStylesVariables).toHaveBeenCalledOnce();
    expect(useStylesVariables).toHaveBeenCalledWith(['breakpoint-lg']);
    expect(useStylesQuery).toHaveBeenCalledOnce();
    expect(useStylesQuery).toHaveBeenCalledWith({ minWidth: breakpointDesktopMock });
  });

  it('shoud match the snapshot, lower than mobile viewport', () => {
    // Given
    const breakpointLowerMock = Symbol(1234) as unknown as string;
    jest.mocked(useStylesVariables).mockReturnValueOnce([breakpointLowerMock]);
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);

    // When
    const { container } = render(<LoginPage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(useStylesVariables).toHaveBeenCalledOnce();
    expect(useStylesVariables).toHaveBeenCalledWith(['breakpoint-lg']);
    expect(useStylesQuery).toHaveBeenCalledOnce();
    expect(useStylesQuery).toHaveBeenCalledWith({ minWidth: breakpointLowerMock });
  });

  it('shoud match the snapshot, when user session has expired', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({ expired: true });
    jest
      .mocked(t)
      .mockReturnValueOnce('Partners.page.noticeDescription-mock')
      .mockReturnValueOnce('Partners.page.noticeTitle-mock')
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
        className: 'text-left fr-my-3w',
        size: 'md',
        title: 'FC.session.expired-mock',
        type: 'error',
      },
      {},
    );
  });
});
