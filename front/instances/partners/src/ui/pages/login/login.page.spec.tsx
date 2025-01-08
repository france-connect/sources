import { render } from '@testing-library/react';

import { LoginFormComponent } from '@fc/login-form';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { LoginPage } from './login.page';

describe('Login Page', () => {
  beforeEach(() => {
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(Number)]);
    jest.mocked(useStylesQuery).mockReturnValue(true);
  });

  it('shoud match the snapshot, greater than desktop viewport', () => {
    // Given
    const breakpointMock = Symbol(1234) as unknown as string;
    jest.mocked(useStylesVariables).mockReturnValue([breakpointMock]);
    jest.mocked(useStylesQuery).mockReturnValue(true);

    // When
    const { container } = render(<LoginPage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(useStylesVariables).toHaveBeenCalledOnce();
    expect(useStylesVariables).toHaveBeenCalledWith(['breakpoint-lg']);
    expect(useStylesQuery).toHaveBeenCalledOnce();
    expect(useStylesQuery).toHaveBeenCalledWith({ minWidth: breakpointMock });
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

  it('shoud match the snapshot, lower than mobile viewport', () => {
    // Given
    const breakpointMock = Symbol(1234) as unknown as string;
    jest.mocked(useStylesVariables).mockReturnValue([breakpointMock]);
    jest.mocked(useStylesQuery).mockReturnValue(false);

    // When
    const { container } = render(<LoginPage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(useStylesVariables).toHaveBeenCalledOnce();
    expect(useStylesVariables).toHaveBeenCalledWith(['breakpoint-lg']);
    expect(useStylesQuery).toHaveBeenCalledOnce();
    expect(useStylesQuery).toHaveBeenCalledWith({ minWidth: breakpointMock });
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
});
