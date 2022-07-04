import { ComponentMeta } from '@storybook/react';

import {
  LayoutHeaderToolsAccountComponent,
  LayoutHeaderToolsAccountComponentProps,
} from './layout-header-tools-account.component';

export default {
  component: LayoutHeaderToolsAccountComponent,
  title: 'DSFR/components/layout/header/tools/LayoutHeaderToolsAccountComponent',
} as ComponentMeta<typeof LayoutHeaderToolsAccountComponent>;

export const Default = (args: LayoutHeaderToolsAccountComponentProps) => (
  <LayoutHeaderToolsAccountComponent {...args} />
);

Default.args = {
  firstname: 'Rocky',
  isMobile: false,
  lastname: 'Balboa',
} as LayoutHeaderToolsAccountComponentProps;
