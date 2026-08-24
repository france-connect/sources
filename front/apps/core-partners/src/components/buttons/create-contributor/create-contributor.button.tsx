import React from 'react';

import { IconPlacement, LinkButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const CreateContributorButton = React.memo(() => (
  <LinkButton
    dataTestId="service-provider-create-contributor-button"
    icon="user-add-line"
    iconPlacement={IconPlacement.LEFT}
    link="ajouter-contributeur">
    {t('Partners.serviceProviderPage.usersSection.contributorCreate.button')}
  </LinkButton>
));

CreateContributorButton.displayName = 'CreateContributorButton';
