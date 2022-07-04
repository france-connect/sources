import { ComponentMeta } from '@storybook/react';

import { FranceConnectButton, FranceConnectButtonProps } from './france-connect.button';

export default {
  component: FranceConnectButton,
  title: 'DSFR/components/buttons/FranceConnectButton',
} as ComponentMeta<typeof FranceConnectButton>;

export const Default = (args: FranceConnectButtonProps) => <FranceConnectButton {...args} />;
Default.args = {} as FranceConnectButtonProps;
