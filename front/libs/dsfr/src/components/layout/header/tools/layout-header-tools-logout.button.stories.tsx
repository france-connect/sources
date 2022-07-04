import { ComponentMeta } from '@storybook/react';

import {
  LayoutHeaderToolsLogoutButton,
  LayoutHeaderToolsLogoutButtonProps,
} from './layout-header-tools-logout.button';

export default {
  component: LayoutHeaderToolsLogoutButton,
  title: 'DSFR/components/layout/header/tools/LayoutHeaderToolsLogoutButton',
} as ComponentMeta<typeof LayoutHeaderToolsLogoutButton>;

export const Default = (args: LayoutHeaderToolsLogoutButtonProps) => (
  <LayoutHeaderToolsLogoutButton {...args} />
);

Default.args = {
  endSessionUrl: '/endSessionUrl',
  isMobile: false,
} as LayoutHeaderToolsLogoutButtonProps;
