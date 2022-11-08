/* istanbul ignore file */

// declarative file
export interface IUsePaginationHook {
  currentPage: number;
  isTabletOrDesktop: boolean;
  navigationNumbers: number[];
  pagesCount: number;
  paginationChangeHandler: Function;
  showFirstEllipsis: boolean;
  showFirstPage: boolean;
  showLastEllipsis: boolean;
  showLastPage: boolean;
}
