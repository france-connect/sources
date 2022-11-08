import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ServiceProviderStatusColors } from '@fc/partners';

import {
  ServiceProvidersListItemComponent,
  ServiceProvidersListItemComponentProps,
} from './service-providers-list-item.component';

export default {
  component: ServiceProvidersListItemComponent,
  title: 'ServiceProvider/components/ServiceProvidersListItemComponent',
} as ComponentMeta<typeof ServiceProvidersListItemComponent>;

const Template: ComponentStory<typeof ServiceProvidersListItemComponent> = (
  args: ServiceProvidersListItemComponentProps,
) => (
  <React.Fragment>
    <ServiceProvidersListItemComponent {...args} />
    <ServiceProvidersListItemComponent
      {...args}
      color={ServiceProviderStatusColors.REVIEW_REQUESTED}
      status="en attente de recette"
    />
    <ServiceProvidersListItemComponent
      {...args}
      color={ServiceProviderStatusColors.REVIEW_IN_PROGRESS}
      status="recette en cours"
    />
    <ServiceProvidersListItemComponent
      {...args}
      color={ServiceProviderStatusColors.REVIEW_VALIDATED}
      status="recette validée"
    />
    <ServiceProvidersListItemComponent
      {...args}
      color={ServiceProviderStatusColors.REVIEW_WAITING_CLIENT_FEEDBACK}
      status="en attente de retour"
    />
    <ServiceProvidersListItemComponent
      {...args}
      color={ServiceProviderStatusColors.REVIEW_REFUSED}
      status="recette refusée"
    />
    <ServiceProvidersListItemComponent
      {...args}
      color={ServiceProviderStatusColors.PRODUCTION_ACCESS_PENDING}
      organisationName="Un nom d’organisation interminable pour être sûr que ça ne casse pas les maquettes lorsque ça passe sur deux lignes aussi"
      spName="Un nom de fournisseur de service qui serait vraiment très long, si long qu’il passe sur deux lignes, mais il faudrait ne pas faire ça dans la mesure du possible"
      status="en attente d'accès à la production"
    />
    <ServiceProvidersListItemComponent
      {...args}
      color={ServiceProviderStatusColors.PRODUCTION_READY}
      organisationName="Un nom d’organisation interminable pour être sûr que ça ne casse pas les maquettes lorsque ça passe sur deux lignes aussi"
      spName="Un nom de fournisseur de service qui serait vraiment très long, si long qu’il passe sur deux lignes, mais il faudrait ne pas faire ça dans la mesure du possible"
      status="prêt à mettre en production"
    />
    <ServiceProvidersListItemComponent
      {...args}
      color={ServiceProviderStatusColors.PRODUCTION_LIVE}
      status="en production"
    />
    <ServiceProvidersListItemComponent
      {...args}
      color={ServiceProviderStatusColors.ARCHIVED}
      status="archivé"
    />
  </React.Fragment>
);

export const Default = Template.bind({});

Default.args = {
  color: ServiceProviderStatusColors.SANDBOX,
  createdAt: 'Créé le 23/02/2022',
  datapassId: 'Datapass N°123',
  organisationName: 'Direction Interministérielle du Numérique',
  platformName: 'FranceConnect',
  spName: 'Portail des demandes de badges Ségur-Fontenoy',
  status: 'en intégration',
} as ServiceProvidersListItemComponentProps;
