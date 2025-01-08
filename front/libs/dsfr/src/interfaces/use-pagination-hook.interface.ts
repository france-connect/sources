export interface UsePaginationInterface {
  currentPage: number;
  gtTablet: boolean;
  navigationNumbers: number[];
  pagesCount: number;
  paginationChangeHandler: Function;
  showFirstEllipsis: boolean;
  showFirstPage: boolean;
  showLastEllipsis: boolean;
  showLastPage: boolean;
}
