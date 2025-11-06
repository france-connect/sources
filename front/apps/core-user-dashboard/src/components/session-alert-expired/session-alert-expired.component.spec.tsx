import { render } from '@testing-library/react';

import { MessageTypes } from '@fc/common';
import { AlertComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { SessionExpiredAlertComponent } from './session-alert-expired.component';

describe('SessionExpiredAlertComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<SessionExpiredAlertComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call AlertComponent with params', () => {
    // Given
    jest.mocked(t).mockReturnValueOnce('any-acme-session-expired');

    // When
    const { getByText } = render(<SessionExpiredAlertComponent />);
    const textElt = getByText('any-acme-session-expired');

    // Then
    expect(textElt).toBeInTheDocument();
    expect(t).toHaveBeenCalledExactlyOnceWith('FC.session.expired');
    expect(AlertComponent).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Object),
        className: 'text-left fr-my-3w',
        dataTestId: 'AlertComponent-session-expired-alert',
        size: Sizes.SMALL,
        type: MessageTypes.WARNING,
      },
      undefined,
    );
  });
});
