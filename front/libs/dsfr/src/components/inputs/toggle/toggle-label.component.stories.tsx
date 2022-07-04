import { ComponentMeta } from '@storybook/react';

import { ToggleLabelComponent, ToggleLabelComponentProps } from './toggle-label.component';

export default {
  component: ToggleLabelComponent,
  title: 'DSFR/components/toogle/ToggleLabelComponent',
} as ComponentMeta<typeof ToggleLabelComponent>;

export const Default = (args: ToggleLabelComponentProps) => <ToggleLabelComponent {...args} />;

export const WithFunctionLabel = (args: ToggleLabelComponentProps) => (
  <ToggleLabelComponent {...args} />
);

Default.args = {
  input: {
    name: 'checkbox',
  },
  label: 'Toggle label',
  legend: { checked: 'Activé', unchecked: 'Désactivé' },
} as ToggleLabelComponentProps;

WithFunctionLabel.args = {
  input: {
    name: 'checkbox',
  },
  label: () => 'Result function label',
  legend: { checked: 'Activé', unchecked: 'Désactivé' },
} as unknown as ToggleLabelComponentProps;
