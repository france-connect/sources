import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';

import { useApiGet } from '@fc/common';
import { FranceConnectButton } from '@fc/dsfr';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import { HomePage } from './home.page';

describe('HomePage', () => {
  const useApiGetMock = mocked(useApiGet);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot, when csrf token is not defined', () => {
    // when
    const { container } = render(<HomePage />);
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when csrf token is defined', () => {
    // given
    useApiGetMock.mockReturnValueOnce({ csrfToken: 'any-string' });
    // when
    const { container } = render(<HomePage />);
    // then
    expect(container).toMatchSnapshot();
  });

  it('should render the main heading', () => {
    // given
    const { getByRole } = render(<HomePage />);
    // when
    const element = getByRole('heading');
    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Pour accéder à votre historique d’utilisation de FranceConnect, veuillez vous connecter',
    );
  });

  it('should have called useApiGet hook', () => {
    // when
    render(<HomePage />);
    // then
    expect(useApiGetMock).toHaveBeenCalled();
  });

  it('should not have called RedirectToIdpFormComponent when csrf is falsey', () => {
    // when
    render(<HomePage />);
    // then
    expect(RedirectToIdpFormComponent).not.toHaveBeenCalled();
  });

  it('should have called RedirectToIdpFormComponent when csrf is truthy', () => {
    // given
    useApiGetMock.mockReturnValueOnce({ csrfToken: 'any-string' });
    // when
    render(<HomePage />);
    // then
    expect(RedirectToIdpFormComponent).toHaveBeenCalled();
  });

  it('should have called FranceConnectButton when csrf is truthy', () => {
    // given
    useApiGetMock.mockReturnValueOnce({ csrfToken: 'any-string' });
    // when
    render(<HomePage />);
    // then
    expect(FranceConnectButton).toHaveBeenCalled();
  });

  it('should render the paragraph', () => {
    // given
    const { getByTestId } = render(<HomePage />);
    // when
    const element = getByTestId('paragraph');
    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Une fois connecté, vous pourrez accéder à l’ensemble des connexions et échanges de données liés à votre compte sur les 6 derniers mois.',
    );
  });
});
