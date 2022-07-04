import { ComponentMeta } from '@storybook/react';

import {
  LayoutFooterContentLinksComponent,
  LayoutFooterContentLinksComponentProps,
} from './layout-footer-content-links.component';

export default {
  component: LayoutFooterContentLinksComponent,
  title: 'DSFR/components/layout/footer/LayoutFooterContentLinksComponent',
} as ComponentMeta<typeof LayoutFooterContentLinksComponent>;

export const Default = (args: LayoutFooterContentLinksComponentProps) => (
  <LayoutFooterContentLinksComponent {...args} />
);

Default.args = {
  items: [
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
} as LayoutFooterContentLinksComponentProps;
