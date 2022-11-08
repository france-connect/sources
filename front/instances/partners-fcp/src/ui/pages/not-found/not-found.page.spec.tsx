import { render } from '@testing-library/react';

import { NotFoundPage } from './not-found.page';

describe('NotFoundPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<NotFoundPage />);

    // then
    expect(container).toMatchSnapshot();
  });
});
