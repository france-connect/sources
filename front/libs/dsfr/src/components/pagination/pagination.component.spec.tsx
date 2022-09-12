import { fireEvent, render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useMediaQuery } from 'react-responsive';

import { DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION, DEFAULT_USE_ELLIPSIS } from '../../enums';
import { PaginationComponent } from './pagination.component';
import { usePagination } from './use-pagination.hook';

jest.mock('./use-pagination.hook');
jest.mock('react-responsive');

describe('PaginationComponent', () => {
  // given
  const usePaginationMock = {
    currentPage: 2,
    navigationNumbers: [1, 2, 3, 4, 5],
    pagesCount: 10,
    paginationChangeHandler: jest.fn(),
    showFirstEllipsis: false,
    showFirstPage: false,
    showLastEllipsis: false,
    showLastPage: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mocked(usePagination).mockReturnValueOnce(usePaginationMock);
  });

  it('should match the snapshot', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    mocked(usePagination).mockReturnValue({
      ...usePaginationMock,
      showFirstEllipsis: true,
      showFirstPage: true,
      showLastEllipsis: true,
      showLastPage: true,
    });

    // when
    const { container } = render(
      <PaginationComponent
        numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
        pagination={expect.any(Object)}
        useEdgeArrows={expect.any(Boolean)}
        useEllipsis={expect.any(Boolean)}
        useNavArrows={expect.any(Boolean)}
        onPageClick={expect.any(Function)}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot in mobile viewport', () => {
    // given
    mocked(usePagination).mockReturnValue({
      ...usePaginationMock,
      showFirstEllipsis: true,
      showFirstPage: true,
      showLastEllipsis: true,
      showLastPage: true,
    });
    mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
    const { container } = render(
      <PaginationComponent
        useEdgeArrows
        useEllipsis
        useNavArrows
        numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
        pagination={expect.any(Object)}
        onPageClick={expect.any(Function)}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with custom props values', () => {
    // given
    mocked(usePagination).mockReturnValue({
      ...usePaginationMock,
    });

    // when
    const { container } = render(
      <PaginationComponent
        useEllipsis
        numberOfPagesShownIntoNavigation={7}
        pagination={expect.any(Object)}
        onPageClick={expect.any(Function)}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with ellipsis', () => {
    // given
    mocked(usePagination).mockReturnValue({
      ...usePaginationMock,
    });

    // when
    const { container } = render(
      <PaginationComponent
        numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
        pagination={expect.any(Object)}
        onPageClick={expect.any(Function)}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call usePagination hook, with params', () => {
    // given
    const paginationObjectMock = {
      offset: 1,
      size: 10,
      total: 200,
    };

    // when
    render(
      <PaginationComponent
        numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
        pagination={paginationObjectMock}
        onPageClick={expect.any(Function)}
      />,
    );

    // then
    expect(usePagination).toHaveBeenCalledTimes(1);
    expect(usePagination).toHaveBeenCalledWith({
      numberOfPagesShownIntoNavigation: DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION,
      onPageClick: expect.any(Function),
      pagination: paginationObjectMock,
    });
  });

  describe('navigation', () => {
    it('should call callback when a navigation button is clicked', () => {
      // given
      const callbackMock = jest.fn();

      // when
      const { getByText } = render(
        <PaginationComponent
          numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
          pagination={expect.any(Object)}
          onPageClick={callbackMock(3)}
        />,
      );
      const button = getByText(/2/);
      fireEvent.click(button);

      // then
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(3);
    });

    describe('button first page', () => {
      it('should call callback with the first page', () => {
        // given
        const callbackMock = jest.fn();

        // when
        const { getByText } = render(
          <PaginationComponent
            useEdgeArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(0)}
          />,
        );

        const button = getByText(/Première page/);
        fireEvent.click(button);

        // then
        expect(callbackMock).toHaveBeenCalledTimes(1);
        expect(callbackMock).toHaveBeenCalledWith(0);
      });
    });

    describe('button previous page', () => {
      it('should call callback when the previous button is clicked', () => {
        // given
        const callbackMock = jest.fn();

        // when
        const { getByText } = render(
          <PaginationComponent
            useNavArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(1)}
          />,
        );

        const button = getByText(/Page précédente/);
        fireEvent.click(button);

        // then
        expect(callbackMock).toHaveBeenCalledTimes(1);
        expect(callbackMock).toHaveBeenCalledWith(1);
      });

      it('should display : "Page précédente"', () => {
        // given
        const callbackMock = jest.fn();
        mocked(useMediaQuery).mockReturnValueOnce(false);

        // when
        const { container } = render(
          <PaginationComponent
            useNavArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(0)}
          />,
        );

        // then
        const button = screen.getByRole('button', {
          name: /Page précédente/i,
        });
        expect(container).toMatchSnapshot();
        expect(button).toBeDefined();
      });
    });

    describe('button next page', () => {
      it('should call callback when the next button is clicked', () => {
        // given
        const callbackMock = jest.fn();

        // when
        const { getByText } = render(
          <PaginationComponent
            useNavArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(3)}
          />,
        );
        const button = getByText(/Page suivante/);
        fireEvent.click(button);

        // then
        expect(callbackMock).toHaveBeenCalledTimes(1);
        expect(callbackMock).toHaveBeenCalledWith(3);
      });

      it('should not be display if every conditions is set to false', () => {
        // given
        const callbackMock = jest.fn();

        // when
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            useNavArrows={false}
            onPageClick={callbackMock(3)}
          />,
        );

        // then
        expect(container).toMatchSnapshot();
      });

      it('should not be visible if screen size is small', () => {
        // given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
        });
        mocked(useMediaQuery).mockReturnValueOnce(true);
        const callbackMock = jest.fn();

        // when
        render(
          <PaginationComponent
            useNavArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(0)}
          />,
        );

        // then
        expect(container).toMatchSnapshot();
      });
    });

    describe('button last page', () => {
      it('should call callback with the last page', () => {
        // given
        const callbackMock = jest.fn();

        // when
        const { getByText } = render(
          <PaginationComponent
            useEdgeArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(3)}
          />,
        );
        const button = getByText(/Dernière page/);
        fireEvent.click(button);

        // then
        expect(callbackMock).toHaveBeenCalledTimes(1);
        expect(callbackMock).toHaveBeenCalledWith(3);
      });
    });

    describe('button first ellipsis', () => {
      it('should call callback if first navigation number is showed in the page whith ellipsis', () => {
        // given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showFirstEllipsis: true,
          showFirstPage: true,
        });
        const callbackMock = jest.fn();

        // when
        const { getByText } = render(
          <PaginationComponent
            useEdgeArrows
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(1)}
          />,
        );
        const button = getByText(/1/);
        fireEvent.click(button);
        const firstEllipsis = screen.getByTestId('PaginationComponent-first-ellipsis');

        // then
        expect(container).toMatchSnapshot();
        expect(firstEllipsis).toBeInTheDocument();
        expect(callbackMock).toHaveBeenCalledTimes(1);
        expect(callbackMock).toHaveBeenCalledWith(1);
      });
    });

    describe('button last ellipsis', () => {
      it('should call callback if last navigation number is showed in the page whith ellipsis', () => {
        // given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showLastEllipsis: true,
          showLastPage: true,
        });

        const callbackMock = jest.fn();

        // when
        const { getByText } = render(
          <PaginationComponent
            useEdgeArrows
            useEllipsis
            useNavArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(0)}
          />,
        );
        const button = getByText(/10/);
        fireEvent.click(button);
        const lastEllipsis = screen.getByTestId('PaginationComponent-last-ellipsis');

        // then
        expect(container).toMatchSnapshot();
        expect(lastEllipsis).toBeInTheDocument();
        expect(callbackMock).toHaveBeenCalledTimes(1);
        expect(callbackMock).toHaveBeenCalledWith(0);
      });
    });

    describe('ellipsis', () => {
      it('should be visible if screen size is small', () => {
        // given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showLastEllipsis: true,
          showLastPage: true,
        });
        mocked(useMediaQuery).mockReturnValueOnce(true);
        const callbackMock = jest.fn();

        // when
        render(
          <PaginationComponent
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(0)}
          />,
        );
        const lastEllipsis = screen.getByTestId('PaginationComponent-last-ellipsis');

        // then
        expect(container).toMatchSnapshot();
        expect(lastEllipsis).toBeInTheDocument();
      });

      it('should not be visible if screen size is not small', () => {
        // given
        const { container } = render(
          <PaginationComponent
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showLastEllipsis: true,
          showLastPage: true,
        });
        mocked(useMediaQuery).mockReturnValueOnce(false);
        const callbackMock = jest.fn();

        // when
        render(
          <PaginationComponent
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(0)}
          />,
        );

        // then
        expect(container).toMatchSnapshot();
      });

      it('should not be visible if showLastEllipsis is set to false', () => {
        // given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showLastEllipsis: false,
          showLastPage: true,
        });
        mocked(useMediaQuery).mockReturnValueOnce(true);
        const callbackMock = jest.fn();

        // when
        render(
          <PaginationComponent
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(0)}
          />,
        );

        // then
        expect(container).toMatchSnapshot();
      });

      it('should not be visible if useEllipsis is set to false', () => {
        // given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showLastEllipsis: true,
          showLastPage: true,
        });
        mocked(useMediaQuery).mockReturnValueOnce(true);
        const callbackMock = jest.fn();

        // when
        render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            useEllipsis={DEFAULT_USE_ELLIPSIS}
            onPageClick={callbackMock(0)}
          />,
        );

        // then
        expect(container).toMatchSnapshot();
      });

      it('should not be visible if ellipsis params are set to default "false" values', () => {
        // given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            useEllipsis={DEFAULT_USE_ELLIPSIS}
            onPageClick={expect.any(Function)}
          />,
        );
        mocked(useMediaQuery).mockReturnValueOnce(true);
        mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
        });
        const callbackMock = jest.fn();

        // when
        render(
          <PaginationComponent
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={callbackMock(0)}
          />,
        );

        // then
        expect(container).toMatchSnapshot();
      });
    });
  });
});
