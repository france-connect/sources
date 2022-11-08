import { useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';

import { useScrollTo } from '@fc/common';

import { IUsePaginationHook, Pagination } from '../../interfaces';
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
  const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });
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
  const navigationNumbers = !isTabletOrDesktop
    ? getMobileNavigationNumbers(navNumbersParams)
    : getNavigationNumbers({
        ...navNumbersParams,
        numberOfPagesShownIntoNavigation,
      });

  const desktopDisplayParams = getDisplayParameters({
    currentPage,
    isMobile: !isTabletOrDesktop,
    numberOfPagesShownIntoNavigation,
    pagesCount,
  });

  return {
    currentPage,
    isTabletOrDesktop,
    navigationNumbers,
    pagesCount,
    paginationChangeHandler,
    ...desktopDisplayParams,
  };
};
