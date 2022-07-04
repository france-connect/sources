import { ComponentMeta } from '@storybook/react';

import { MyComponent, MyComponentProps } from './my-component-module';

export default {
  component: MyComponent,
  title: 'Project/components/MyComponent',
} as ComponentMeta<typeof MyComponent>;

export const Default = (args: MyComponentProps) => <MyComponent {...args} />;
Default.args = {} as MyComponentProps;
