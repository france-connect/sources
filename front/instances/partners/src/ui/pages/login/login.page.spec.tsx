import { render } from '@testing-library/react';

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
    // given
    jest.mocked(useStylesQuery).mockReturnValue(true);

    // when
    const { container } = render(<LoginPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('shoud match the snapshot, lower than mobile viewport', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValue(false);

    // when
    const { container } = render(<LoginPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should retrieve the css :root breakpoint variables', () => {
    // when
    render(<LoginPage />);

    // then
    expect(useStylesVariables).toHaveBeenCalledOnce();
    expect(useStylesVariables).toHaveBeenCalledWith(['breakpoint-lg']);
  });

  it('should retrieve the current viewport dimensions', () => {
    // given
    const breakpointMock = Symbol(1234) as unknown as string;
    jest.mocked(useStylesVariables).mockReturnValue([breakpointMock]);

    // when
    render(<LoginPage />);

    // then
    expect(useStylesQuery).toHaveBeenCalledOnce();
    expect(useStylesQuery).toHaveBeenCalledWith({ minWidth: breakpointMock });
  });
});
