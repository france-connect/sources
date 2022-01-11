import { render } from '@testing-library/react';

import { NotFoundPage } from './not-found.page';

describe('NotFoundPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should render something', () => {
    // setup
    const { getByText } = render(<NotFoundPage />);
    // action
    const title = getByText('404 - Not Found');
    // expect
    expect(title).toBeInTheDocument();
  });
});
