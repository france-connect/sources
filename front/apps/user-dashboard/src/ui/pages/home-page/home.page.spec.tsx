import { render } from '@testing-library/react';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { mocked } from 'ts-jest/utils';

import { useApiGet } from '@fc/common';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';
import { AppContext } from '@fc/state-management';

import { HomePage } from './home.page';

describe('HomePage', () => {
  const useApiGetMock = mocked(useApiGet);

  it('should render the main heading', () => {
    // given
    const { getByRole } = render(<HomePage />);
    // when
    const element = getByRole('heading');
    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('is-blue-france is-bold mb32');
    expect(element).toHaveTextContent(
      "Pour accéder à votre historique d'utilisation de FranceConnect, veuillez vous connecter",
    );
  });

  it('should have called useApiGet hook', () => {
    // given
    render(<HomePage />);
    // then
    expect(useApiGetMock).toHaveBeenCalled();
  });

  it('should not have called RedirectToIdpFormComponent when csrf is falsey', () => {
    // given
    render(<HomePage />);
    // then
    expect(RedirectToIdpFormComponent).not.toHaveBeenCalled();
  });

  it('should have called RedirectToIdpFormComponent when csrf is truthy', () => {
    // given
    useApiGetMock.mockReturnValue({ csrfToken: 'any-string' });
    render(<HomePage />);
    // then
    expect(RedirectToIdpFormComponent).toHaveBeenCalled();
  });

  it('should render the paragraph', () => {
    // given
    const { getByTestId } = render(<HomePage />);
    // when
    const element = getByTestId('paragraph');
    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('mt32');
    expect(element).toHaveClass('fs14');
    expect(element).toHaveClass('lh24');
    expect(element).toHaveTextContent(
      "Une fois connecté, vous pourrez accéder à l'ensemble des connexions et échanges de données liés à votre compte sur les 6 derniers mois.",
    );
  });

  it('should redirect to history page when user is connected', () => {
    // given
    const { getByTestId } = render(<HomePage />);
    // when
    const element = getByTestId('paragraph');
    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      "Une fois connecté, vous pourrez accéder à l'ensemble des connexions et échanges de données liés à votre compte sur les 6 derniers mois.",
    );
  });

  it('should call useContext with AppContext', () => {
    // given
    const useContextMock = jest.spyOn(React, 'useContext');
    // when
    render(<HomePage />);
    // then
    expect(useContextMock).toHaveBeenCalledTimes(1);
    expect(useContextMock).toHaveBeenCalledWith(AppContext);
  });

  it('should call redirect to history page when user is connected', () => {
    // given
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      state: { user: { userinfos: expect.any(Object) } },
    }));
    // when
    render(<HomePage />);
    // then
    expect(Redirect).toHaveBeenCalledTimes(1);
    expect(Redirect).toHaveBeenCalledWith({ to: '/history' }, {});
  });
});
