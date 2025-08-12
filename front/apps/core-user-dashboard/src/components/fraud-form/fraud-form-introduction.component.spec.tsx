import { render } from '@testing-library/react';

import { FraudFormIntroductionComponent } from './fraud-form-introduction.component';

describe('FraudFormIntroductionComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<FraudFormIntroductionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
