import { render } from '@testing-library/react';
import { useLocation } from 'react-router-dom';

import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';
import { AlertComponent, LinkComponent } from '@fc/dsfr';
import { LoginFormComponent } from '@fc/login-form';
import { useStylesQuery, useStylesVariables } from '@fc/styles';
import { getFraudSupportFormUrl } from '@fc/user-dashboard';

import { FraudLoginPage } from './fraud-login.page';

describe('FraudLoginPage', () => {
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
    const { container } = render(<FraudLoginPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when session is expired', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({ expired: true });

    // When
    const { container } = render(<FraudLoginPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on mobile layout', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false).mockReturnValueOnce(false);

    // When
    const { container } = render(<FraudLoginPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on desktop layout', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true).mockReturnValueOnce(true);

    // When
    const { container } = render(<FraudLoginPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on tablet layout', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false).mockReturnValueOnce(true);

    // When
    const { container } = render(<FraudLoginPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useSafeContext with AccountContext', () => {
    // When
    render(<FraudLoginPage />);

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AccountContext);
  });

  it('should render the main heading', () => {
    // Given
    const { getByRole } = render(<FraudLoginPage />);

    // When
    const element = getByRole('heading');

    // Then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Pour signaler un cas d’usurpation d’identité, veuillez vous connecter',
    );
  });

  it('should render the paragraph', () => {
    // Given
    const { getByTestId } = render(<FraudLoginPage />);

    // When
    const element = getByTestId('paragraph');

    // Then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Une fois connecté, vous pourrez contacter le support FranceConnect en remplissant un formulaire.',
    );
  });

  it('should render AlertComponent with specific props if session has expired', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({ expired: true });
    jest
      .mocked(AlertComponent)
      .mockImplementationOnce(({ children }) => <div data-testid="AlertComponent">{children}</div>);

    // When
    const { container, getByText } = render(<FraudLoginPage />);
    const textElt = getByText('Votre session a expiré, veuillez vous reconnecter');

    // Then
    expect(container).toMatchSnapshot();
    expect(textElt).toBeInTheDocument();
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

  it('should have called useLocation hook', () => {
    // When
    render(<FraudLoginPage />);

    // Then
    expect(useLocation).toHaveBeenCalled();
  });

  it('should have called getFraudSupportFormUrl', () => {
    // Given
    jest.mocked(useLocation).mockReturnValueOnce({
      hash: expect.any(String),
      key: expect.any(String),
      pathname: expect.any(String),
      search: expect.any(String),
      state: { from: { search: 'any-search' } },
    });

    // When
    render(<FraudLoginPage />);

    // Then
    expect(getFraudSupportFormUrl).toHaveBeenCalledOnce();
    expect(getFraudSupportFormUrl).toHaveBeenCalledWith('any-search');
  });

  it('should render LoginFormComponent without redirectUrl', () => {
    // When
    render(<FraudLoginPage />);

    // Then
    expect(LoginFormComponent).toHaveBeenCalledOnce();
    expect(LoginFormComponent).toHaveBeenCalledWith(
      {
        className: 'flex-rows items-center',
        connectType: 'FranceConnect',
        redirectUrl: '/fraud/form',
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
      state: { from: { search: '?param=value' } },
    });

    // When
    render(<FraudLoginPage />);

    // Then
    expect(LoginFormComponent).toHaveBeenCalledOnce();
    expect(LoginFormComponent).toHaveBeenCalledWith(
      {
        className: 'flex-rows items-center',
        connectType: 'FranceConnect',
        redirectUrl: '/fraud/form?param=value',
      },
      {},
    );
  });

  it('should render LinkComponent with fraudSupportFormUrl', () => {
    // Given
    jest.mocked(getFraudSupportFormUrl).mockReturnValue('mock-fraud-support-form-url');

    // When
    render(<FraudLoginPage />);

    // Then
    expect(LinkComponent).toHaveBeenCalledOnce();
    expect(LinkComponent).toHaveBeenCalledWith(
      {
        dataTestId: 'fraud-support-form-link',
        href: 'mock-fraud-support-form-url',
        label: 'Je ne peux pas me connecter',
      },
      {},
    );
  });
});
