import { Then } from '@badeball/cypress-cucumber-preprocessor';

import { User } from '../../common/helpers';
import { IdentityProvider } from '../../common/types';
import UdIdpSettingsUpdateMessage from '../pages/ud-idp-settings-update-message';

const updateMessage = new UdIdpSettingsUpdateMessage();

Then(/^le mail "modification de préférences FI" est envoyé$/, function () {
  const user: User = this.user;
  // Wait for the email to reach maildev
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  updateMessage.visitLastUpdateMessage(user.email);
  // Wait for all the mail images to load
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(300);
});

Then(
  /^la date et heure est correcte dans le mail "modification de préférences FI"$/,
  function () {
    updateMessage.checkUpdateDatetimeIsNow();
  },
);

Then(
  /^(\d+) modifications? (?:est|sont) listées? dans le mail "modification de préférences FI"$/,
  function (updateCount: number) {
    updateMessage.checkUpdateCount(updateCount);
  },
);

Then(
  /^le fournisseur d'identité est (bloqué|autorisé) dans le mail "modification de préférences FI"$/,
  function (status) {
    const { title }: IdentityProvider = this.identityProvider;
    const statusText =
      status === 'bloqué' ? 'a été bloqué' : 'est désormais autorisé';
    const updateText = `Le compte ${title} ${statusText}`;
    updateMessage.checkUpdateListContainsText(updateText);
  },
);

Then(
  /^les futurs fournisseurs d'identité sont (bloqués|autorisés) dans le mail "modification de préférences FI"$/,
  function (status) {
    const updateText = `Les futurs comptes seront ${status} par défaut`;
    updateMessage.checkUpdateListContainsText(updateText);
  },
);
