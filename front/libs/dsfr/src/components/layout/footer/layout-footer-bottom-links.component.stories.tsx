import { ComponentMeta } from '@storybook/react';

import { withRouter } from '@fc/storybook-config/decorators/with-router';

import {
  LayoutFooterBottomLinksComponent,
  LayoutFooterBottomLinksComponentProps,
} from './layout-footer-bottom-links.component';

export default {
  component: LayoutFooterBottomLinksComponent,
  decorators: [withRouter],
  title: 'DSFR/components/layout/footer/LayoutFooterBottomLinksComponent',
} as ComponentMeta<typeof LayoutFooterBottomLinksComponent>;

export const Default = (args: LayoutFooterBottomLinksComponentProps) => (
  <LayoutFooterBottomLinksComponent {...args} />
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
} as LayoutFooterBottomLinksComponentProps;
