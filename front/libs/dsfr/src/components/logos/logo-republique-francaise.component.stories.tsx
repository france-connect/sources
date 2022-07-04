import { ComponentMeta } from '@storybook/react';

import { LogoRepubliqueFrancaiseComponent } from './logo-republique-francaise.component';

export default {
  component: LogoRepubliqueFrancaiseComponent,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  title: 'DSFR/components/logos/LogoRepubliqueFrancaiseComponent',
} as ComponentMeta<typeof LogoRepubliqueFrancaiseComponent>;

export const Default = () => <LogoRepubliqueFrancaiseComponent />;
