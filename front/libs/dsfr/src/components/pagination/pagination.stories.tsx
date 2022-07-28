import { useArgs } from '@storybook/client-api';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import {
  DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION,
  PaginationComponent,
  PaginationComponentProps,
} from './pagination.component';

export default {
  component: PaginationComponent,
  title: 'DSFR/components/pagination/PaginationComponent',
} as ComponentMeta<typeof PaginationComponent>;

const Template: ComponentStory<typeof PaginationComponent> = (args: PaginationComponentProps) => {
  const [, updateArgs] = useArgs();
  const handleOnPageClick = (nextOffset: Number) => {
    const { pagination } = args;
    const { size, total } = pagination;
    const nextPagination = { offset: nextOffset, size, total };
    updateArgs({ ...args, pagination: nextPagination });
  };
  return <PaginationComponent {...args} onPageClick={handleOnPageClick} />;
};

export const Default = Template.bind({});
Default.args = {
  numberOfPagesShownIntoNavigation: DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION,
  pagination: {
    offset: 1,
    size: 3,
    total: 200,
  },
  useEdgeArrows: true,
  useEllipsis: true,
  useNavArrows: true,
} as unknown as PaginationComponentProps;

export const WithSixPagesAndSevenItems = Template.bind({});
WithSixPagesAndSevenItems.args = {
  numberOfPagesShownIntoNavigation: 7,
  pagination: {
    offset: 1,
    size: 5,
    total: 30,
  },
  useEdgeArrows: true,
  useEllipsis: true,
  useNavArrows: true,
} as unknown as PaginationComponentProps;

export const WithThreePages = Template.bind({});
WithThreePages.args = {
  numberOfPagesShownIntoNavigation: DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION,
  pagination: {
    offset: 1,
    size: 10,
    total: 30,
  },
  useEdgeArrows: true,
  useEllipsis: true,
  useNavArrows: true,
} as unknown as PaginationComponentProps;

export const WithOnePage = Template.bind({});
WithOnePage.args = {
  numberOfPagesShownIntoNavigation: DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION,
  pagination: {
    offset: 1,
    size: 10,
    total: 10,
  },
  useEdgeArrows: true,
  useEllipsis: true,
  useNavArrows: true,
} as unknown as PaginationComponentProps;
