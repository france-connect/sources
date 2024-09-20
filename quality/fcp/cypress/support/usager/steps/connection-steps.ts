import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import UsagerNotificationConnection from '../pages/notification-email-page';

const notificationConnection = new UsagerNotificationConnection();

Then(
  /^le mail "notification de connexion" (est|n'est pas) envoyé$/,
  function (text: string) {
    const exist = text === 'est' ? 'exist' : 'not.exist';
    const { email } = this.user;
    // Wait for the email to reach maildev
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    notificationConnection.getLastNotificationMessage(email).should(exist);
  },
);

Then(
  /^le message de notification de connexion à (FranceConnect|FranceConnect\+) est correct$/,
  function (platform: string) {
    const { name: spName } = this.serviceProvider;
    const { title: idpTitle } = this.identityProvider;
    const { email } = this.user;
    notificationConnection.visitLastNotificationMessage(email);
    notificationConnection.checkConnectionNotificationMessage(
      platform,
      spName,
      idpTitle,
    );
    notificationConnection.checkConnectionNotificationHasBrowsingSessionId();
  },
);

When('je supprime tous les mails', function () {
  cy.maildevDeleteAllMessages();
});
