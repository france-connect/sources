import React from 'react';

import { IconPlacement, LinkButton, Priorities } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const CreateInstanceButton = React.memo(() => (
  <LinkButton
    noOutline
    dataTestId="CreateInstanceButton"
    icon="add-line"
    iconPlacement={IconPlacement.LEFT}
    link="create"
    priority={Priorities.TERTIARY}>
    {t('Partners.button.createInstance')}
  </LinkButton>
));

CreateInstanceButton.displayName = 'CreateInstanceButton';
