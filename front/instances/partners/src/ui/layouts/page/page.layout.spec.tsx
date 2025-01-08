import { render } from '@testing-library/react';
import { Outlet } from 'react-router-dom';

import { PageLayout } from './page.layout';

describe('PageLayout', () => {
  it('should match snapshot', () => {
    // When
    const { container } = render(<PageLayout />);

    // Then
    expect(container).toMatchSnapshot();
    expect(Outlet).toHaveBeenCalledOnce();
    expect(Outlet).toHaveBeenCalledWith({}, {});
  });
});
