import { render } from '@testing-library/react';

import Homepage from './home.page';

describe('Homepage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should render something', () => {
    // setup
    const { getByRole } = render(<Homepage />);
    // action
    const formElement = getByRole('form');
    // expect
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute(
      'action',
      'https://ud.docker.dev-franceconnect.fr/api/redirect-to-idp',
    );
  });
});
