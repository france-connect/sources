import { fireEvent, render, screen } from '@testing-library/react';

import { t } from '@fc/i18n';
import { useStylesQuery } from '@fc/styles';

import { DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION, DEFAULT_USE_ELLIPSIS } from '../../enums';
import { PaginationComponent } from './pagination.component';
import { usePagination } from './use-pagination.hook';

jest.mock('./use-pagination.hook');

describe('PaginationComponent', () => {
  // Given
  const usePaginationMock = {
    currentPage: 2,
    gtTablet: true,
    navigationNumbers: [1, 2, 3, 4, 5],
    pagesCount: 10,
    paginationChangeHandler: jest.fn(),
    showFirstEllipsis: false,
    showFirstPage: false,
    showLastEllipsis: false,
    showLastPage: false,
  };
  const onPageClickCallbackMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(usePagination).mockReturnValueOnce(usePaginationMock);
    jest
      .mocked(t)
      .mockReturnValueOnce('any-lastpage-label-mock')
      .mockReturnValueOnce('any-firstpage-label-mock')
      .mockReturnValueOnce('any-nextpage-label-mock')
      .mockReturnValueOnce('any-previouspage-label-mock');
  });

  it('should call t 4 times with params', () => {
    // When
    render(
      <PaginationComponent
        numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
        pagination={expect.any(Object)}
        useEdgeArrows={expect.any(Boolean)}
        useEllipsis={expect.any(Boolean)}
        useNavArrows={expect.any(Boolean)}
        onPageClick={expect.any(Function)}
      />,
    );

    // Then
    expect(t).toHaveBeenCalledTimes(4);
    expect(t).toHaveBeenNthCalledWith(1, 'DSFR.pagination.lastPage');
    expect(t).toHaveBeenNthCalledWith(2, 'DSFR.pagination.firstPage');
    expect(t).toHaveBeenNthCalledWith(3, 'DSFR.pagination.nextPage');
    expect(t).toHaveBeenNthCalledWith(4, 'DSFR.pagination.previousPage');
  });

  it('should match the snapshot', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);
    jest.mocked(usePagination).mockReturnValue({
      ...usePaginationMock,
      showFirstEllipsis: true,
      showFirstPage: true,
      showLastEllipsis: true,
      showLastPage: true,
    });

    // When
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

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot in mobile viewport', () => {
    // Given
    jest.mocked(usePagination).mockReturnValue({
      ...usePaginationMock,
      showFirstEllipsis: true,
      showFirstPage: true,
      showLastEllipsis: true,
      showLastPage: true,
    });
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    // When
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

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with default props values', () => {
    // Given
    jest.mocked(usePagination).mockReturnValue({
      ...usePaginationMock,
    });

    // When
    const { container } = render(
      <PaginationComponent
        useEllipsis
        pagination={expect.any(Object)}
        onPageClick={expect.any(Function)}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(usePagination).toHaveBeenCalledWith({
      numberOfPagesShownIntoNavigation: DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION,
      onPageClick: expect.any(Function),
      pagination: expect.any(Object),
    });
  });

  it('should match the snapshot with custom props values', () => {
    // Given
    jest.mocked(usePagination).mockReturnValue({
      ...usePaginationMock,
    });

    // When
    const { container } = render(
      <PaginationComponent
        useEllipsis
        numberOfPagesShownIntoNavigation={7}
        pagination={expect.any(Object)}
        onPageClick={expect.any(Function)}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with ellipsis', () => {
    // Given
    jest.mocked(usePagination).mockReturnValue({
      ...usePaginationMock,
    });

    // When
    const { container } = render(
      <PaginationComponent
        numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
        pagination={expect.any(Object)}
        onPageClick={expect.any(Function)}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call usePagination hook, with params', () => {
    // Given
    const paginationObjectMock = {
      offset: 1,
      size: 10,
      total: 200,
    };

    // When
    render(
      <PaginationComponent
        numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
        pagination={paginationObjectMock}
        onPageClick={expect.any(Function)}
      />,
    );

    // Then
    expect(usePagination).toHaveBeenCalledOnce();
    expect(usePagination).toHaveBeenCalledWith({
      numberOfPagesShownIntoNavigation: DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION,
      onPageClick: expect.any(Function),
      pagination: paginationObjectMock,
    });
  });

  describe('navigation', () => {
    it('should call callback when a navigation button is clicked', () => {
      // When
      const { getByText } = render(
        <PaginationComponent
          numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
          pagination={expect.any(Object)}
          onPageClick={onPageClickCallbackMock(3)}
        />,
      );
      const button = getByText(/2/);
      fireEvent.click(button);

      // Then
      expect(onPageClickCallbackMock).toHaveBeenCalledOnce();
      expect(onPageClickCallbackMock).toHaveBeenCalledWith(3);
    });

    describe('button first page', () => {
      it('should call callback with the first page', () => {
        // Given

        // When
        const { getByText } = render(
          <PaginationComponent
            useEdgeArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(0)}
          />,
        );

        const button = getByText('any-firstpage-label-mock');
        fireEvent.click(button);

        // Then
        expect(onPageClickCallbackMock).toHaveBeenCalledOnce();
        expect(onPageClickCallbackMock).toHaveBeenCalledWith(0);
      });
    });

    describe('button previous page', () => {
      it('should call callback when the previous button is clicked', () => {
        // Given

        // When
        const { getByTestId } = render(
          <PaginationComponent
            useNavArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(1)}
          />,
        );

        const button = getByTestId('PaginationComponent-previous-page-button');
        fireEvent.click(button);

        // Then
        expect(onPageClickCallbackMock).toHaveBeenCalledOnce();
        expect(onPageClickCallbackMock).toHaveBeenCalledWith(1);
      });

      it('should display : "Page précédente"', () => {
        // Given

        jest.mocked(useStylesQuery).mockReturnValueOnce(false);

        // When
        const { container } = render(
          <PaginationComponent
            useNavArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(0)}
          />,
        );

        // Then
        const button = screen.getByTestId('PaginationComponent-previous-page-button');

        expect(container).toMatchSnapshot();
        expect(button).toBeDefined();
      });
    });

    describe('button next page', () => {
      it('should call callback when the next button is clicked', () => {
        // Given

        // When
        const { getByTestId } = render(
          <PaginationComponent
            useNavArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(3)}
          />,
        );
        const button = getByTestId('PaginationComponent-next-page-button');
        fireEvent.click(button);

        // Then
        expect(onPageClickCallbackMock).toHaveBeenCalledOnce();
        expect(onPageClickCallbackMock).toHaveBeenCalledWith(3);
      });

      it('should not be display if every conditions is set to false', () => {
        // Given

        // When
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            useNavArrows={false}
            onPageClick={onPageClickCallbackMock(3)}
          />,
        );

        // Then
        expect(container).toMatchSnapshot();
      });

      it('should not be visible if screen size is small', () => {
        // Given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        jest.mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
        });
        jest.mocked(useStylesQuery).mockReturnValueOnce(true);

        // When
        render(
          <PaginationComponent
            useNavArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(0)}
          />,
        );

        // Then
        expect(container).toMatchSnapshot();
      });
    });

    describe('button last page', () => {
      it('should call callback with the last page', () => {
        // Given

        // When
        const { getByText } = render(
          <PaginationComponent
            useEdgeArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(3)}
          />,
        );
        const button = getByText('any-lastpage-label-mock');
        fireEvent.click(button);

        // Then
        expect(onPageClickCallbackMock).toHaveBeenCalledOnce();
        expect(onPageClickCallbackMock).toHaveBeenCalledWith(3);
      });
    });

    describe('button first ellipsis', () => {
      it('should call callback if first navigation number is showed in the page whith ellipsis', () => {
        // Given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        jest.mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showFirstEllipsis: true,
          showFirstPage: true,
        });

        // When
        const { getByText } = render(
          <PaginationComponent
            useEdgeArrows
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(1)}
          />,
        );
        const button = getByText(/1/);
        fireEvent.click(button);
        const firstEllipsis = screen.getByTestId('PaginationComponent-first-ellipsis');

        // Then
        expect(container).toMatchSnapshot();
        expect(firstEllipsis).toBeInTheDocument();
        expect(onPageClickCallbackMock).toHaveBeenCalledOnce();
        expect(onPageClickCallbackMock).toHaveBeenCalledWith(1);
      });
    });

    describe('button last ellipsis', () => {
      it('should call callback if last navigation number is showed in the page whith ellipsis', () => {
        // Given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        jest.mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showLastEllipsis: true,
          showLastPage: true,
        });

        // When
        const { getByText } = render(
          <PaginationComponent
            useEdgeArrows
            useEllipsis
            useNavArrows
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(0)}
          />,
        );
        const button = getByText(/10/);
        fireEvent.click(button);
        const lastEllipsis = screen.getByTestId('PaginationComponent-last-ellipsis');

        // Then
        expect(container).toMatchSnapshot();
        expect(lastEllipsis).toBeInTheDocument();
        expect(onPageClickCallbackMock).toHaveBeenCalledOnce();
        expect(onPageClickCallbackMock).toHaveBeenCalledWith(0);
      });
    });

    describe('ellipsis', () => {
      it('should be visible if screen size is small', () => {
        // Given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        jest.mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showLastEllipsis: true,
          showLastPage: true,
        });
        jest.mocked(useStylesQuery).mockReturnValueOnce(true);

        // When
        render(
          <PaginationComponent
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(0)}
          />,
        );
        const lastEllipsis = screen.getByTestId('PaginationComponent-last-ellipsis');

        // Then
        expect(container).toMatchSnapshot();
        expect(lastEllipsis).toBeInTheDocument();
      });

      it('should not be visible if screen size is not small', () => {
        // Given
        const { container } = render(
          <PaginationComponent
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        jest.mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showLastEllipsis: true,
          showLastPage: true,
        });
        jest.mocked(useStylesQuery).mockReturnValueOnce(false);

        // When
        render(
          <PaginationComponent
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(0)}
          />,
        );

        // Then
        expect(container).toMatchSnapshot();
      });

      it('should not be visible if showLastEllipsis is set to false', () => {
        // Given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        jest.mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showLastEllipsis: false,
          showLastPage: true,
        });
        jest.mocked(useStylesQuery).mockReturnValueOnce(true);

        // When
        render(
          <PaginationComponent
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(0)}
          />,
        );

        // Then
        expect(container).toMatchSnapshot();
      });

      it('should not be visible if useEllipsis is set to false', () => {
        // Given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={expect.any(Function)}
          />,
        );
        jest.mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
          showLastEllipsis: true,
          showLastPage: true,
        });
        jest.mocked(useStylesQuery).mockReturnValueOnce(true);

        // When
        render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            useEllipsis={DEFAULT_USE_ELLIPSIS}
            onPageClick={onPageClickCallbackMock(0)}
          />,
        );

        // Then
        expect(container).toMatchSnapshot();
      });

      it('should not be visible if ellipsis params are set to default "false" values', () => {
        // Given
        const { container } = render(
          <PaginationComponent
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            useEllipsis={DEFAULT_USE_ELLIPSIS}
            onPageClick={expect.any(Function)}
          />,
        );
        jest.mocked(useStylesQuery).mockReturnValueOnce(true);
        jest.mocked(usePagination).mockReturnValue({
          ...usePaginationMock,
        });

        // When
        render(
          <PaginationComponent
            useEllipsis
            numberOfPagesShownIntoNavigation={DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={expect.any(Object)}
            onPageClick={onPageClickCallbackMock(0)}
          />,
        );

        // Then
        expect(container).toMatchSnapshot();
      });
    });
  });
});
