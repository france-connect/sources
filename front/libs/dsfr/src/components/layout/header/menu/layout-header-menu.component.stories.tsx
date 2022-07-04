import { ComponentMeta } from '@storybook/react';

import { AppContextProvider } from '@fc/state-management';
import { withRouter } from '@fc/storybook-config/decorators/with-router';

import {
  LayoutHeaderMenuComponent,
  LayoutHeaderMenuComponentProps,
} from './layout-header-menu.component';

export default {
  component: LayoutHeaderMenuComponent,
  decorators: [withRouter],
  title: 'DSFR/components/layout/header/menu/LayoutHeaderMenuComponent',
} as ComponentMeta<typeof LayoutHeaderMenuComponent>;

export const Default = (args: LayoutHeaderMenuComponentProps) => (
  <AppContextProvider
    value={{
      config: {
        OidcClient: {
          endpoints: {
            endSessionUrl: '/endSessionUrl',
            returnButtonUrl: '/returnButtonUrl',
          },
        },
      },
    }}>
    <LayoutHeaderMenuComponent {...args} />
  </AppContextProvider>
);

Default.args = {
  familyName: 'De Gaulle',
  givenName: 'Charles',
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
  opened: true,
};
