import { MaildevHelper } from '../../common/helpers';
import { ChainableElement, Maildev } from '../../common/types';

const CONNECTION_SUBJECT = 'Notification de connexion au service';

export default class UsagerNotificationConnection {
  isNotificationMessage(message: Maildev.Mail, userEmail: string): boolean {
    const isUserMessage = MaildevHelper.isUserMessage(message, userEmail);
    const isConnectionSubject = message.subject.includes(CONNECTION_SUBJECT);
    return isConnectionSubject && isUserMessage;
  }

  visitLastNotificationMessage(userEmail: string): void {
    cy.maildevGetAllMessages().then((messages) => {
      const updateMessage = messages
        .reverse()
        .find((message) => this.isNotificationMessage(message, userEmail));
      expect(
        updateMessage,
        `No emails sent to '${userEmail}' concerning an usager connection`,
      ).to.exist;
      cy.maildevVisitMessageById(updateMessage.id);
    });
  }

  getNotificationMessage(): ChainableElement {
    return cy.get('[data-testid="connection-notification-message"]');
  }

  checkConnectionNotificationMessage(
    platform: string,
    spName: string,
    idpTitle: string,
  ): void {
    const notificationMessageStart = `Une connexion avec ${platform} a eu lieu`;
    const notificationMessageTime =
      /\d{2} .+ 20\d{2} à \d{2}:\d{2} \(heure de Paris\)/;
    const notificationMessageSp = new RegExp(`sur le site.*${spName}`, 'i');
    const notificationMessageEnd = `avec votre compte ${idpTitle}`;
    this.getNotificationMessage()
      .invoke('text')
      .then((text) => text.trim().replace(/\s\s+/g, ' '))
      .should('include', notificationMessageStart)
      .should('match', notificationMessageTime)
      .should('match', notificationMessageSp)
      .should('include', notificationMessageEnd);
  }
}
