import { ChainableElement } from '../../common/types';

const CONTAINER_SELECTOR = '.fr-pagination';
const PAGE_MAPPING = {
  'dernière page': 'last-page',
  'page précédente': 'previous-page',
  'page suivante': 'next-page',
  'première page': 'first-page',
};

export default class UdPagination {
  getPaginationButton(description: string): ChainableElement {
    const pageName =
      PAGE_MAPPING[description] || description.replace('page ', 'page-');
    return cy.get(
      `${CONTAINER_SELECTOR} [data-testid="PaginationComponent-${pageName}-button"]`,
    );
  }

  checkCurrentPageNumber(pageNumber: number): void {
    this.getPaginationButton(`page ${pageNumber}`).should(
      'have.attr',
      'aria-current',
      'page',
    );
  }

  checkPaginationButtonsStatus(
    buttonsDescription: string,
    status: boolean,
  ): void {
    Object.keys(PAGE_MAPPING).forEach((pageDescription) => {
      /* the page navigation is expected to be enabled only if either:
         - the page description is present in the navigations description (true) and we expect status to be enabled (true)
         - the page description is not present in the navigations description (false) and we expect status to be disabled (false)
      */
      const expectEnabled =
        buttonsDescription.includes(pageDescription) === status;
      this.getPaginationButton(pageDescription).should(
        expectEnabled ? 'be.enabled' : 'be.disabled',
      );
    });
  }
}
