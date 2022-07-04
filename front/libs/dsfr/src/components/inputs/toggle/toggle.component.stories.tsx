import { ComponentMeta } from '@storybook/react';

import { ToggleComponent, ToggleComponentProps } from './toggle.component';

export default {
  component: ToggleComponent,
  title: 'DSFR/components/toogle/ToggleComponent',
} as ComponentMeta<typeof ToggleComponent>;

export const Default = (args: ToggleComponentProps) => <ToggleComponent {...args} />;

export const WithFunctionLabel = (args: ToggleComponentProps) => <ToggleComponent {...args} />;

Default.args = {
  input: {
    name: 'checkbox',
  },
  label: 'Toggle label',
  legend: { checked: 'Activé', unchecked: 'Désactivé' },
} as ToggleComponentProps;

// @TODO: Create a type for this story args
WithFunctionLabel.args = {
  input: {
    name: 'checkbox',
  },
  label: () => 'Result function label',
  legend: { checked: 'Activé', unchecked: 'Désactivé' },
} as unknown as ToggleComponentProps;
