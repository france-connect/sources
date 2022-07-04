import { DateTime } from 'luxon';

import { ChainableElement } from '../../common/types';

const DATE_REGEXP = /^\d\d? \S+ \d{4}$/;
const DATE_TIME_REGEXP =
  /^(\d{2}\/\d{2}\/\d{4}) à (\d\d:\d\d) \(heure de Paris\)$/;
const LOCATION_REGEXP = /^\w+ \(\w+\)$/;

const checkLabelIsDisplayed = (
  label: ChainableElement,
  regExp: RegExp,
): void => {
  label
    .should('be.visible')
    .invoke('text')
    .should((text) => {
      expect(text).to.match(regExp);
    });
};

const checkDateIsNow = (
  datetimeLabel: ChainableElement,
  regExp: RegExp,
  minutesDelay = 3,
): void => {
  datetimeLabel.invoke('text').then((datetimeText) => {
    const result = datetimeText.trim().match(regExp);
    expect(result).to.have.length(3);
    const dateTimeFormatted = `${result[1]} ${result[2]}`;
    const diffMinutes = DateTime.fromFormat(
      dateTimeFormatted,
      'dd/MM/yyyy HH:mm',
      {
        zone: 'Europe/Paris',
      },
    )
      .diffNow()
      .as('minutes');
    expect(diffMinutes).to.be.lessThan(0).greaterThan(-minutesDelay);
  });
};

export default class UdEventCard {
  index: number;

  constructor(index: number) {
    this.index = index;
  }

  getCardButton(): ChainableElement {
    return cy.get(`#tracks-list button`).eq(this.index);
  }

  getPlatformBadge(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="TrackCardBadgeComponent-platform-badge"]',
    );
  }

  getActionTypeBadge(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="TrackCardBadgeComponent-action-badge"]',
    );
  }

  getEventDateLabel(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="TrackCardHeaderComponent-connection-date-label"]',
    );
  }

  getSpTitleLabel(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="TrackCardHeaderComponent-sp-label"]',
    );
  }

  getConnectionDatetimeLabel(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="ConnectionComponent-connection-datetime-label"]',
    );
  }

  getLocationLabel(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="ConnectionComponent-location-label"]',
    );
  }

  getIdpNameLabel(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="ConnectionComponent-idp-label"]',
    );
  }

  getEidasLabel(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="ConnectionComponent-eidas-label"]',
    );
  }

  getClaimsDateLabel(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="ClaimsComponent-date-label"]',
    );
  }

  getClaimsTitleLabel(fdName: string): ChainableElement {
    return this.getCardButton().find(
      `[data-testid="ClaimsComponent-claims-title-${fdName}"]`,
    );
  }

  getClaimsList(fdName: string): ChainableElement {
    return this.getCardButton().find(
      `ul[data-testid="ClaimsComponent-claims-list-${fdName}"] li`,
    );
  }

  checkEventDateIsDisplayed(): void {
    checkLabelIsDisplayed(this.getEventDateLabel(), DATE_REGEXP);
  }

  checkEventDateIsToday(): void {
    const today = DateTime.now()
      .setZone('Europe/Paris')
      .setLocale('fr')
      .toLocaleString(DateTime.DATE_FULL);
    this.getEventDateLabel().should('have.text', today);
  }

  checkConnectionDatetimeIsDisplayed(): void {
    checkLabelIsDisplayed(this.getConnectionDatetimeLabel(), DATE_TIME_REGEXP);
  }

  checkConnectionDatetimeIsNow(): void {
    checkDateIsNow(this.getConnectionDatetimeLabel(), DATE_TIME_REGEXP);
  }

  checkLocationIsDisplayed(): void {
    checkLabelIsDisplayed(this.getLocationLabel(), LOCATION_REGEXP);
  }

  checkClaimsDateIsDisplayed(): void {
    checkLabelIsDisplayed(this.getClaimsDateLabel(), DATE_TIME_REGEXP);
  }

  checkClaimsDateIsNow(): void {
    checkDateIsNow(this.getClaimsDateLabel(), DATE_TIME_REGEXP);
  }
}
