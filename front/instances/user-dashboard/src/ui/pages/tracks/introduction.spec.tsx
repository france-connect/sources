import { render } from '@testing-library/react';

import { IntroductionComponent } from './introduction';

describe('IntroductionComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<IntroductionComponent />);

    // then
    expect(container).toMatchSnapshot();
  });
});
