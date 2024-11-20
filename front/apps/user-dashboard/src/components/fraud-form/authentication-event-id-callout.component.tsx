import React from 'react';

import type { PropsWithClassName } from '@fc/common';
import { CalloutComponent, LinkComponent } from '@fc/dsfr';

export const AuthenticationEventIdCallout = React.memo(({ className }: PropsWithClassName) => (
  <CalloutComponent
    className={className}
    icon="information-line"
    title="Où se trouve le code d’identification ?">
    <p className="fr-callout__text">Le code se trouve dans&nbsp;:</p>
    <ul>
      <li className="fr-mb-1w fr-mt-2w">
        <p className="fr-callout__text">
          l’alerte de connexion que vous avez reçue par mail&nbsp;:
        </p>
      </li>
      <img
        alt="Code d'identification dans l'alerte de connexion"
        className="fr-responsive-img"
        data-testid="authentication-event-id-mail-img"
        src="/images/authentication-event-id-mail.svg"
      />
      <li className="fr-mb-2w fr-mt-2w">
        <p className="fr-callout__text">
          votre{' '}
          <LinkComponent
            dataTestId="history-link"
            href="/history"
            label="historique de connexion"
            rel="noopener noreferrer"
            target="_blank"
          />
        </p>
      </li>
      <img
        alt="Code d'identification dans l'historique de connexion"
        className="fr-responsive-img"
        data-testid="authentication-event-id-history-img"
        src="/images/authentication-event-id-history.svg"
        style={{ transform: 'scale(1.025)' }}
      />
    </ul>
  </CalloutComponent>
));

AuthenticationEventIdCallout.displayName = 'AuthenticationEventIdCallout';
