import { render } from '@testing-library/react';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { NotFoundPage } from './not-found.page';

jest.mock('react-responsive');

describe('NotFoundPage', () => {
  it('should match the snapshot, when view is lower than a tablet view', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(false);

    // when
    const { container } = render(<NotFoundPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when view is greater or equal than a tablet view', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
    const { container } = render(<NotFoundPage />);

    // then
    expect(container).toMatchSnapshot();
  });
});
