import React from 'react';

import { IconPlacement, LinkButton, Priorities } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const LinkInstancesButton = React.memo(() => (
  <LinkButton
    dataTestId="service-provider-link-instances-button"
    icon="links-line"
    iconPlacement={IconPlacement.LEFT}
    link="link-instances"
    priority={Priorities.SECONDARY}>
    {t('CorePartners.serviceProviderPage.linkInstances.button')}
  </LinkButton>
));

LinkInstancesButton.displayName = 'LinkInstancesButton';
