import { render } from '@testing-library/react';
import { Link } from 'react-router';

import { getAccessibleTitle } from '@fc/common';
import { LogoRepubliqueFrancaiseComponent } from '@fc/dsfr';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<HeaderComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the header', () => {
    // When
    const { getByTestId } = render(<HeaderComponent />);

    // Then
    expect(getByTestId('HeaderComponent')).toBeInTheDocument();
  });

  it('should render the République Française logo', () => {
    // When
    render(<HeaderComponent />);

    // Then
    expect(LogoRepubliqueFrancaiseComponent).toHaveBeenCalledOnce();
  });

  it('should render the FranceConnect logo with its alternative text', () => {
    // When
    const { getByAltText } = render(<HeaderComponent />);

    // Then
    expect(
      getByAltText('FranceConnect, 10 ans de simplification de l’accès aux démarches'),
    ).toBeInTheDocument();
  });

  it('should render the service title', () => {
    // When
    const { getByTestId } = render(<HeaderComponent />);
    const titleElt = getByTestId('HeaderComponent-title');

    // Then
    expect(titleElt).toBeInTheDocument();
    expect(titleElt).toHaveTextContent('Nexus');
  });

  it('should build the homepage link title from the service name', () => {
    // When
    render(<HeaderComponent />);

    // Then
    expect(getAccessibleTitle).toHaveBeenCalledExactlyOnceWith(
      'Retour à l’accueil du site',
      'Nexus',
    );
  });

  it('should link the République Française logo to the homepage', () => {
    // Given
    jest.mocked(getAccessibleTitle).mockReturnValueOnce('any accessible title mock');

    // When
    render(<HeaderComponent />);

    // Then
    expect(Link).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ title: 'any accessible title mock', to: '/' }),
      undefined,
    );
  });

  it('should link the service title to the homepage', () => {
    // Given
    jest.mocked(getAccessibleTitle).mockReturnValueOnce('any accessible title mock');

    // When
    render(<HeaderComponent />);

    // Then
    expect(Link).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ title: 'any accessible title mock', to: '/' }),
      undefined,
    );
  });
});
