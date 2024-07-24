import { render } from '@testing-library/react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { NotFoundPage } from './not-found.page';

jest.mock('@fc/styles');

describe('NotFoundPage', () => {
  beforeEach(() => {
    // given
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(String)]);
  });

  it('should match the snapshot, when view is lower than a tablet view', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);

    // when
    const { container } = render(<NotFoundPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when view is greater or equal than a tablet view', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    // when
    const { container } = render(<NotFoundPage />);

    // then
    expect(container).toMatchSnapshot();
  });
});
