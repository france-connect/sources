import { ComponentMeta } from '@storybook/react';

import { Sizes } from '../../../enums';
import { AlertMessageComponent, AlertMessageComponentProps } from './alert-message.component';

export default {
  component: AlertMessageComponent,
  title: 'DSFR/components/alerts/alert-error/alert-error/AlertMessageComponent',
} as ComponentMeta<typeof AlertMessageComponent>;

export const Default = (args: AlertMessageComponentProps) => <AlertMessageComponent {...args} />;

Default.args = {
  closable: true,
  description: 'description de vote erreur',
  size: Sizes.MEDIUM,
  title: 'titre de votre erreur,',
} as AlertMessageComponentProps;
