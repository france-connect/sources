import React from 'react';

import { IconPlacement, LinkButton, Priorities } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const CreateLinkedInstanceButton = React.memo(() => (
  <LinkButton
    noOutline
    dataTestId="CreateLinkedInstanceButton"
    icon="add-line"
    iconPlacement={IconPlacement.LEFT}
    link="creer-instance"
    priority={Priorities.PRIMARY}>
    {t('CorePartners.serviceProviderPage.createLinkedInstance.button')}
  </LinkButton>
));

CreateLinkedInstanceButton.displayName = 'CreateLinkedInstanceButton';
