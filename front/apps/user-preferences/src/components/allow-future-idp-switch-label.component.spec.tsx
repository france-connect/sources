import { render } from '@testing-library/react';

import { AllowFutureIdpSwitchLabelComponent } from './allow-future-idp-switch-label.component';

describe('AllowFutureIdpSwitchLabelComponent', () => {
  it('should render the label when switch is inactive', () => {
    // When
    const { container } = render(<AllowFutureIdpSwitchLabelComponent checked={false} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the label when switch is active', () => {
    // When
    const { container } = render(<AllowFutureIdpSwitchLabelComponent checked />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
