/**
 * @TODO renommer en services/static plutot qu'un utils ?
 * pro/cons
 */
import { range } from 'lodash';

import type {
  DesktopDisplayParamsInterface,
  GetCurrentPageInterface,
  GetDisplayParametersInterface,
  GetNavigationNumbersInterface,
  GetPagesCountInterface,
} from '../../interfaces';

export const getPagesCount = ({ itemsPerPage, totalItems }: GetPagesCountInterface): number => {
  const pagesCount = Math.ceil(totalItems / itemsPerPage);
  return pagesCount;
};

export const getCurrentPage = ({
  currentElementIndexIntoTheList,
  itemsPerPage,
}: GetCurrentPageInterface): number => {
  const zeroIndexCurrentPage = Math.floor(currentElementIndexIntoTheList / itemsPerPage);
  return zeroIndexCurrentPage;
};

// récupération du tableau d'indices des pages à afficher en desktop
export const getNavigationNumbers = ({
  currentPage: zeroIndexCurrentPage,
  numberOfPagesShownIntoNavigation,
  pagesCount,
}: GetNavigationNumbersInterface): number[] => {
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

  const navigationNumbers = range(startRange, endRange);
  return navigationNumbers;
};

// récupération du tableau d'indices des pages à afficher en mobile
export const getMobileNavigationNumbers = ({
  currentPage: zeroIndexCurrentPage,
  pagesCount,
}: GetNavigationNumbersInterface): number[] => {
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
}: GetDisplayParametersInterface): DesktopDisplayParamsInterface => {
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
