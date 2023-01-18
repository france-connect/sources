import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  it('should match the snapshot, in a desktop viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
    const { container } = render(<NotFoundComponent />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, in a mobile viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(false);

    // when
    const { container } = render(<NotFoundComponent />);

    // then
    expect(container).toMatchSnapshot();
  });
});
