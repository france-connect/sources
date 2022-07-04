import { ComponentMeta } from '@storybook/react';

import { AppContextProvider } from '@fc/state-management';
import { withRouter } from '@fc/storybook-config/decorators/with-router';

import { ReturnButtonComponent, ReturnButtonComponentProps } from './return-button.component';

export default {
  component: ReturnButtonComponent,
  decorators: [withRouter],
  title: 'DSFR/components/layout/header/return-button/ReturnButtonComponent',
} as ComponentMeta<typeof ReturnButtonComponent>;

export const Default = (args: ReturnButtonComponentProps) => (
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
    <ReturnButtonComponent {...args} />
  </AppContextProvider>
);

Default.args = {
  url: '/foo',
} as ReturnButtonComponentProps;
