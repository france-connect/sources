import { render } from '@testing-library/react';
import { Helmet } from 'react-helmet';
import { useMediaQuery } from 'react-responsive';
import { Link, Outlet } from 'react-router-dom';

import { ErrorPage } from './error.page';

describe('ErrorPage', () => {
  it('should match the snapshot', () => {
    // when
    const { container } = render(<ErrorPage />);

    // expect
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, in a mobile viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValue(false);

    // when
    const { container } = render(<ErrorPage />);

    // expect
    expect(container).toMatchSnapshot();
  });

  it('should call react-helmet', () => {
    // when
    render(<ErrorPage />);

    // expect
    expect(Helmet).toHaveBeenCalledTimes(1);
  });

  it('should call react-router-dom Outlet', () => {
    // when
    render(<ErrorPage />);

    // expect
    expect(Outlet).toHaveBeenCalledTimes(1);
  });

  it('should call react-router-dom Link with params', () => {
    // when
    const { getByText } = render(<ErrorPage />);
    const element = getByText('Revenir à l’accueil');

    // expect
    expect(Link).toHaveBeenCalledTimes(1);
    expect(Link).toHaveBeenCalledWith(
      expect.objectContaining({ className: 'fr-btn fr-btn--secondary', to: '/' }),
      {},
    );
    expect(element).toBeInTheDocument();
  });
});
