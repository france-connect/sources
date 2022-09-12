import { ComponentMeta, ComponentStory } from '@storybook/react';

import { withRouter } from '@fc/storybook-config/decorators/with-router';

import {
  LayoutHeaderServiceComponent,
  LayoutHeaderServiceComponentProps,
} from './layout-header-service.component';

export default {
  component: LayoutHeaderServiceComponent,
  decorators: [withRouter],
  title: 'DSFR/components/layout/header/service/LayoutHeaderServiceComponent',
} as ComponentMeta<typeof LayoutHeaderServiceComponent>;

const Template: ComponentStory<typeof LayoutHeaderServiceComponent> = (
  args: LayoutHeaderServiceComponentProps,
) => <LayoutHeaderServiceComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  service: {
    name: 'Nom du service',
    title: 'Titre du service',
  },
};

export const WithBaseline = Template.bind({});
WithBaseline.args = {
  service: {
    baseline: 'Ceci est la baseline du service',
    name: 'Nom du service',
    title: 'Titre du service',
  },
};

export const WithHref = Template.bind({});
WithHref.args = {
  service: {
    href: '/page-accueil-service',
    name: 'Nom du service',
    title: 'Titre du service',
  },
};
