import { ComponentMeta } from '@storybook/react';

import { LayoutFooterLicenceComponent } from './layout-footer-licence.component';

export default {
  component: LayoutFooterLicenceComponent,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  title: 'DSFR/components/layout/footer/LayoutFooterLicenceComponent',
} as ComponentMeta<typeof LayoutFooterLicenceComponent>;

export const Default = () => <LayoutFooterLicenceComponent />;
