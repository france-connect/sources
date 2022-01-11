import { render } from '@testing-library/react';

import { ButtonLoginComponent } from './button-login.component';

describe('ButtonLoginComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should render an input', () => {
    // setup
    const { container } = render(<ButtonLoginComponent />);
    // action
    const inputs = container.getElementsByTagName('input');
    // expect
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).toHaveAttribute('value', 'Se connecter');
  });
});
