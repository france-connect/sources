import { render } from '@testing-library/react';

import { ErrorPage } from './error.page';

describe('ErrorPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should render something', () => {
    // setup
    const { getByText } = render(<ErrorPage />);
    // action
    const title = getByText('Une erreur est survenue');
    // expect
    expect(title).toBeInTheDocument();
  });
});
