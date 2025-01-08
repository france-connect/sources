import { render } from '@testing-library/react';

import { IntroductionComponent } from './introduction';

describe('IntroductionComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<IntroductionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
