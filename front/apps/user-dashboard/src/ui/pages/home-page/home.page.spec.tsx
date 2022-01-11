import { render } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { useApiGet } from '@fc/common';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import { HomePage } from './home.page';

jest.mock('@fc/common');
jest.mock('@fc/oidc-client');
jest.mock('../../components');

describe('HomePage', () => {
  const useApiGetMock = mocked(useApiGet);
  useApiGetMock.mockReturnValue(null);

  const RedirectToIdpFormComponentMock = mocked(RedirectToIdpFormComponent);
  RedirectToIdpFormComponentMock.mockReturnValue(<div>FoorBar RedirectToIdpFormComponentMock</div>);

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
    useApiGetMock.mockReturnValue(null);
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
    expect(element).toHaveTextContent(
      "Une fois connecté, vous pourrez accéder à l'ensemble des connexions et échanges de données liés à votre compte sur les 6 derniers mois.",
    );
  });
});
