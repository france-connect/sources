import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useMediaQuery } from 'react-responsive';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot, in a desktop viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
    const { container } = render(<NotFoundComponent />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, in a mobile viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);

    // when
    const { container } = render(<NotFoundComponent />);

    // then
    expect(container).toMatchSnapshot();
  });
});
