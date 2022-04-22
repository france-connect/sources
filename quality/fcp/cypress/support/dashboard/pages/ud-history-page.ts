import { DateTime, Interval } from 'luxon';

import { ChainableElement } from '../../common/types';

export default class UdHistoryPage {
  udRootUrl: string;

  constructor(udRootUrl: string) {
    this.udRootUrl = udRootUrl;
  }

  get userName(): ChainableElement {
    return cy.get('#page-container h2');
  }

  checkIsVisible(): void {
    cy.url().should('equal', `${this.udRootUrl}/history`);
  }

  checkIfBeforeNbOfMonth(type: string, month: number): void {
    this.traces.filter(type).each(($item) => {
      const time = $item.data('time');
      const date = DateTime.fromMillis(time);
      const now = DateTime.now();
      const diff = Interval.fromDateTimes(date, now);
      expect(diff.length('month')).to.lt(month);
    });
  }

  checkIfTracksAreSorted(): void {
    const currentTime = DateTime.now().toMillis();
    this.traces
      .then(($tracks) => $tracks.map((_, track) => +track.dataset.time))
      // this block compares a timestamp to be older than its previous one.
      .each((time, index, list: number[]) => {
        const refTime = index ? list[index - 1] : currentTime;
        expect(time).to.lte(refTime);
      });
  }

  get traces(): ChainableElement {
    return cy.get("#tracks-list .card[class*='track-FranceConnect']", {
      timeout: 10000,
    });
  }
}
