import { useCallback } from 'react';

import { useScrollTo } from '@fc/common';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import type { IUsePaginationHook, Pagination } from '../../interfaces';
import {
  getCurrentPage,
  getDisplayParameters,
  getMobileNavigationNumbers,
  getNavigationNumbers,
  getPagesCount,
} from './pagination.utils';

interface usePaginationProps {
  numberOfPagesShownIntoNavigation: number;
  onPageClick: (nextOffset: number) => void;
  pagination: Pagination;
}

export const usePagination = ({
  numberOfPagesShownIntoNavigation,
  onPageClick,
  pagination,
}: usePaginationProps): IUsePaginationHook => {
  const [breakpointMd] = useStylesVariables('breakpoint-md');

  const gtTablet = useStylesQuery({ minWidth: breakpointMd });
  const { scrollToTop } = useScrollTo();

  const { offset, size, total } = pagination;

  const paginationChangeHandler = useCallback(
    (nextPage: number) => {
      const nextOffset = nextPage * size;
      onPageClick(nextOffset);
      scrollToTop();
    },
    [size, onPageClick, scrollToTop],
  );

  const pagesCount = getPagesCount({
    itemsPerPage: size,
    totalItems: total,
  });

  const currentPage = getCurrentPage({
    currentElementIndexIntoTheList: offset,
    itemsPerPage: size,
  });

  const navNumbersParams = {
    currentPage,
    pagesCount,
  };
  const navigationNumbers = !gtTablet
    ? getMobileNavigationNumbers(navNumbersParams)
    : getNavigationNumbers({
        ...navNumbersParams,
        numberOfPagesShownIntoNavigation,
      });

  const desktopDisplayParams = getDisplayParameters({
    currentPage,
    isMobile: !gtTablet,
    numberOfPagesShownIntoNavigation,
    pagesCount,
  });

  return {
    currentPage,
    gtTablet,
    navigationNumbers,
    pagesCount,
    paginationChangeHandler,
    ...desktopDisplayParams,
  };
};
