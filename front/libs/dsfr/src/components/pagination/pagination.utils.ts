/**
 * @TODO renommer en services/static plutot qu'un utils ?
 * pro/cons
 */
import lodashRange from 'lodash.range';

import type {
  IDesktopDisplayParams,
  IGetCurrentPage,
  IGetDisplayParameters,
  IGetNavigationNumbers,
  IGetPagesCount,
} from '../../interfaces';

export const getPagesCount = ({ itemsPerPage, totalItems }: IGetPagesCount): number => {
  const pagesCount = Math.ceil(totalItems / itemsPerPage);
  return pagesCount;
};

export const getCurrentPage = ({
  currentElementIndexIntoTheList,
  itemsPerPage,
}: IGetCurrentPage): number => {
  const zeroIndexCurrentPage = Math.floor(currentElementIndexIntoTheList / itemsPerPage);
  return zeroIndexCurrentPage;
};

// récupération du tableau d'indices des pages à afficher en desktop
export const getNavigationNumbers = ({
  currentPage: zeroIndexCurrentPage,
  numberOfPagesShownIntoNavigation,
  pagesCount,
}: IGetNavigationNumbers): number[] => {
  if (!pagesCount || !numberOfPagesShownIntoNavigation || Number.isNaN(zeroIndexCurrentPage)) {
    return [];
  }
  // @NOTE taking the lower number,
  // prevents to ovelap the max nb of pages to be showned
  const limit = Math.min(numberOfPagesShownIntoNavigation, pagesCount);
  const midLimit = limit / 2;

  // @NOTE if lower than, taking zero as starting point
  let startRange = Math.ceil(zeroIndexCurrentPage - midLimit);
  startRange = Math.max(0, startRange);

  let endRange = Math.floor(zeroIndexCurrentPage + midLimit);
  endRange = Math.max(startRange + limit, endRange);

  // @NOTE reminder pagesCount is not a zero index
  const isLastSection = pagesCount - numberOfPagesShownIntoNavigation / 2 <= zeroIndexCurrentPage;
  if (isLastSection) {
    const hasLessPagesThanTheDefinedRange = pagesCount < numberOfPagesShownIntoNavigation;
    const removable = hasLessPagesThanTheDefinedRange
      ? pagesCount
      : numberOfPagesShownIntoNavigation;
    endRange = pagesCount;
    startRange = endRange - removable;
  }

  const navigationNumbers = lodashRange(startRange, endRange);
  return navigationNumbers;
};

// récupération du tableau d'indices des pages à afficher en mobile
export const getMobileNavigationNumbers = ({
  currentPage: zeroIndexCurrentPage,
  pagesCount,
}: IGetNavigationNumbers): number[] => {
  const maxNumberOfPagesShownIntoNavigation = 3;

  if (pagesCount <= maxNumberOfPagesShownIntoNavigation) {
    return [...Array(pagesCount).keys()];
  }

  const lastPage = pagesCount - 1;
  let middlePage = zeroIndexCurrentPage;

  if (zeroIndexCurrentPage === 0) {
    middlePage = 1;
  }

  if (zeroIndexCurrentPage === lastPage) {
    middlePage = lastPage - 1;
  }

  return [middlePage - 1, middlePage, lastPage];
};

export const getDisplayParameters = ({
  currentPage,
  isMobile,
  numberOfPagesShownIntoNavigation,
  pagesCount,
}: IGetDisplayParameters): IDesktopDisplayParams => {
  if (isMobile) {
    return {
      showFirstEllipsis: false,
      showFirstPage: false,
      showLastEllipsis: false,
      showLastPage: false,
    };
  }

  const hasMorePagesThanTheDefinedRange = pagesCount > numberOfPagesShownIntoNavigation;
  const visible = !!numberOfPagesShownIntoNavigation && hasMorePagesThanTheDefinedRange;
  const midLimit = Math.floor(numberOfPagesShownIntoNavigation / 2);

  const showFirstPage = visible && currentPage > midLimit;
  const showFirstEllipsis = visible && currentPage > midLimit + 1;

  const zeroIndexPagesCount = pagesCount - 1;
  const showLastPage = visible && currentPage + midLimit < zeroIndexPagesCount;
  const showLastEllipsis = visible && currentPage + midLimit + 1 < zeroIndexPagesCount;

  return {
    showFirstEllipsis,
    showFirstPage,
    showLastEllipsis,
    showLastPage,
  };
};
