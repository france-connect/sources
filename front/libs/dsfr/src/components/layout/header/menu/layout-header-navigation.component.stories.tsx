import { ComponentMeta } from '@storybook/react';

import { withRouter } from '@fc/storybook-config/decorators/with-router';

import {
  LayoutHeaderNavigationComponent,
  LayoutHeaderNavigationComponentProps,
} from './layout-header-navigation.component';

export default {
  component: LayoutHeaderNavigationComponent,
  decorators: [withRouter],
  title: 'DSFR/components/layout/header/menu/LayoutHeaderNavigationComponent',
} as ComponentMeta<typeof LayoutHeaderNavigationComponent>;

export const Default = (args: LayoutHeaderNavigationComponentProps) => (
  <LayoutHeaderNavigationComponent {...args} />
);

Default.args = {
  navigationItems: [
    {
      a11y: 'Google',
      href: 'https://www.google.com/',
      label: 'Google',
    },
    {
      a11y: 'DuckDuckGo',
      href: 'https://duckduckgo.com/',
      label: 'DuckDuckGo',
    },
    {
      a11y: 'Qwant',
      href: 'https://www.qwant.com/',
      label: 'Qwant',
    },
  ],
} as LayoutHeaderNavigationComponentProps;
