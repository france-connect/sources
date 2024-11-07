import { Email } from '../types';

export class MaildevHelper {
  static isUserMessage(message: Email, userEmail: string): boolean {
    return message.to.some(({ address }) => address === userEmail);
  }

  static isMessageFromUser(message: Email, userEmail: string): boolean {
    return message.from.some(({ address }) => address === userEmail);
  }

  static deleteUserMessages(userEmail: string): void {
    cy.maildevGetAllMessages().then((messages) => {
      messages
        .filter((message) => this.isUserMessage(message, userEmail))
        .forEach((userMessage) => cy.maildevDeleteMessageById(userMessage.id));
    });
  }

  static deleteMessagesFromUser(userEmail: string): void {
    cy.maildevGetAllMessages().then((messages) => {
      messages
        .filter((message) => this.isMessageFromUser(message, userEmail))
        .forEach((userMessage) => cy.maildevDeleteMessageById(userMessage.id));
    });
  }
}
