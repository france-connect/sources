import { render } from '@testing-library/react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { NotFoundPage } from './not-found.page';

describe('NotFoundPage', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(String)]);
  });

  it('should match the snapshot, when view is lower than a tablet view', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);

    // When
    const { container } = render(<NotFoundPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when view is greater or equal than a tablet view', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    // When
    const { container } = render(<NotFoundPage />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
