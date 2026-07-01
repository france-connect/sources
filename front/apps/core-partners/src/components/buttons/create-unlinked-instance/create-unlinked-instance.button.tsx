import React from 'react';

import { IconPlacement, LinkButton, Priorities } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const CreateUnlinkedInstanceButton = React.memo(() => (
  <LinkButton
    noOutline
    dataTestId="CreateUnlinkedInstanceButton"
    icon="add-line"
    iconPlacement={IconPlacement.LEFT}
    link="creer-instance"
    priority={Priorities.TERTIARY}>
    {t('CorePartners.instancesPage.createUnlinkedInstance.button')}
  </LinkButton>
));

CreateUnlinkedInstanceButton.displayName = 'CreateUnlinkedInstanceButton';
