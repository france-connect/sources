import { render } from '@testing-library/react';

import { LinkComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { AuthenticationEventIdCallout } from './authentication-event-id-callout.component';

describe('authenticationEventIdCallout', () => {
  beforeEach(() => {
    // Given
    jest.mocked(LinkComponent).mockReturnValue(<a href="mock">mock</a>);
    jest
      .mocked(t)
      .mockReturnValueOnce('any-callout-title-mock')
      .mockReturnValueOnce('any-callout-description-mock')
      .mockReturnValueOnce('any-callout-bullet1-label-mock')
      .mockReturnValueOnce('any-callout-bullet1-alt-mock')
      .mockReturnValueOnce('any-callout-bullet2-label-mock')
      .mockReturnValueOnce('any-callout-bullet2-alt-mock');
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<AuthenticationEventIdCallout />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call t 6 times with correct params', () => {
    // When
    render(<AuthenticationEventIdCallout />);

    // Then
    expect(t).toHaveBeenCalledTimes(6);
    expect(t).toHaveBeenNthCalledWith(1, 'FraudForm.callout.title');
    expect(t).toHaveBeenNthCalledWith(2, 'FraudForm.callout.description');
    expect(t).toHaveBeenNthCalledWith(3, 'FraudForm.callout.bullet1.label');
    expect(t).toHaveBeenNthCalledWith(4, 'FraudForm.callout.bullet1.alt');
    expect(t).toHaveBeenNthCalledWith(5, 'FraudForm.callout.bullet2.label');
    expect(t).toHaveBeenNthCalledWith(6, 'FraudForm.callout.bullet2.alt');
  });

  it('should render LinkComponent', () => {
    // When
    render(<AuthenticationEventIdCallout />);

    // Then
    expect(LinkComponent).toHaveBeenCalledOnce();
    expect(LinkComponent).toHaveBeenCalledWith(
      {
        dataTestId: 'history-link',
        href: '/history',
        label: 'any-callout-bullet2-label-mock',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
      undefined,
    );
  });
});
