import { render } from '@testing-library/react';

import { LinkComponent } from '@fc/dsfr';

import { AuthenticationEventIdCallout } from './authentication-event-id-callout.component';

describe('authenticationEventIdCallout', () => {
  it('should match the snapshot', () => {
    // Given
    const { container, getByText } = render(<AuthenticationEventIdCallout />);

    // When
    const mailElt = getByText('l’alerte de connexion que vous avez reçue par mail :');

    // Then
    expect(container).toMatchSnapshot();
    expect(mailElt).toBeInTheDocument();
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
        label: 'historique de connexion',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
      {},
    );
  });
});
