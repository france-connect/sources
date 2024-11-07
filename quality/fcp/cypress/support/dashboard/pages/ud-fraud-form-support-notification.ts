import { MaildevHelper } from '../../common/helpers';
import { Email } from '../../common/types';

const EMAIL_SUBJECT = 'Demande de support';

const DETAIL_REGEX = /<strong>([^>]+) :<\/strong> ([^\n<]+)/gm;

const fraudFormValuesContentMap = {
  authenticationEventId: 'Code d’identification de session',
  comment: 'Commentaire de l’usager',
  contactEmail: 'Email de communication',
  fraudSurveyOrigin: 'Provenance questionnaire usurpation',
  idpEmail: 'Email du compte FI',
  phoneNumber: 'Numéro de téléphone',
};

const idPivotValuesContentMap = {
  birthcountry: 'Pays de naissance',
  birthdate: 'Date de naissance',
  birthplace: 'Ville de naissance',
  firstName: 'Prénom',
  lastName: 'Nom',
};

export default class UdFraudFormSupportNotificationPage {
  private isSupportRequestFromUser(message: Email, userEmail: string): boolean {
    return (
      message.subject.includes(EMAIL_SUBJECT) &&
      MaildevHelper.isMessageFromUser(message, userEmail)
    );
  }

  getLastSupportRequest(contactEmail: string): Cypress.Chainable<Email> {
    return cy.maildevGetAllMessages().then((messages) => {
      const supportRequestMessage = messages
        .reverse()
        .find((message) =>
          this.isSupportRequestFromUser(message, contactEmail),
        );
      expect(
        supportRequestMessage,
        `No emails sent from '${contactEmail}' concerning support request`,
      ).to.exist;
      return supportRequestMessage;
    });
  }

  parseBodyContent(bodyText: string): Record<string, string> {
    expect(bodyText).to.exist;
    const arrContent = [...bodyText.matchAll(DETAIL_REGEX)];
    const bodyContent = {};
    arrContent.forEach(([, contentKey, value]) => {
      bodyContent[contentKey] = value;
    });
    return bodyContent;
  }

  checkBodyContentKeyNotExist(
    bodyContent: Record<string, string>,
    contentKey: string,
  ): void {
    expect(bodyContent).to.exist;
    expect(bodyContent[contentKey]).to.be.undefined;
  }

  checkBodyContent(
    bodyContent: Record<string, string>,
    contentKey: string,
    value: string,
  ): void {
    expect(bodyContent).to.exist;
    expect(bodyContent[contentKey]).to.exist;
    expect(bodyContent[contentKey]).to.equal(value);
  }

  checkFraudFormValuesInBodyContent(
    fraudFormValues: Record<string, string>,
    bodyContent: Record<string, string>,
  ): void {
    Object.entries(fraudFormValues).forEach(([key, value]) => {
      expect(
        fraudFormValuesContentMap[key],
        `${key} doesn't exist in the fraudFormValuesContentMap`,
      ).to.exist;
      const contentKey = fraudFormValuesContentMap[key];
      expect(
        bodyContent[contentKey],
        `${contentKey} doesn't exist in the bodyContent`,
      ).to.equal(value);
    });
  }

  checkIdPivotValuesInBodyContent(
    idPivot: Record<string, string>,
    bodyContent: Record<string, string>,
  ): void {
    Object.entries(idPivot).forEach(([key, value]) => {
      expect(
        idPivotValuesContentMap[key],
        `${key} doesn't exist in the idPivotValuesContentMap`,
      ).to.exist;
      const contentKey = idPivotValuesContentMap[key];
      expect(
        bodyContent[contentKey],
        `${contentKey} doesn't exist in the bodyContent`,
      ).to.equal(value);
    });
  }
}
