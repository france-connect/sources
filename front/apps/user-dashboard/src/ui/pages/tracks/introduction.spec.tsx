import { render } from '@testing-library/react';

import { IntroductionComponent } from './introduction';

describe('IntroductionComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should render something', () => {
    // setup
    const { getByText } = render(<IntroductionComponent />);
    // action
    const title = getByText('Votre historique de connexion');
    // expect
    expect(title).toBeInTheDocument();
  });
});
