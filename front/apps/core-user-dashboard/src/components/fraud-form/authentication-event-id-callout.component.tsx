import React from 'react';

import type { PropsWithClassName } from '@fc/common';
import { CalloutComponent, LinkComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const AuthenticationEventIdCallout = React.memo(({ className }: PropsWithClassName) => {
  const title = t('FraudForm.callout.title');
  const description = t('FraudForm.callout.description');
  const bullet1Label = t('FraudForm.callout.bullet1.label');
  const bullet1Alt = t('FraudForm.callout.bullet1.alt');
  const bullet2Label = t('FraudForm.callout.bullet2.label');
  const bullet2Alt = t('FraudForm.callout.bullet2.alt');

  return (
    <CalloutComponent className={className} icon="information-line" title={title}>
      <p className="fr-callout__text">{description}</p>
      <ul>
        <li className="fr-mb-1w fr-mt-2w">
          <p className="fr-callout__text">{bullet1Label}</p>
        </li>
        <img
          alt={bullet1Alt}
          className="fr-responsive-img"
          data-testid="authentication-event-id-mail-img"
          src="/images/fraud/authentication-event-id-mail.svg"
        />
        <li className="fr-mb-2w fr-mt-2w">
          <p className="fr-callout__text">
            votre{' '}
            <LinkComponent
              dataTestId="history-link"
              href="/history"
              label={bullet2Label}
              rel="noopener noreferrer"
              target="_blank"
            />
          </p>
        </li>
        <img
          alt={bullet2Alt}
          className="fr-responsive-img"
          data-testid="authentication-event-id-history-img"
          src="/images/fraud/authentication-event-id-history.svg"
          style={{ transform: 'scale(1.025)' }}
        />
      </ul>
    </CalloutComponent>
  );
});

AuthenticationEventIdCallout.displayName = 'AuthenticationEventIdCallout';
