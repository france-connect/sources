import { render } from '@testing-library/react';
import { Navigate } from 'react-router-dom';

import { HomePage } from './home.page';

describe('HomePage', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<HomePage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith({ replace: true, to: '/instances' }, {});
  });
});
