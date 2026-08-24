import { render } from '@testing-library/react';
import { Outlet } from 'react-router';

import { PageLayout } from './page.layout';

describe('PageLayout', () => {
  it('should match snapshot', () => {
    // When
    const { container } = render(<PageLayout />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call Outlet component', () => {
    // When
    render(<PageLayout />);

    // Then
    expect(Outlet).toHaveBeenCalledExactlyOnceWith({}, undefined);
  });
});
