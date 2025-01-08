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
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({ expired: false });

    // When
    const { container } = render(<HomePage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when session is expired', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({ expired: true });

    // When
    const { container } = render(<HomePage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on mobile layout', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false).mockReturnValueOnce(false);

    // When
    const { container } = render(<HomePage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on desktop layout', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true).mockReturnValueOnce(false);

    // When
    const { container } = render(<HomePage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on tablet layout', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false).mockReturnValueOnce(true);

    // When
    const { container } = render(<HomePage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useSafeContext with AccountContext', () => {
    // When
    render(<HomePage />);

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AccountContext);
  });

  it('should render the main heading', () => {
    // Given
    const { getByRole } = render(<HomePage />);

    // When
    const element = getByRole('heading');

    // Then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Pour accéder à votre tableau de bord FranceConnect, veuillez vous connecter',
    );
  });

  it('should have called useLocation hook', () => {
    // When
    render(<HomePage />);

    // Then
    expect(useLocation).toHaveBeenCalled();
  });

  it('should render the paragraph', () => {
    // Given
    const { getByTestId } = render(<HomePage />);

    // When
    const element = getByTestId('paragraph');

    // Then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Une fois connecté, vous pourrez consulter l’historique de vos connexions et configurer vos accès FranceConnect.',
    );
  });

  it('should render AlertComponent with specific props if session has expired', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({ expired: true });

    // When
    render(<HomePage />);

    // Then
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
    // When
    render(<HomePage />);

    // Then
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

    // When
    render(<HomePage />);

    // Then
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
