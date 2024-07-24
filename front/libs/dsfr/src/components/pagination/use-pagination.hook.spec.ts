import { act, renderHook } from '@testing-library/react';

import { useScrollTo } from '@fc/common';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import {
  getCurrentPage,
  getDisplayParameters,
  getMobileNavigationNumbers,
  getNavigationNumbers,
  getPagesCount,
} from './pagination.utils';
import { usePagination } from './use-pagination.hook';

jest.mock('@fc/styles');
jest.mock('./pagination.utils.ts');

describe('usePagination', () => {
  // given
  const scrollToTopMock = jest.fn();

  beforeEach(() => {
    // given
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValueOnce([expect.any(Number), expect.any(Number)]);

    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    jest.mocked(getDisplayParameters).mockReturnValueOnce({
      showFirstEllipsis: true,
      showFirstPage: true,
      showLastEllipsis: true,
      showLastPage: true,
    });
    jest.mocked(getPagesCount).mockReturnValueOnce(10);
    jest.mocked(getCurrentPage).mockReturnValueOnce(1);
    jest.mocked(getNavigationNumbers).mockReturnValueOnce([1, 2, 3, 4, 5]);
    jest.mocked(getMobileNavigationNumbers).mockReturnValueOnce([0, 1, 9]);
    jest.mocked(useScrollTo).mockReturnValueOnce({
      scrollToTop: scrollToTopMock,
    });
  });

  it('should return a function', () => {
    const { result } = renderHook(() => usePagination);
    expect(result.current).toBeInstanceOf(Function);
  });

  describe('paginationChangeHandler', () => {
    const onPageClickMock = jest.fn();
    it('should return offset 10 if next page equal to 1', () => {
      // when
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: onPageClickMock,
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );

      result.current.paginationChangeHandler(1);

      // then
      expect(onPageClickMock).toHaveBeenCalledOnce();
      expect(onPageClickMock).toHaveBeenCalledWith(10);
    });

    it('should return offset 50 if next page equal to 5', () => {
      // when
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: onPageClickMock,
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );

      result.current.paginationChangeHandler(5);

      // then
      expect(onPageClickMock).toHaveBeenCalledOnce();
      expect(onPageClickMock).toHaveBeenCalledWith(50);
    });

    it('should call scrollToTopMock', () => {
      // when
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: onPageClickMock,
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );
      act(() => {
        result.current.paginationChangeHandler(3);
      });

      // then
      expect(scrollToTopMock).toHaveBeenCalledOnce();
    });
  });

  describe('pagesCount', () => {
    it('should call getPagesCount', () => {
      // when
      renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );

      // then
      expect(getPagesCount).toHaveBeenCalledOnce();
      expect(getPagesCount).toHaveBeenCalledWith({ itemsPerPage: 10, totalItems: 100 });
    });
  });

  describe('currentPage', () => {
    it('should call getCurrentPage', () => {
      // when
      renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );

      // then
      expect(getCurrentPage).toHaveBeenCalledOnce();
      expect(getCurrentPage).toHaveBeenCalledWith({
        currentElementIndexIntoTheList: 0,
        itemsPerPage: 10,
      });
    });
  });

  describe('navigationNumbers', () => {
    it('should call getNavigationNumbers', () => {
      // when
      renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );

      // then
      expect(getNavigationNumbers).toHaveBeenCalledOnce();
      expect(getNavigationNumbers).toHaveBeenCalledWith({
        currentPage: 1,
        numberOfPagesShownIntoNavigation: 5,
        pagesCount: 10,
      });
    });

    it('should call getMobileNavigationNumbers', () => {
      // given
      jest.mocked(useStylesQuery).mockReset().mockReturnValueOnce(false);

      // when
      renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 1,
          onPageClick: jest.fn(),
          pagination: { offset: 70, size: 10, total: 100 },
        }),
      );

      // then
      expect(getMobileNavigationNumbers).toHaveBeenCalledOnce();
      expect(getMobileNavigationNumbers).toHaveBeenCalledWith({ currentPage: 1, pagesCount: 10 });
    });
  });

  describe('getDisplayParameters', () => {
    it('should call getDisplayParameters', () => {
      // when
      renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );

      // then
      expect(getDisplayParameters).toHaveBeenCalledOnce();
      expect(getDisplayParameters).toHaveBeenCalledWith({
        currentPage: 1,
        isMobile: false,
        numberOfPagesShownIntoNavigation: 5,
        pagesCount: 10,
      });
    });
  });
});
