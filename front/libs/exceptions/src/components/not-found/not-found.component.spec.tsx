import { render } from '@testing-library/react';
import { Link } from 'react-router';
import { useDocumentTitle } from 'usehooks-ts';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<NotFoundComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should set the document title', () => {
    // When
    render(<NotFoundComponent />);

    // Then
    expect(useDocumentTitle).toHaveBeenCalledExactlyOnceWith('FranceConnect - Page non trouvée', {
      preserveTitleOnUnmount: false,
    });
  });

  it('should render the not found title', () => {
    // When
    const { getByTestId } = render(<NotFoundComponent />);
    const titleElt = getByTestId('NotFoundComponent-title');

    // Then
    expect(titleElt).toBeInTheDocument();
    expect(titleElt).toHaveTextContent('Page non trouvée');
  });

  it('should render a link to the home page', () => {
    // When
    render(<NotFoundComponent />);

    // Then
    expect(Link).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        children: 'Page d’accueil',
        className: 'fr-btn',
        to: '/',
      }),
      undefined,
    );
  });

  it('should render the given artwork instead of the default one', () => {
    // When
    const { container, getByTestId } = render(
      <NotFoundComponent artwork={<span data-testid="custom-artwork" />} />,
    );

    // Then
    expect(getByTestId('custom-artwork')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
