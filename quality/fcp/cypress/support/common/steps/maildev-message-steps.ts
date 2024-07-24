import { Given } from '@badeball/cypress-cucumber-preprocessor';

import { MaildevHelper } from '../helpers';

Given("je supprime les mails envoyés à l'usager", function () {
  const { email } = this.user;
  MaildevHelper.deleteUserMessages(email);
  // Wait for maildev commands to end
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
});
