import { ComponentMeta } from '@storybook/react';

import { Sizes } from '../../enums';
import { LinkComponent, LinkComponentProps } from './link.component';

export default {
  component: LinkComponent,
  title: 'DSFR/components/link/LinkComponent',
} as ComponentMeta<typeof LinkComponent>;

export const Default = (args: LinkComponentProps) => <LinkComponent {...args} />;

Default.args = {
  href: '/url',
  label: 'link',
  size: Sizes.MEDIUM,
} as LinkComponentProps;
