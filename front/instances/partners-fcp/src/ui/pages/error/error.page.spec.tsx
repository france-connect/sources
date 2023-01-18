import { render } from '@testing-library/react';
import { Component } from 'react';
import { Helmet } from 'react-helmet';

import { ErrorPage } from './error.page';

jest.mock('react-helmet');

describe('ErrorPage', () => {
  it('should match the snapshot', () => {
    // when
    const { container } = render(<ErrorPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should set page title through react helmet', () => {
    // given
    jest.mocked(Helmet).mockImplementationOnce(({ children }) => children as unknown as Component);

    // when
    const { getByText } = render(<ErrorPage />);
    const element = getByText('Partenaires FCP - Erreur');

    // then
    expect(Helmet).toHaveBeenCalledTimes(1);
    expect(element).toBeInTheDocument();
  });
});
