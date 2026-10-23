import { render } from '@testing-library/react';
import { Link } from 'react-router';

import { getAccessibleTitle } from '@fc/common';
import { LogoRepubliqueFrancaiseComponent } from '@fc/dsfr';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<FooterComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the footer', () => {
    // When
    const { getByTestId } = render(<FooterComponent />);

    // Then
    expect(getByTestId('FooterComponent')).toBeInTheDocument();
  });

  it('should render the République Française logo', () => {
    // When
    render(<FooterComponent />);

    // Then
    expect(LogoRepubliqueFrancaiseComponent).toHaveBeenCalledOnce();
  });

  it('should build the home link title from the logo alternative text', () => {
    // When
    render(<FooterComponent />);

    // Then
    expect(getAccessibleTitle).toHaveBeenCalledExactlyOnceWith(
      'Accueil',
      'FranceConnect, 10 ans de simplification de l’accès aux démarches',
    );
  });

  it('should link the FranceConnect logo to the homepage', () => {
    // Given
    jest.mocked(getAccessibleTitle).mockReturnValueOnce('any accessible title mock');

    // When
    render(<FooterComponent />);

    // Then
    expect(Link).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ title: 'any accessible title mock', to: '/' }),
      undefined,
    );
  });

  it('should render the FranceConnect logo with its alternative text and a fixed height', () => {
    // When
    const { getByAltText } = render(<FooterComponent />);
    const logoElt = getByAltText(
      'FranceConnect, 10 ans de simplification de l’accès aux démarches',
    );

    // Then
    expect(logoElt).toBeInTheDocument();
    expect(logoElt).toHaveStyle({ height: '90px', maxHeight: '90px' });
  });
});
