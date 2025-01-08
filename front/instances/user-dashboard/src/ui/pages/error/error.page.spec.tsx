import { render } from '@testing-library/react';
import { Helmet } from 'react-helmet-async';
import { Link, Outlet } from 'react-router-dom';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { ErrorPage } from './error.page';

describe('ErrorPage', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(String)]);
  });

  it('should match the snapshot when greater than or equal to desktop', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(true);

    // When
    const { container } = render(<ErrorPage />);

    // expect
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when lower than desktop', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(false);

    // When
    const { container } = render(<ErrorPage />);

    // expect
    expect(container).toMatchSnapshot();
  });

  it('should call react-helmet-async', () => {
    // When
    render(<ErrorPage />);

    // expect
    expect(Helmet).toHaveBeenCalledOnce();
  });

  it('should call react-router-dom Outlet', () => {
    // When
    render(<ErrorPage />);

    // expect
    expect(Outlet).toHaveBeenCalledOnce();
  });

  it('should call react-router-dom Link with params', () => {
    // When
    const { getByText } = render(<ErrorPage />);
    const element = getByText('Revenir à l’accueil');

    // expect
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      expect.objectContaining({ className: 'fr-btn fr-btn--secondary', to: '/' }),
      {},
    );
    expect(element).toBeInTheDocument();
  });
});
