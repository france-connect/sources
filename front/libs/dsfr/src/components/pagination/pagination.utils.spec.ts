import {
  getCurrentPage,
  getEllipsis,
  getNavigationNumbers,
  getPagesCount,
} from './pagination.utils';

describe('getPagesCount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 1 if totalItems equal 1 and itemsPerPage equal 10', () => {
    // when
    const result = getPagesCount({
      itemsPerPage: 10,
      totalItems: 1,
    });
    // then
    expect(result).toEqual(1);
  });

  it('should return 1 if totalItems equal 1 and itemsPerPage equal 1', () => {
    // when
    const result = getPagesCount({
      itemsPerPage: 1,
      totalItems: 1,
    });
    // then
    expect(result).toEqual(1);
  });

  it('should return 3 if totalItems equal 9 and itemsPerPage equal 3', () => {
    // when
    const result = getPagesCount({
      itemsPerPage: 3,
      totalItems: 9,
    });
    // then
    expect(result).toEqual(3);
  });

  it('should return 4 if totalItems equal 10 and itemsPerPage equal 3', () => {
    // when
    const result = getPagesCount({
      itemsPerPage: 3,
      totalItems: 10,
    });
    // then
    expect(result).toEqual(4);
  });
});

describe('getCurrentPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the current page number as 0, when first item of the page is 0 and 3 items per page', () => {
    // when
    const result = getCurrentPage({
      currentElementIndexIntoTheList: 0,
      itemsPerPage: 3,
    });
    // then
    expect(result).toEqual(0);
  });

  it('should return the current page number as 0, when item of the page is 9 and 10 items per page', () => {
    // when
    const result = getCurrentPage({
      currentElementIndexIntoTheList: 0,
      itemsPerPage: 10,
    });
    // then
    expect(result).toEqual(0);
  });

  it('should return the current page number as 1, when first item of the page is 3 and 3 items per page', () => {
    // when
    const result = getCurrentPage({
      currentElementIndexIntoTheList: 3,
      itemsPerPage: 3,
    });
    // then
    expect(result).toEqual(1);
  });

  it('should return the current page number as 10, when first item of the page is 100 and 10 items per page', () => {
    // when
    const result = getCurrentPage({
      currentElementIndexIntoTheList: 100,
      itemsPerPage: 10,
    });
    // then
    expect(result).toEqual(10);
  });
});

describe('getNavigationNumbers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('missing or wrong argument', () => {
    it('should return empty array, when pagesCount is not a number', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: expect.any(Number),
        numberOfPagesShownIntoNavigation: expect.any(Number),
        pagesCount: undefined as unknown as number,
      });
      // then
      expect(result).toHaveLength(0);
    });

    it('should return empty array, when pagesCount is 0', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: expect.any(Number),
        numberOfPagesShownIntoNavigation: expect.any(Number),
        pagesCount: 0,
      });
      // then
      expect(result).toHaveLength(0);
    });

    it('should return empty array, when currentPage is not a number', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: undefined as unknown as number,
        numberOfPagesShownIntoNavigation: expect.any(Number),
        pagesCount: expect.any(Number),
      });
      // then
      expect(result).toHaveLength(0);
    });

    it('should return empty array, when numberOfPagesShownIntoNavigation is not a number', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: expect.any(Number),
        numberOfPagesShownIntoNavigation: undefined as unknown as number,
        pagesCount: expect.any(Number),
      });
      // then
      expect(result).toHaveLength(0);
    });

    it('should return empty array, when numberOfPagesShownIntoNavigation is 0', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: undefined as unknown as number,
        numberOfPagesShownIntoNavigation: 0,
        pagesCount: expect.any(Number),
      });
      // then
      expect(result).toHaveLength(0);
    });
  });

  describe('count returned elements', () => {
    it('should return 7 elements, when the param numberOfPagesShownIntoNavigation is 7', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 8,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 100,
      });
      // then
      expect(result).toHaveLength(7);
    });

    it("should return 3 elements, when the param numberOfPagesShownIntoNavigation is 7 but there's only 3 pages", () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 2,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 3,
      });
      // then
      expect(result).toHaveLength(3);
    });

    it("should return 1 elements, when there's only 1 page", () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 0,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 1,
      });
      // then
      expect(result).toStrictEqual([0]);
    });

    it("should return 2 elements, when there's only 2 pages", () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 1,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 2,
      });
      // then
      expect(result).toStrictEqual([0, 1]);
    });
  });

  describe('starting section', () => {
    it('should return an array starting from 0 to 2, when currentPage is 0(first index) and numberOfPagesShownIntoNavigation is 3, odd number', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 0,
        numberOfPagesShownIntoNavigation: 3,
        pagesCount: 200,
      });
      // then
      expect(result).toStrictEqual([0, 1, 2]);
    });

    it('should return an array starting from 0 to 6, when currentPage is 1(second index) and numberOfPagesShownIntoNavigation is 7, odd number', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 1,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 200,
      });
      // then
      expect(result).toStrictEqual([0, 1, 2, 3, 4, 5, 6]);
    });
  });

  describe('any mid-range section', () => {
    it('should return an array starting from 1 to 7, when currentPage is 4(fifth index) and numberOfPagesShownIntoNavigation is 7, odd number', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 4,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 200,
      });
      // then
      // @NOTE [0,\1,2,3,**4**,5,6,7\]
      expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should return an array starting from 0 to 5, when currentPage is 2(third index) and numberOfPagesShownIntoNavigation is 6, even number', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 2,
        numberOfPagesShownIntoNavigation: 6,
        pagesCount: 200,
      });
      // then
      expect(result).toStrictEqual([0, 1, 2, 3, 4, 5]);
    });

    it('should return an array starting from 10 to 19, when currentPage is 15(16th index) and numberOfPagesShownIntoNavigation is 10, even number', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 15,
        numberOfPagesShownIntoNavigation: 10,
        pagesCount: 200,
      });
      // then
      // @NOTE [0,1,2,3,4,5,6,7,8,9,\10,11,12,13,14,**15**,16,17,16,19\]
      expect(result).toStrictEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    });
  });

  describe('ending section', () => {
    it('should return an array starting from 4 to 6, when currentPage is 5(sixth index) and 7 pages only', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 5,
        numberOfPagesShownIntoNavigation: 3,
        pagesCount: 7,
      });
      // then
      // @NOTE [0, 1, 2, 3,\**4**, 5, 6\]
      expect(result).toStrictEqual([4, 5, 6]);
    });

    it('should return an array starting from 4 to 6, when currentPage is 6(7th index, last page) and 7 pages only', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 6,
        numberOfPagesShownIntoNavigation: 3,
        pagesCount: 7,
      });
      // then
      // @NOTE [0, 1, 2, 3,\4, 5, **6**\]
      expect(result).toStrictEqual([4, 5, 6]);
    });

    it('should return an array starting from 196 to 198, when currentPage is 198(last index) and numberOfPagesShownIntoNavigation is 7', () => {
      // when
      const result = getNavigationNumbers({
        currentPage: 198,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 199,
      });
      // then
      expect(result).toStrictEqual([192, 193, 194, 195, 196, 197, 198]);
    });
  });
});

describe('getEllipsis', () => {
  describe('showFirstPage', () => {
    it('should return showFirstPage as false, when umber of items is undefined', () => {
      // when
      const result = getEllipsis({
        currentPage: 0,
        numberOfPagesShownIntoNavigation: undefined as unknown as number,
        pagesCount: 10,
      });
      // then
      expect(result.showFirstPage).toBe(false);
    });

    it('should return showFirstPage as false, when number of items == 0', () => {
      // when
      const result = getEllipsis({
        currentPage: 0,
        numberOfPagesShownIntoNavigation: 0,
        pagesCount: 10,
      });
      // then
      expect(result.showFirstPage).toBe(false);
    });

    it('should return showFirstPage as false, when currentPage === 0', () => {
      // when
      const result = getEllipsis({
        currentPage: 0,
        numberOfPagesShownIntoNavigation: 10,
        pagesCount: 10,
      });
      // then
      expect(result.showFirstPage).toBe(false);
    });

    it('should return showFirstPage as true, when pagesCount > numberOfPagesShownIntoNavigation', () => {
      // when
      const result = getEllipsis({
        currentPage: 0,
        numberOfPagesShownIntoNavigation: 3,
        pagesCount: 10,
      });
      // then
      expect(result.showFirstPage).toBe(false);
    });

    it('should return showFirstPage as false, when currentPage <= numberOfPagesShownIntoNavigation / 2, numberOfPagesShownIntoNavigation as odd number', () => {
      // when
      const result = getEllipsis({
        currentPage: 3,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 10,
      });
      // then
      expect(result.showFirstPage).toBe(false);
    });

    it('should return showFirstPage as true, when currentPage > numberOfPagesShownIntoNavigation / 2, numberOfPagesShownIntoNavigation as odd number', () => {
      // when
      const result = getEllipsis({
        currentPage: 4,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 10,
      });
      // then
      expect(result.showFirstPage).toBe(true);
    });

    it('should return showFirstPage as false, when currentPage === numberOfPagesShownIntoNavigation / 2, numberOfPagesShownIntoNavigation as even number', () => {
      // when
      const result = getEllipsis({
        currentPage: 3,
        numberOfPagesShownIntoNavigation: 6,
        pagesCount: 10,
      });
      // then
      expect(result.showFirstPage).toBe(false);
    });
  });

  describe('showFirstEllipsis', () => {
    it('should return showFirstEllipsis as false, when showFirstPage is false', () => {
      // when
      const result = getEllipsis({
        currentPage: 2,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 10,
      });
      // then
      expect(result.showFirstEllipsis).toBe(false);
    });

    it('should return showFirstEllipsis as false, when showFirstPage is true and currentPage < numberOfPagesShownIntoNavigation / 2 + 1', () => {
      // when
      const result = getEllipsis({
        currentPage: 3,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 10,
      });
      // then
      expect(result.showFirstEllipsis).toBe(false);
    });

    it('should return showFirstEllipsis as true, when showFirstPage is true and currentPage  > numberOfPagesShownIntoNavigation / 2 + 1', () => {
      // when
      const result = getEllipsis({
        currentPage: 5,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 10,
      });
      // then
      expect(result.showFirstEllipsis).toBe(true);
    });
  });

  describe('showLastPage', () => {
    it('should return showLastPage as false, when number of items is undefined', () => {
      // when
      const result = getEllipsis({
        currentPage: 0,
        numberOfPagesShownIntoNavigation: undefined as unknown as number,
        pagesCount: 10,
      });
      // then
      expect(result.showLastPage).toBe(false);
    });

    it('should return showLastPage as false, when number of items === 0', () => {
      // when
      const result = getEllipsis({
        currentPage: 0,
        numberOfPagesShownIntoNavigation: 0,
        pagesCount: 10,
      });
      // then
      expect(result.showLastPage).toBe(false);
    });

    it('should return showLastPage as false, when number of currentPage === pagesCount', () => {
      // when
      const result = getEllipsis({
        currentPage: 10,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 10,
      });
      // then
      expect(result.showLastPage).toBe(false);
    });

    it('should return showLastPage as false, when number of currentPage + numberOfPagesShownIntoNavigation / 2 > zeroIndexPagesCount', () => {
      // when
      const result = getEllipsis({
        currentPage: 17,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 20,
      });
      // then
      expect(result.showLastPage).toBe(false);
    });

    it('should return showLastPage as true, when number of currentPage + numberOfPagesShownIntoNavigation / 2 < zeroIndexPagesCount', () => {
      // when
      const result = getEllipsis({
        currentPage: 16,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 20,
      });
      // then
      expect(result.showLastPage).toBe(false);
    });
  });

  describe('showLastEllipsis', () => {
    it('should return showLastEllipsis as false, when showLastPage is false', () => {
      // when
      const result = getEllipsis({
        currentPage: 17,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 20,
      });
      // then
      expect(result.showLastEllipsis).toBe(false);
    });

    it('should return showLastEllipsis as false, when showLastPage is true and currentPage + numberOfPagesShownIntoNavigation /  2 + 1 > zeroIndexPagesCount', () => {
      // when
      const result = getEllipsis({
        currentPage: 15,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 20,
      });
      // then
      expect(result.showLastEllipsis).toBe(false);
    });

    it('should return showLastEllipsis as true, when showLastPage is true and currentPage + numberOfPagesShownIntoNavigation / 2 + 1 < zeroIndexPagesCount', () => {
      // when
      const result = getEllipsis({
        currentPage: 14,
        numberOfPagesShownIntoNavigation: 7,
        pagesCount: 20,
      });
      // then
      expect(result.showLastEllipsis).toBe(true);
    });
  });
});
