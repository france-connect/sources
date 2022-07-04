import { ComponentMeta } from '@storybook/react';

import { withRouter } from '@fc/storybook-config/decorators/with-router';

import {
  LayoutHeaderLogosComponent,
  LayoutHeaderLogosComponentProps,
} from './layout-header-logos.component';

export default {
  component: LayoutHeaderLogosComponent,
  decorators: [withRouter],
  title: 'DSFR/components/layout/header/logos/LayoutHeaderLogosComponent',
} as ComponentMeta<typeof LayoutHeaderLogosComponent>;

export const Default = (args: LayoutHeaderLogosComponentProps) => (
  <LayoutHeaderLogosComponent {...args} />
);
