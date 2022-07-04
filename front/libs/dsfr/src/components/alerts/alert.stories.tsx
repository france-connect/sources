import { ComponentMeta } from '@storybook/react';

import { AlertTypes, Sizes } from '../../enums';
import { Alert, AlertProps } from './alert.component';

export default {
  component: Alert,
  title: 'DSFR/components/alerts/Alert',
} as ComponentMeta<typeof Alert>;

export const Default = (args: AlertProps) => <Alert {...args} />;

Default.args = {
  children: <p>box Error, success, info or warning</p>,
  size: Sizes.SMALL,
  type: AlertTypes.ERROR,
} as AlertProps;
