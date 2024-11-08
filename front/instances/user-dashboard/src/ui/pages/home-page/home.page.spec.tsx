import { render } from '@testing-library/react';
import { useLocation } from 'react-router-dom';

import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';
import { AlertComponent } from '@fc/dsfr';
import { LoginFormComponent } from '@fc/login-form';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { HomePage } from './home.page';

describe('HomePage', () => {
  beforeEach(() => {
    jest.mocked(useSafeContext).mockReturnValue({ expired: false });
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(Number), expect.any(Number)]);
    jest.mocked(useStylesQuery).mockReturnValue(true);
  });

  it('should match the snapshot when session is not expired', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValueOnce({ expired: false });

    // when
    const { container } = render(<HomePage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when session is expired', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValueOnce({ expired: true });

    // when
    const { container } = render(<HomePage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on mobile layout', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false).mockReturnValueOnce(false);

    // when
    const { container } = render(<HomePage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on desktop layout', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true).mockReturnValueOnce(false);

    // when
    const { container } = render(<HomePage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on tablet layout', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false).mockReturnValueOnce(true);

    // when
    const { container } = render(<HomePage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call useSafeContext with AccountContext', () => {
    // when
    render(<HomePage />);

    // then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AccountContext);
  });

  it('should render the main heading', () => {
    // given
    const { getByRole } = render(<HomePage />);

    // when
    const element = getByRole('heading');

    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Pour accéder à votre tableau de bord FranceConnect, veuillez vous connecter',
    );
  });

  it('should have called useLocation hook', () => {
    // when
    render(<HomePage />);

    // then
    expect(useLocation).toHaveBeenCalled();
  });

  it('should render the paragraph', () => {
    // given
    const { getByTestId } = render(<HomePage />);

    // when
    const element = getByTestId('paragraph');

    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Une fois connecté, vous pourrez consulter l’historique de vos connexions et configurer vos accès FranceConnect.',
    );
  });

  it('should render AlertComponent with specific props if session has expired', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValueOnce({ expired: true });

    // when
    render(<HomePage />);

    // then
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        className: 'text-left fr-my-3w',
        size: 'sm',
        type: 'warning',
      },
      {},
    );
  });

  it('should render LoginFormComponent without redirectUrl', () => {
    // when
    render(<HomePage />);

    // then
    expect(LoginFormComponent).toHaveBeenCalledOnce();
    expect(LoginFormComponent).toHaveBeenCalledWith(
      {
        className: 'flex-rows items-center',
        connectType: 'FranceConnect',
        redirectUrl: undefined,
      },
      {},
    );
  });

  it('should render LoginFormComponent with redirectUrl', () => {
    // Given
    jest.mocked(useLocation).mockReturnValueOnce({
      hash: expect.any(String),
      key: expect.any(String),
      pathname: expect.any(String),
      search: expect.any(String),
      state: { from: { pathname: '/any-pathname' } },
    });

    // when
    render(<HomePage />);

    // then
    expect(LoginFormComponent).toHaveBeenCalledOnce();
    expect(LoginFormComponent).toHaveBeenCalledWith(
      {
        className: 'flex-rows items-center',
        connectType: 'FranceConnect',
        redirectUrl: '/any-pathname',
      },
      {},
    );
  });
});
