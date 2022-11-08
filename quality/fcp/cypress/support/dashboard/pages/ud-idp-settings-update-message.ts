import { DateTime } from 'luxon';

import { MaildevHelper } from '../../common/helpers';
import { ChainableElement, Maildev } from '../../common/types';

const IDP_SETTINGS_UPDATE_SUBJECT =
  'Modification de vos accès dans FranceConnect';

export default class UdIdpSettingsUpdateMessage {
  isUpdateMessage(message: Maildev.Mail, userEmail: string): boolean {
    return (
      message.subject === IDP_SETTINGS_UPDATE_SUBJECT &&
      MaildevHelper.isUserMessage(message, userEmail)
    );
  }

  visitLastUpdateMessage(userEmail: string): void {
    cy.maildevGetAllMessages().then((messages) => {
      const updateMessage = messages
        .reverse()
        .find((message) => this.isUpdateMessage(message, userEmail));
      expect(
        updateMessage,
        `No emails sent to '${userEmail}' concerning idp settings update`,
      ).to.exist;
      cy.maildevVisitMessageById(updateMessage.id);
    });
  }

  getDatetimeLabel(): ChainableElement {
    return cy.get('[data-testid="updateidpsettings-date"]');
  }

  getUpdateList(): ChainableElement {
    return cy.get('[data-testid="updateidpsettings-list"]');
  }

  checkUpdateCount(updateCount: number): void {
    this.getUpdateList().find('li').should('have.length', updateCount);
  }

  checkUpdateListContainsText(updateText: string): void {
    cy.contains('[data-testid="updateidpsettings-list"]', updateText);
  }

  checkUpdateDatetimeIsNow(): void {
    const regExp = /^le (\d+ \S+ \d{4}) à (\d{2}:\d{2}:\d{2})$/;
    const datetimeLabel = this.getDatetimeLabel();
    this.checkDateIsNow(datetimeLabel, regExp);
  }

  private checkDateIsNow(
    datetimeLabel: ChainableElement,
    regExp: RegExp,
    minutesDelay = 3,
  ): void {
    datetimeLabel.invoke('text').then((datetimeText) => {
      const result = datetimeText.trim().match(regExp);
      expect(result).to.have.length(3);
      const dateTimeFormatted = `${result[1]} ${result[2]}`;
      const diffMinutes = DateTime.fromFormat(
        dateTimeFormatted,
        'd MMMM yyyy HH:mm:ss',
        {
          locale: 'fr',
          zone: 'Europe/Paris',
        },
      )
        .diffNow()
        .as('minutes');
      expect(diffMinutes).to.be.lessThan(0).greaterThan(-minutesDelay);
    });
  }
}
