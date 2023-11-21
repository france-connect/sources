import { Then } from '@badeball/cypress-cucumber-preprocessor';

import { User } from '../../common/helpers';
import { IdentityProvider, ServiceProvider } from '../../common/types';
import UsagerNotificationConnection from '../pages/notification-email-page';

const notificationConnection = new UsagerNotificationConnection();

Then(/^le mail "notification de connexion" est envoyé$/, function () {
  const user: User = this.user;
  // Wait for the email to reach maildev
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  notificationConnection.visitLastNotificationMessage(user.email);
});

Then(
  /^le message de notification de connexion à (FranceConnect|FranceConnect\+) est correct$/,
  function (platform: string) {
    const { name: spName }: ServiceProvider = this.serviceProvider;
    const { title: idpTitle }: IdentityProvider = this.identityProvider;
    notificationConnection.checkConnectionNotificationMessage(
      platform,
      spName,
      idpTitle,
    );
  },
);
