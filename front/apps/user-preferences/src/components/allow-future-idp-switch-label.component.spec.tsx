import { render } from '@testing-library/react';

import { AllowFutureIdpSwitchLabelComponent } from './allow-future-idp-switch-label.component';

describe('AllowFutureIdpSwitchLabelComponent', () => {
  it('should render the label when switch is inactive', () => {
    // when
    const { container } = render(<AllowFutureIdpSwitchLabelComponent checked={false} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should render the label when switch is active', () => {
    // when
    const { container } = render(<AllowFutureIdpSwitchLabelComponent checked />);

    // then
    expect(container).toMatchSnapshot();
  });
});
