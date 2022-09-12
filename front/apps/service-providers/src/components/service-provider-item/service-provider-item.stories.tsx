import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ServiceProviderStatusColors } from '@fc/partners';

import {
  ServiceProviderItemComponent,
  ServiceProviderItemComponentProps,
} from './service-provider-item.component';

export default {
  component: ServiceProviderItemComponent,
  title: 'ServiceProvider/components/serviceProviderItemComponent',
} as ComponentMeta<typeof ServiceProviderItemComponent>;

const Template: ComponentStory<typeof ServiceProviderItemComponent> = (
  args: ServiceProviderItemComponentProps,
) => (
  <React.Fragment>
    <ServiceProviderItemComponent {...args} />
    <ServiceProviderItemComponent
      {...args}
      color={ServiceProviderStatusColors.REVIEW_REQUESTED}
      status="en attente de recette"
    />
    <ServiceProviderItemComponent
      {...args}
      color={ServiceProviderStatusColors.REVIEW_IN_PROGRESS}
      status="recette en cours"
    />
    <ServiceProviderItemComponent
      {...args}
      color={ServiceProviderStatusColors.REVIEW_VALIDATED}
      status="recette validée"
    />
    <ServiceProviderItemComponent
      {...args}
      color={ServiceProviderStatusColors.REVIEW_WAITING_CLIENT_FEEDBACK}
      status="en attente de retour"
    />
    <ServiceProviderItemComponent
      {...args}
      color={ServiceProviderStatusColors.REVIEW_REFUSED}
      status="recette refusée"
    />
    <ServiceProviderItemComponent
      {...args}
      color={ServiceProviderStatusColors.PRODUCTION_ACCESS_PENDING}
      organisationName="Un nom d’organisation interminable pour être sûr que ça ne casse pas les maquettes lorsque ça passe sur deux lignes aussi"
      spName="Un nom de fournisseur de service qui serait vraiment très long, si long qu’il passe sur deux lignes, mais il faudrait ne pas faire ça dans la mesure du possible"
      status="en attente d'accès à la production"
    />
    <ServiceProviderItemComponent
      {...args}
      color={ServiceProviderStatusColors.PRODUCTION_READY}
      organisationName="Un nom d’organisation interminable pour être sûr que ça ne casse pas les maquettes lorsque ça passe sur deux lignes aussi"
      spName="Un nom de fournisseur de service qui serait vraiment très long, si long qu’il passe sur deux lignes, mais il faudrait ne pas faire ça dans la mesure du possible"
      status="prêt à mettre en production"
    />
    <ServiceProviderItemComponent
      {...args}
      color={ServiceProviderStatusColors.PRODUCTION_LIVE}
      status="en production"
    />
    <ServiceProviderItemComponent
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
} as ServiceProviderItemComponentProps;
