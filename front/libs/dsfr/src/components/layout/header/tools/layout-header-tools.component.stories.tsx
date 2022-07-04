import { ComponentMeta } from '@storybook/react';

import { AppContextProvider } from '@fc/state-management';
import { withRouter } from '@fc/storybook-config/decorators/with-router';

import {
  LayoutHeaderToolsComponent,
  LayoutHeaderToolsComponentProps,
} from './layout-header-tools.component';

export default {
  component: LayoutHeaderToolsComponent,
  decorators: [withRouter],
  title: 'DSFR/components/layout/header/tools/LayoutHeaderToolsComponent',
} as ComponentMeta<typeof LayoutHeaderToolsComponent>;

export const Default = (args: LayoutHeaderToolsComponentProps) => (
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
    <LayoutHeaderToolsComponent {...args} />
  </AppContextProvider>
);
Default.args = {
  familyName: 'Balboa',
  givenName: 'Rocky',
} as LayoutHeaderToolsComponentProps;
