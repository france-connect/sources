import { render } from '@testing-library/react';

import { ErrorPage } from './error.page';

describe('ErrorPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<ErrorPage />);
    // then
    expect(container).toMatchSnapshot();
  });
});
