import { ComponentMeta } from '@storybook/react';

import { ToggleInputComponent, ToggleInputComponentProps } from './toggle-input.component';

export default {
  component: ToggleInputComponent,
  title: 'DSFR/components/toogle/ToggleInputComponent',
} as ComponentMeta<typeof ToggleInputComponent>;

export const Default = (args: ToggleInputComponentProps) => <ToggleInputComponent {...args} />;

Default.args = {
  input: {
    name: 'checkbox',
  },
} as ToggleInputComponentProps;
