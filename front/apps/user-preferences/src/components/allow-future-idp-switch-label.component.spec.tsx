import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { AllowFutureIdpSwitchLabelComponent } from './allow-future-idp-switch-label.component';

describe('AllowFutureIdpSwitchLabelComponent', () => {
  beforeEach(() => {
    jest
      .mocked(t)
      .mockReturnValueOnce('any-futureidp-allowed-mock')
      .mockReturnValueOnce('any-futureidp-disallowed-mock');
  });

  it('should call t 2 times with correct params', () => {
    // When
    render(<AllowFutureIdpSwitchLabelComponent checked={false} />);

    // Then
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'UserPreferences.futureIdps.allowed');
    expect(t).toHaveBeenNthCalledWith(2, 'UserPreferences.futureIdps.disallowed');
  });

  it('should render the label when switch is inactive', () => {
    // When
    const { container, getByText } = render(<AllowFutureIdpSwitchLabelComponent checked={false} />);
    const textElt = getByText(/any-futureidp-disallowed-mock/);

    // Then
    expect(container).toMatchSnapshot();
    expect(textElt).toBeInTheDocument();
  });

  it('should render the label when switch is active', () => {
    // When
    const { container, getByText } = render(<AllowFutureIdpSwitchLabelComponent checked />);
    const textElt = getByText(/any-futureidp-allowed-mock/);

    // Then
    expect(container).toMatchSnapshot();
    expect(textElt).toBeInTheDocument();
  });
});
