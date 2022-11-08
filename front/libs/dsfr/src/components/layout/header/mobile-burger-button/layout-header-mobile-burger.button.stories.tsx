import { ComponentMeta } from '@storybook/react';

import {
  LayoutHeaderMobileBurgerButton,
  LayoutHeaderMobileBurgerButtonProps,
} from './layout-header-mobile-burger.button';

export default {
  component: LayoutHeaderMobileBurgerButton,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  title: 'DSFR/Components/layout/header/LayoutHeaderMobileBurgerButton',
} as ComponentMeta<typeof LayoutHeaderMobileBurgerButton>;

export const Default = (args: LayoutHeaderMobileBurgerButtonProps) => (
  <LayoutHeaderMobileBurgerButton {...args} />
);

Default.args = {
  opened: true,
} as LayoutHeaderMobileBurgerButtonProps;
