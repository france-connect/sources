import { render } from '@testing-library/react';
import { Link, Outlet } from 'react-router';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { ErrorPage } from './error.page';

describe('ErrorPage', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(String)]);
    jest.mocked(useStylesQuery).mockReturnValue(true);
  });

  it('should match the snapshot when greater than or equal to desktop', () => {
    // When
    const { container } = render(<ErrorPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when lower than desktop', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);

    // When
    const { container } = render(<ErrorPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call react-router Outlet', () => {
    // When
    render(<ErrorPage />);

    // Then
    expect(Outlet).toHaveBeenCalledOnce();
  });

  it('should call react-router Link with params', () => {
    // When
    const { getByText } = render(<ErrorPage />);
    const element = getByText('Revenir à l’accueil');

    // Then
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      expect.objectContaining({ className: 'fr-btn fr-btn--secondary', to: '/' }),
      undefined,
    );
    expect(element).toBeInTheDocument();
  });
});
