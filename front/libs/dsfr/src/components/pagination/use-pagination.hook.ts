import { useCallback } from 'react';

import { Pagination } from '../../interfaces';
import {
  getCurrentPage,
  getEllipsis,
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
}: usePaginationProps) => {
  const { offset, size, total } = pagination;

  const paginationChangeHandler = useCallback(
    (nextPage: number) => {
      const nextOffset = nextPage * pagination.size;
      onPageClick(nextOffset);
    },
    [pagination.size, onPageClick],
  );

  const pagesCount = getPagesCount({
    itemsPerPage: size,
    totalItems: total,
  });

  const currentPage = getCurrentPage({
    currentElementIndexIntoTheList: offset,
    itemsPerPage: size,
  });

  const navigationNumbers = getNavigationNumbers({
    currentPage,
    numberOfPagesShownIntoNavigation,
    pagesCount,
  });

  const { showFirstEllipsis, showFirstPage, showLastEllipsis, showLastPage } = getEllipsis({
    currentPage,
    numberOfPagesShownIntoNavigation,
    pagesCount,
  });

  return {
    currentPage,
    navigationNumbers,
    pagesCount,
    paginationChangeHandler,
    showFirstEllipsis,
    showFirstPage,
    showLastEllipsis,
    showLastPage,
  };
};
