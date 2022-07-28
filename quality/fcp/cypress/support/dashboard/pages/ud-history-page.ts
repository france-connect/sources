import { DateTime, Interval } from 'luxon';

import { ChainableElement } from '../../common/types';
import UdEventCard from './ud-event-card-component';

export default class UdHistoryPage {
  udRootUrl: string;
  lastEventTimestamp: number;

  constructor(udRootUrl: string) {
    this.udRootUrl = udRootUrl;
    this.lastEventTimestamp = 0;
  }

  checkIsVisible(): void {
    cy.url().should('equal', `${this.udRootUrl}/history`);
  }

  checkIfBeforeNbOfMonth(platform: string, month: number): void {
    this.getAllEventCardsForPlatform(platform).each(($item) => {
      const time = $item.data('time');
      const date = DateTime.fromMillis(time);
      // Use start of day to match ElasticSearch request
      const now = DateTime.now().setZone('Europe/Paris').startOf('day');
      const diff = Interval.fromDateTimes(date, now);
      expect(diff.length('month')).to.lt(month);
    });
  }

  checkIfEventsAreSortedOnCurrentPage(): void {
    const currentTime = DateTime.now().toMillis();
    this.getAllEventCards()
      .then(($tracks) => $tracks.map((_, track) => +track.dataset.time))
      // this block compares a timestamp to be older than its previous one.
      .each((time, index, list: number[]) => {
        const refTime = index ? list[index - 1] : currentTime;
        expect(time).to.lte(refTime);
      });
  }

  getFirstEventTimestamp(): Cypress.Chainable<number> {
    return this.getEventCard(1).getEventTimestamp();
  }

  getLastEventTimestamp(): Cypress.Chainable<number> {
    return this.getAllEventCards().then(($elems) => {
      expect($elems.length).to.be.gt(0);
      const lastCardIndex = $elems.length - 1;
      const udEventCard = this.getEventCard(lastCardIndex);
      return udEventCard.getEventTimestamp();
    });
  }

  /**
   * Check that the events in current page are older than the one checked previously
   */
  checkIfEventsAreSortedSinceLastCall(): void {
    if (this.lastEventTimestamp) {
      this.getFirstEventTimestamp().should('be.lte', this.lastEventTimestamp);
    }
    this.getLastEventTimestamp().then((timestamp) => {
      cy.log('lastEventTimestamp', timestamp);
      this.lastEventTimestamp = timestamp;
    });
  }

  /**
   * Retrieves the event card matching the platform, action and sp (the first found by default)
   * @param platform FranceConnect or FranceConnect+
   * @param actionType event action (e.g. Connexion)
   * @param spTitle title of the service provider
   * @param eventIndex index of the event in the matching events (1 by default)
   * @returns an EventCard component or null if not found
   */
  findEventCard(
    platform: string,
    actionType: string,
    spTitle: string,
    eventIndex = 1,
  ): Cypress.Chainable<UdEventCard | null> {
    let cardIndex;
    return this.getAllEventCards()
      .each(($el, index) => {
        const platformActual = $el
          .find('[data-testid="TrackCardBadgeComponent-platform-badge"]')
          .text();
        const actionTypeActual = $el
          .find('[data-testid="TrackCardBadgeComponent-action-badge"]')
          .text();
        const spTitleActual = $el
          .find('[data-testid="TrackCardHeaderComponent-sp-label"]')
          .text();
        if (
          platformActual === platform &&
          actionTypeActual === actionType &&
          spTitleActual === spTitle
        ) {
          if (eventIndex === 1) {
            cardIndex = index;
            return false;
          }
          eventIndex = eventIndex - 1;
        }
      })
      .then(() => {
        if (cardIndex != undefined) {
          return this.getEventCard(cardIndex);
        } else {
          return null;
        }
      });
  }

  // Index starting with 0
  getEventCard(index: number): UdEventCard {
    return new UdEventCard(index);
  }

  getAllEventCards(): ChainableElement {
    return cy.get('#tracks-list button[data-time]');
  }

  getAllEventCardsForPlatform(platform: string): ChainableElement {
    return this.getAllEventCards().filter(
      `#tracks-list button[data-testid^="${platform}-"]`,
    );
  }
}
