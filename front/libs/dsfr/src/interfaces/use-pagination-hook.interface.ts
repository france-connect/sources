export interface UsePaginationInterface {
  currentPage: number;
  gtTablet: boolean;
  navigationNumbers: number[];
  pagesCount: number;
  paginationChangeHandler: (v: number) => void;
  showFirstEllipsis: boolean;
  showFirstPage: boolean;
  showLastEllipsis: boolean;
  showLastPage: boolean;
}
