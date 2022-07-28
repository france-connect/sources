import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { AlertTypes, Sizes } from '../../enums';
import { AlertComponent, AlertComponentProps } from './alert.component';

export default {
  argTypes: {
    noRole: {
      control: false,
    },
    size: {
      control: false,
    },
  },
  component: AlertComponent,
  title: 'DSFR/components/alerts/Alert',
} as ComponentMeta<typeof AlertComponent>;

const Template: ComponentStory<typeof AlertComponent> = (args: AlertComponentProps) => (
  <React.Fragment>
    <AlertComponent {...args} size={Sizes.SMALL}>
      <p>Information : titre de l&#39;information</p>
    </AlertComponent>
    <AlertComponent {...args} size={Sizes.MEDIUM}>
      <p className="fr-alert__title">Erreur : description détaillée du message....</p>
      <p>
        Description détaillée du message Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </AlertComponent>
  </React.Fragment>
);

export const Default = Template.bind({});
Default.args = {
  type: AlertTypes.INFO,
} as AlertComponentProps;
