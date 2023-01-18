import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';

import { AxiosErrorCatcherContext } from '@fc/axios-error-catcher';
import { useApiGet } from '@fc/common';
import { AlertComponent, FranceConnectButton } from '@fc/dsfr';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import { HomePage } from './home.page';

describe('HomePage', () => {
  const useApiGetMock = jest.mocked(useApiGet);
  const axiosErrorCatcherMock = {
    codeError: undefined,
    hasError: false,
  };

  it('should match the snapshot, when csrf token is not defined', () => {
    // when
    const { container } = render(
      <AxiosErrorCatcherContext.Provider value={axiosErrorCatcherMock}>
        <HomePage />
      </AxiosErrorCatcherContext.Provider>,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when csrf token is defined', () => {
    // given
    useApiGetMock.mockReturnValueOnce({ csrfToken: 'any-string' });

    // when
    const { container } = render(
      <AxiosErrorCatcherContext.Provider value={axiosErrorCatcherMock}>
        <HomePage />
      </AxiosErrorCatcherContext.Provider>,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when session is expired', () => {
    // when
    const { container } = render(
      <AxiosErrorCatcherContext.Provider
        value={{ ...axiosErrorCatcherMock, codeError: 401, hasError: true }}>
        <HomePage />
      </AxiosErrorCatcherContext.Provider>,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on mobile layout', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValue(false);
    useApiGetMock.mockReturnValueOnce({ csrfToken: 'any-string' });
    // when
    const { container } = render(
      <AxiosErrorCatcherContext.Provider value={axiosErrorCatcherMock}>
        <HomePage />
      </AxiosErrorCatcherContext.Provider>,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should render the main heading', () => {
    // given
    const { getByRole } = render(
      <AxiosErrorCatcherContext.Provider value={axiosErrorCatcherMock}>
        <HomePage />
      </AxiosErrorCatcherContext.Provider>,
    );
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
    render(
      <AxiosErrorCatcherContext.Provider value={axiosErrorCatcherMock}>
        <HomePage />
      </AxiosErrorCatcherContext.Provider>,
    );
    // then
    expect(useApiGetMock).toHaveBeenCalled();
  });

  it('should not have called RedirectToIdpFormComponent when csrf is falsey', () => {
    // when
    render(
      <AxiosErrorCatcherContext.Provider value={axiosErrorCatcherMock}>
        <HomePage />
      </AxiosErrorCatcherContext.Provider>,
    );
    // then
    expect(RedirectToIdpFormComponent).not.toHaveBeenCalled();
  });

  it('should have called RedirectToIdpFormComponent when csrf is truthy', () => {
    // given
    useApiGetMock.mockReturnValueOnce({ csrfToken: 'any-string' });

    // when
    render(
      <AxiosErrorCatcherContext.Provider value={axiosErrorCatcherMock}>
        <HomePage />
      </AxiosErrorCatcherContext.Provider>,
    );
    // then
    expect(RedirectToIdpFormComponent).toHaveBeenCalled();
  });

  it('should have called FranceConnectButton when csrf is truthy', () => {
    // given
    useApiGetMock.mockReturnValueOnce({ csrfToken: 'any-string' });

    // when
    render(
      <AxiosErrorCatcherContext.Provider value={axiosErrorCatcherMock}>
        <HomePage />
      </AxiosErrorCatcherContext.Provider>,
    );
    // then
    expect(FranceConnectButton).toHaveBeenCalled();
  });

  it('should render the paragraph', () => {
    // given
    const { getByTestId } = render(
      <AxiosErrorCatcherContext.Provider value={axiosErrorCatcherMock}>
        <HomePage />
      </AxiosErrorCatcherContext.Provider>,
    );
    // when
    const element = getByTestId('paragraph');

    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Une fois connecté, vous pourrez accéder à l’ensemble des connexions et échanges de données liés à votre compte sur les 6 derniers mois.',
    );
  });

  it('should call AlertComponent with specific props if session has expired', () => {
    // when
    render(
      <AxiosErrorCatcherContext.Provider value={{ ...axiosErrorCatcherMock, hasError: true }}>
        <HomePage />
      </AxiosErrorCatcherContext.Provider>,
    );
    // then
    expect(AlertComponent).toHaveBeenCalledTimes(1);
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        children: expect.anything(),
        className: 'text-left fr-mb-3w',
        size: 'sm',
        type: 'warning',
      },
      {},
    );
  });
});
