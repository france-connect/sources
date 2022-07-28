import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION, DEFAULT_USE_ELLIPSIS } from '../../enums';
import { Pagination } from '../../interfaces';
import { usePagination } from './use-pagination.hook';

export interface PaginationComponentProps {
  onPageClick: (nextOffset: number) => void;
  pagination: Pagination;
  numberOfPagesShownIntoNavigation: number;
  useEdgeArrows?: boolean;
  useEllipsis?: boolean;
  useNavArrows?: boolean;
}

export const PaginationComponent: React.FC<PaginationComponentProps> = React.memo(
  ({
    numberOfPagesShownIntoNavigation,
    onPageClick,
    pagination,
    useEdgeArrows,
    useEllipsis,
    useNavArrows,
  }: PaginationComponentProps) => {
    const gtMedium = useMediaQuery({ minWidth: 768 });

    const {
      currentPage,
      navigationNumbers,
      pagesCount,
      paginationChangeHandler,
      showFirstEllipsis,
      showFirstPage,
      showLastEllipsis,
      showLastPage,
    } = usePagination({
      numberOfPagesShownIntoNavigation,
      onPageClick,
      pagination,
    });

    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === pagesCount - 1;

    return (
      <nav aria-label="Pagination" className="fr-pagination" role="navigation">
        <ul className="fr-pagination__list">
          {(useEdgeArrows || !gtMedium) && (
            <li>
              <button
                className="fr-pagination__link fr-pagination__link--first"
                data-testid="PaginationComponent-first-page-button"
                disabled={isFirstPage}
                onClick={() => paginationChangeHandler(0)}>
                Première page
              </button>
            </li>
          )}
          {(useNavArrows || !gtMedium) && (
            <li>
              <button
                className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
                data-testid="PaginationComponent-previous-page-button"
                disabled={isFirstPage}
                onClick={() => paginationChangeHandler(currentPage - 1)}>
                Page précédente
              </button>
            </li>
          )}
          {gtMedium && useEllipsis && showFirstPage && (
            <li>
              <button className="fr-pagination__link" onClick={() => paginationChangeHandler(0)}>
                1
              </button>
            </li>
          )}
          {gtMedium && useEllipsis && showFirstEllipsis && (
            <li>
              <span data-testid="PaginationComponent-first-ellipsis">...</span>
            </li>
          )}
          {navigationNumbers
            .filter((zeroIndexPageNumber) => {
              // @TODO
              // A déplacer pour être testable plus facilement ?
              // peut être tout simplement dans le hook
              const isCurrentPage = zeroIndexPageNumber === currentPage;
              const isNextPage = zeroIndexPageNumber === currentPage + 1;
              // @NOTE si on est sur plus grand que medium (DSFR) => Tout afficher
              // Sinon sur mobile => juste les pages précédente/suivante
              return gtMedium || isCurrentPage || isNextPage;
            })
            .map((zeroIndexPageNumber) => {
              const isCurrentPage = zeroIndexPageNumber === currentPage;
              const uniqKey = `PaginationComponent-page-${zeroIndexPageNumber}`;
              const pageNumberLabel = zeroIndexPageNumber + 1;
              return (
                <li key={uniqKey}>
                  <button
                    aria-current={isCurrentPage ? 'page' : undefined}
                    className="fr-pagination__link"
                    data-testid={`PaginationComponent-page-${pageNumberLabel}-button`}
                    onClick={() => paginationChangeHandler(zeroIndexPageNumber)}>
                    {pageNumberLabel}
                  </button>
                </li>
              );
            })}
          {gtMedium && useEllipsis && showLastEllipsis && (
            <li>
              <span data-testid="PaginationComponent-last-ellipsis">...</span>
            </li>
          )}
          {showLastPage && (
            <li>
              <button
                className="fr-pagination__link"
                data-testid={`PaginationComponent-page-${pagesCount}-button`}
                onClick={() => paginationChangeHandler(pagesCount - 1)}>
                {pagesCount}
              </button>
            </li>
          )}
          {(useNavArrows || !gtMedium) && (
            <li>
              <button
                className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
                data-testid="PaginationComponent-next-page-button"
                disabled={isLastPage}
                onClick={() => paginationChangeHandler(currentPage + 1)}>
                Page suivante
              </button>
            </li>
          )}
          {(useEdgeArrows || !gtMedium) && (
            <li>
              <button
                className="fr-pagination__link fr-pagination__link--last"
                data-testid="PaginationComponent-last-page-button"
                disabled={isLastPage}
                onClick={() => paginationChangeHandler(pagesCount - 1)}>
                Dernière page
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  },
);

PaginationComponent.defaultProps = {
  numberOfPagesShownIntoNavigation: DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION,
  useEdgeArrows: false,
  useEllipsis: DEFAULT_USE_ELLIPSIS,
  useNavArrows: true,
};

PaginationComponent.displayName = 'PaginationComponent';
