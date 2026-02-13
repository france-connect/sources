import { Email } from '../types';

export class MaildevHelper {
  static get baseUrl(): string {
    let baseUrl = `${Cypress.env('MAILDEV_PROTOCOL')}://${Cypress.env(
      'MAILDEV_HOST',
    )}`;

    if (Cypress.env('MAILDEV_API_PORT')) {
      baseUrl += `:${Cypress.env('MAILDEV_API_PORT')}`;
    }
    return baseUrl;
  }

  static visitMessageById(id: string): void {
    const url = `${MaildevHelper.baseUrl}/email/${id}/html`;
    cy.visit(url);
  }

  static isUserMessage(message: Email, userEmail: string): boolean {
    return message.to.some(({ address }) => address === userEmail);
  }

  static isMessageFromUser(message: Email, userEmail: string): boolean {
    return message.from.some(({ address }) => address === userEmail);
  }

  static deleteUserMessages(userEmail: string): void {
    cy.maildevGetAllMessages().then((messages: Email[]) => {
      messages
        .filter((message) => this.isUserMessage(message, userEmail))
        .forEach((userMessage) => cy.maildevDeleteMessageById(userMessage.id));
    });
  }

  static deleteMessagesFromUser(userEmail: string): void {
    cy.maildevGetAllMessages().then((messages: Email[]) => {
      messages
        .filter((message) => this.isMessageFromUser(message, userEmail))
        .forEach((userMessage) => cy.maildevDeleteMessageById(userMessage.id));
    });
  }

  static hasAttachment(message: Email, name: string): boolean {
    return message.attachments.some(({ fileName }) => fileName === name);
  }

  static downloadAttachment(
    fileName: string,
    emailId: string,
  ): Cypress.Chainable<string> {
    return cy
      .request({
        encoding: 'utf8',
        url: `${MaildevHelper.baseUrl}/email/${emailId}/attachment/${fileName}`,
      })
      .then((response) => {
        return response.body;
      });
  }
}
