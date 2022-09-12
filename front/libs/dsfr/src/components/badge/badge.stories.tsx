import { ComponentMeta } from '@storybook/react';
import { RiAccountCircleFill as UserIcon } from 'react-icons/ri';

import { ServiceProviderStatusColors } from '@fc/partners';

import { Sizes } from '../../enums';
import { BadgeComponent, BadgeComponentProps } from './badge.component';

export default {
  component: BadgeComponent,
  title: 'DSFR/components/badge/BadgeComponent',
} as ComponentMeta<typeof BadgeComponent>;

export const Default = (args: BadgeComponentProps) => <BadgeComponent {...args} />;

export const WithCustomIcon = (args: BadgeComponentProps) => <BadgeComponent {...args} />;

Default.args = {
  label: 'badge',
  noIcon: false,
  size: Sizes.MEDIUM,
} as BadgeComponentProps;

WithCustomIcon.args = {
  colorName: ServiceProviderStatusColors.REVIEW_WAITING_CLIENT_FEEDBACK,
  icon: UserIcon,
  label: 'badge',
  noIcon: false,
  size: Sizes.MEDIUM,
} as BadgeComponentProps;
