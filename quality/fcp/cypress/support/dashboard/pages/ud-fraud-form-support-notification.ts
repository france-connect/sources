import { MaildevHelper } from '../../common/helpers';
import { ChainableElement, Email } from '../../common/types';

const EMAIL_SUBJECT = 'Demande de support';

const CSV_FORMATS = {
  FI: [
    'date',
    'idpName',
    'idpSub',
    'platform',
    'interactionAcr',
    'city',
    'country',
    'ipAddress',
  ],
  FS: [
    'date',
    'spName',
    'spSub',
    'platform',
    'interactionAcr',
    'city',
    'country',
    'ipAddress',
  ],
};

export default class UdFraudFormSupportNotificationPage {
  private isSupportRequestFromUser(message: Email, userEmail: string): boolean {
    return (
      message.subject.includes(EMAIL_SUBJECT) &&
      MaildevHelper.isMessageFromUser(message, userEmail)
    );
  }

  visitLastSupportRequest(contactEmail: string): Cypress.Chainable<Email> {
    return cy.maildevGetAllMessages().then((messages: Email[]) => {
      const supportRequestMessage = messages
        .reverse()
        .find((message) =>
          this.isSupportRequestFromUser(message, contactEmail),
        );
      expect(
        supportRequestMessage,
        `No emails sent from '${contactEmail}' concerning support request`,
      ).to.exist;
      cy.maildevVisitMessageById(supportRequestMessage.id);

      return cy.wrap(supportRequestMessage);
    });
  }

  getValueFromContentKey(contentKey: string): ChainableElement {
    return cy.get(`[data-testid="fraud-form-email-${contentKey}"]`);
  }

  checkContentKeyNotExist(contentKey: string): void {
    this.getValueFromContentKey(contentKey).should('not.exist');
  }

  checkContentKeyHasValue(contentKey: string, value: string): void {
    this.getValueFromContentKey(contentKey).should('have.text', value);
  }

  checkCsvFileHasFormat(
    records: Record<string, unknown>[],
    partnerType: string,
  ): void {
    const format = CSV_FORMATS[partnerType];
    expect(format, `the "${partnerType}" format doesn't exist`).to.exist;
    expect(
      records.length,
      'impossible to check the format of an empty file',
    ).to.be.greaterThan(0);
    const recordKeys = Object.keys(records[0]);
    expect(recordKeys).to.deep.equal(format);
  }
}
