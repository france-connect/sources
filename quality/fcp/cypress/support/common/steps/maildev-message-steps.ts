import { Given, Step } from '@badeball/cypress-cucumber-preprocessor';

import { MaildevHelper } from '../helpers';

Given("je supprime les mails envoyés à l'usager", function () {
  const { email } = this.user;
  Step(this, `je supprime les mails envoyés à "${email}"`);
});

Given('je supprime les mails envoyés à {string}', function (email: string) {
  MaildevHelper.deleteUserMessages(email);
  // Wait for maildev commands to end
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
});

Given(
  'je télécharge le fichier csv {string} en pièce jointe',
  function (fileName: string) {
    MaildevHelper.downloadAttachment(fileName, this.mail.id).then((content) => {
      cy.task('parseCsvContent', content).then(
        (records: Record<string, unknown>[]) => {
          this.csvFiles[fileName] = records;
        },
      );
    });
  },
);
