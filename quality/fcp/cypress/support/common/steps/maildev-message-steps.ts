import { Given } from '@badeball/cypress-cucumber-preprocessor';

import { MaildevHelper, User } from '../helpers';

Given("je supprime les mails envoyés à l'usager", function () {
  const user: User = this.user;
  MaildevHelper.deleteUserMessages(user.email);
  // Wait for maildev commands to end
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
});
