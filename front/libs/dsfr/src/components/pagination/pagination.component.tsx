import React from 'react';

import { t } from '@fc/i18n';

import { DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION, DEFAULT_USE_ELLIPSIS } from '../../enums';
import type { Pagination } from '../../interfaces';
import { usePagination } from './use-pagination.hook';

interface PaginationComponentProps {
  onPageClick: (nextOffset: number) => void;
  pagination: Pagination;
  numberOfPagesShownIntoNavigation?: number;
  useEdgeArrows?: boolean;
  useEllipsis?: boolean;
  useNavArrows?: boolean;
}

export const PaginationComponent: React.FC<PaginationComponentProps> = React.memo(
  ({
    numberOfPagesShownIntoNavigation = DEFAULT_NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION,
    onPageClick,
    pagination,
    useEdgeArrows = false,
    useEllipsis = DEFAULT_USE_ELLIPSIS,
    useNavArrows = true,
  }: PaginationComponentProps) => {
    const {
      currentPage,
      gtTablet,
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
          {(useEdgeArrows || !gtTablet) && (
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
          {(useNavArrows || !gtTablet) && (
            <li>
              <button
                className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
                data-testid="PaginationComponent-previous-page-button"
                disabled={isFirstPage}
                onClick={() => paginationChangeHandler(currentPage - 1)}>
                {t('TracksPage.previousPage')}
              </button>
            </li>
          )}
          {useEllipsis && showFirstPage && (
            <li>
              <button className="fr-pagination__link" onClick={() => paginationChangeHandler(0)}>
                1
              </button>
            </li>
          )}
          {useEllipsis && showFirstEllipsis && (
            <li>
              <span data-testid="PaginationComponent-first-ellipsis">...</span>
            </li>
          )}
          {navigationNumbers.map((zeroIndexPageNumber: number) => {
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
          {useEllipsis && showLastEllipsis && (
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
          {(useNavArrows || !gtTablet) && (
            <li>
              <button
                className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
                data-testid="PaginationComponent-next-page-button"
                disabled={isLastPage}
                onClick={() => paginationChangeHandler(currentPage + 1)}>
                {t('TracksPage.nextPage')}
              </button>
            </li>
          )}
          {(useEdgeArrows || !gtTablet) && (
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

PaginationComponent.displayName = 'PaginationComponent';
