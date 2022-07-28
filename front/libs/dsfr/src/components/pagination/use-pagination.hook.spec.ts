import { renderHook } from '@testing-library/react-hooks';

import { usePagination } from './use-pagination.hook';

describe('usePagination', () => {
  it('should return a function', () => {
    const { result } = renderHook(() => usePagination);
    expect(result.current).toBeInstanceOf(Function);
  });

  describe('paginationChangeHandler', () => {
    it('should return offset 10 if next page equal to 1', () => {
      const onPageClickMock = jest.fn();
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: onPageClickMock,
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );

      result.current.paginationChangeHandler(1);

      expect(onPageClickMock).toHaveBeenCalledTimes(1);
      expect(onPageClickMock).toHaveBeenCalledWith(10);
    });

    it('should return offset 50 if next page equal to 5', () => {
      const onPageClickMock = jest.fn();
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: onPageClickMock,
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );

      result.current.paginationChangeHandler(5);

      expect(onPageClickMock).toHaveBeenCalledTimes(1);
      expect(onPageClickMock).toHaveBeenCalledWith(50);
    });
  });

  describe('pagesCount', () => {
    it('should return 10 when size: 10 and total: 100', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );
      expect(result.current.pagesCount).toStrictEqual(10);
    });

    it('should return 60 when size: 5 and total: 300', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 5, total: 300 },
        }),
      );
      expect(result.current.pagesCount).toStrictEqual(60);
    });
  });

  describe('currentPage', () => {
    it('should return 0 when offset is equal to 0', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );
      expect(result.current.currentPage).toStrictEqual(0);
    });

    it('should return 6 when offset is equal to 60', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 60, size: 10, total: 100 },
        }),
      );
      expect(result.current.currentPage).toStrictEqual(6);
    });

    it('should return 9 when offset is equal to 90', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 90, size: 10, total: 100 },
        }),
      );
      expect(result.current.currentPage).toStrictEqual(9);
    });
  });

  describe('navigationNumbers', () => {
    it('should equal to [0,1,2,3,4] if offset equals 0', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );
      expect(result.current.navigationNumbers).toStrictEqual([0, 1, 2, 3, 4]);
    });

    it('should equal to [5, 6, 7, 8, 9] if offset equals 190', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 190, size: 10, total: 100 },
        }),
      );
      expect(result.current.navigationNumbers).toStrictEqual([5, 6, 7, 8, 9]);
    });

    it('should equal to [7, 8, 9] if offset equals 170', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 3,
          onPageClick: jest.fn(),
          pagination: { offset: 170, size: 10, total: 100 },
        }),
      );
      expect(result.current.navigationNumbers).toStrictEqual([7, 8, 9]);
    });

    it('should equal to [7] if offset equals 70 && number of pages displayed is 1', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 1,
          onPageClick: jest.fn(),
          pagination: { offset: 70, size: 10, total: 100 },
        }),
      );
      expect(result.current.navigationNumbers).toStrictEqual([7]);
    });
  });

  describe('showFirstEllipsis', () => {
    it('should return false if the offset is equal to 0', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );
      expect(result.current.showFirstEllipsis).toBe(false);
    });
    describe('if the offset is equal to 50', () => {
      it('should return true with page number equal to 5', () => {
        const { result } = renderHook(() =>
          usePagination({
            numberOfPagesShownIntoNavigation: 5,
            onPageClick: jest.fn(),
            pagination: { offset: 50, size: 10, total: 100 },
          }),
        );
        expect(result.current.showFirstEllipsis).toBe(true);
      });

      it('should return true with page number equal to 3', () => {
        const { result } = renderHook(() =>
          usePagination({
            numberOfPagesShownIntoNavigation: 3,
            onPageClick: jest.fn(),
            pagination: { offset: 50, size: 10, total: 100 },
          }),
        );
        expect(result.current.showFirstEllipsis).toBe(true);
      });

      it('should return true with page number equal to 1', () => {
        const { result } = renderHook(() =>
          usePagination({
            numberOfPagesShownIntoNavigation: 1,
            onPageClick: jest.fn(),
            pagination: { offset: 50, size: 10, total: 100 },
          }),
        );
        expect(result.current.showFirstEllipsis).toBe(true);
      });
    });
  });

  describe('showFirstPage', () => {
    it('should return false if the offset is equal to 0', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );
      expect(result.current.showFirstPage).toBe(false);
    });

    it('should return true if the offset is equal to 60', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 60, size: 10, total: 100 },
        }),
      );
      expect(result.current.showFirstPage).toBe(true);
    });
  });

  describe('showLastEllipsis', () => {
    it('should return true if the offset is equal to 0', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );
      expect(result.current.showLastEllipsis).toBe(true);
    });

    it('should return false if the offset is equal to 90', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 90, size: 10, total: 100 },
        }),
      );
      expect(result.current.showLastEllipsis).toBe(false);
    });

    it('should return true with an offset equal to 50', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 3,
          onPageClick: jest.fn(),
          pagination: { offset: 50, size: 10, total: 100 },
        }),
      );
      expect(result.current.showLastEllipsis).toBe(true);
    });

    it('should return false if the offset is equal to 90 and page to dispaly is equal to 1', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 1,
          onPageClick: jest.fn(),
          pagination: { offset: 90, size: 10, total: 100 },
        }),
      );
      expect(result.current.showLastEllipsis).toBe(false);
    });
  });

  describe('showLastPage', () => {
    it('should return false if the offset is equal to 0', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 0, size: 10, total: 100 },
        }),
      );
      expect(result.current.showLastPage).toBe(true);
    });

    it('should return false if the offset is equal to 90', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 5,
          onPageClick: jest.fn(),
          pagination: { offset: 90, size: 10, total: 100 },
        }),
      );
      expect(result.current.showLastPage).toBe(false);
    });

    it('should return true if the offset is equal to 70', () => {
      const { result } = renderHook(() =>
        usePagination({
          numberOfPagesShownIntoNavigation: 1,
          onPageClick: jest.fn(),
          pagination: { offset: 70, size: 10, total: 100 },
        }),
      );
      expect(result.current.showLastPage).toBe(true);
    });
  });
});
