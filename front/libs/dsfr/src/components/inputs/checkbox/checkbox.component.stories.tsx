import { ComponentMeta } from '@storybook/react';

import { CheckboxComponent, CheckboxComponentProps } from './checkbox.component';

export default {
  component: CheckboxComponent,
  title: 'DSFR/components/inputs/CheckboxComponent',
} as ComponentMeta<typeof CheckboxComponent>;

export const Default = (args: CheckboxComponentProps) => <CheckboxComponent {...args} />;

Default.args = {
  input: {
    name: 'checkbox',
  },
  label: 'Checkbox Label',
} as CheckboxComponentProps;
