import { ComponentMeta } from '@storybook/react';

import { Priorities, Sizes } from '../../enums';
import { SimpleButton, SimpleButtonProps } from './simple.button';

export default {
  component: SimpleButton,
  title: 'DSFR/components/buttons/SimpleButton',
} as ComponentMeta<typeof SimpleButton>;

export const Default = (args: SimpleButtonProps) => <SimpleButton {...args} />;

Default.args = {
  label: 'Simple Button',
  noOutline: false,
  priority: Priorities.PRIMARY,
  size: Sizes.MEDIUM,
} as SimpleButtonProps;
