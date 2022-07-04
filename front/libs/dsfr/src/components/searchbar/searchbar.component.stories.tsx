import { ComponentMeta } from '@storybook/react';

import { SearchBarComponent, SearchBarComponentProps } from './searchbar.component';

export default {
  component: SearchBarComponent,
  title: 'DSFR/components/searchbar/SearchBarComponent',
} as ComponentMeta<typeof SearchBarComponent>;

export const Default = (args: SearchBarComponentProps) => <SearchBarComponent {...args} />;

Default.args = {
  buttonLabel: 'label',
  input: {
    name: 'input label',
  },
  placeholder: 'placeholder',
  size: 'md',
};
