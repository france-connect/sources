import { ComponentMeta } from '@storybook/react';

import { AppContextProvider } from '@fc/state-management';
import { withRouter } from '@fc/storybook-config/decorators/with-router';

import { LayoutFooterComponent, LayoutFooterComponentProps } from './layout-footer.component';

export default {
  component: LayoutFooterComponent,
  decorators: [withRouter],
  title: 'DSFR/components/layout/footer/LayoutFooterComponent',
} as ComponentMeta<typeof LayoutFooterComponent>;

export const Default = (args: LayoutFooterComponentProps) => (
  <AppContextProvider
    value={{
      config: {
        Layout: {
          bottomLinks: [
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
          footerDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          logo: 'https://franceconnect.gouv.fr/images/fc_logo_v2.png',
        },
      },
    }}>
    <LayoutFooterComponent {...args} />
  </AppContextProvider>
);

Default.args = {
  topLinks: [
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
} as LayoutFooterComponentProps;

export const WithoutLogo = (args: LayoutFooterComponentProps) => (
  <AppContextProvider
    value={{
      config: {
        Layout: {
          bottomLinks: [
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
          footerDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
      },
    }}>
    <LayoutFooterComponent {...args} />
  </AppContextProvider>
);

WithoutLogo.args = {
  topLinks: [
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
} as LayoutFooterComponentProps;

export const WithoutFooterDescription = (args: LayoutFooterComponentProps) => (
  <AppContextProvider
    value={{
      config: {
        Layout: {
          bottomLinks: [
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
          logo: 'https://franceconnect.gouv.fr/images/fc_logo_v2.png',
        },
      },
    }}>
    <LayoutFooterComponent {...args} />
  </AppContextProvider>
);

WithoutFooterDescription.args = {
  topLinks: [
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
} as LayoutFooterComponentProps;
