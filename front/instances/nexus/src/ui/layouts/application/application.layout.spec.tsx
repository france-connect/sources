import { render } from '@testing-library/react';
import { Outlet } from 'react-router';

import { ApplicationLayout } from './application.layout';

describe('ApplicationLayout', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<ApplicationLayout />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the header, the outlet and the footer', () => {
    // When
    const { getByTestId } = render(<ApplicationLayout />);

    // Then
    expect(getByTestId('HeaderComponent')).toBeInTheDocument();
    expect(Outlet).toHaveBeenCalledOnce();
    expect(getByTestId('FooterComponent')).toBeInTheDocument();
  });
});
