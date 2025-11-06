import React from 'react';
import { useToggle } from 'usehooks-ts';

import { AccordionComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const IdentityTheftReportHelpEventIdAccordionComponent = React.memo(() => {
  const [expanded, toggleExpanded] = useToggle(false);

  const title = t('IdentityTheftReport.code.title');
  const description = t('IdentityTheftReport.code.description');

  return (
    <AccordionComponent
      className="fr-mt-8w"
      opened={expanded}
      title={title}
      onClick={toggleExpanded}>
      <p className="fr-background-alt--grey fr-px-2w fr-py-3w fr-mb-0">
        {description}
        <img
          alt={title}
          className="fr-responsive-img fr-mt-2w"
          src="/images/fraud/mail-notification-connexion.png"
        />
      </p>
    </AccordionComponent>
  );
});

IdentityTheftReportHelpEventIdAccordionComponent.displayName =
  'IdentityTheftReportHelpEventIdAccordionComponent';
