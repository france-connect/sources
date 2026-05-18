import { Given } from '@badeball/cypress-cucumber-preprocessor';

import {
  getRandomNumberStringWithLength,
  getUserByDescription,
} from '../../helpers';

Given('je suis un utilisateur {string}', function (description: string) {
  this.user = getUserByDescription(this.users, description);
});

Given(
  'je suis le demandeur du datapass pour le fournisseur de service',
  function () {
    expect(this.serviceProvider).to.exist;
    const description = this.serviceProvider.applicantUserDescription;
    this.user = getUserByDescription(this.users, description);
  },
);

Given(
  'je suis le contact technique du datapass pour le fournisseur de service',
  function () {
    expect(this.serviceProvider).to.exist;
    const description = this.serviceProvider.technicalUserDescription;
    this.user = getUserByDescription(this.users, description);
  },
);

Given(
  `l'utilisateur {string} a une nouvelle adresse email`,
  function (description: string) {
    const user = getUserByDescription(this.users, description);
    const randomId = getRandomNumberStringWithLength(16);
    user.claims.email = `new-${randomId}-${user.claims.email}`;
    // Change uid/sub to avoid sub conflicts for the account created with the new email
    user.claims.uid = randomId;
    user.claims.sub = randomId;
  },
);

Given(
  `l'utilisateur {string} a la même adresse email que l'utilisateur {string}`,
  function (user1Description: string, user2Description: string) {
    const user1 = getUserByDescription(this.users, user1Description);
    const user2 = getUserByDescription(this.users, user2Description);
    user1.claims.email = user2.claims.email;
    user1.claims.uid = user2.claims.uid;
  },
);

Given(
  /^l'utilisateur "([^"]+)" a un nouveau (prénom|nom d'usage)$/,
  function (description: string, claimLabel: string) {
    const user = getUserByDescription(this.users, description);
    const claimKey = claimLabel === 'prénom' ? 'given_name' : 'usual_name';
    const randomId = getRandomNumberStringWithLength(8);
    user.claims[claimKey] = `${user.claims[claimKey]}${randomId}`;
  },
);

Given(
  `l'utilisateur {string} a un nouveau numéro de téléphone`,
  function (description: string) {
    const user = getUserByDescription(this.users, description);
    const claimKey = 'phone_number';
    const randomId = getRandomNumberStringWithLength(8, 8);
    user.claims[claimKey] = `06${randomId}`;
  },
);

Given(
  `l'utilisateur {string} n'a pas de numéro de téléphone`,
  function (description: string) {
    const user = getUserByDescription(this.users, description);
    user.claims.phone_number = null;
  },
);

Given(
  `l'utilisateur {string} a le numéro de téléphone {string}`,
  function (description: string, phone: string) {
    const user = getUserByDescription(this.users, description);
    user.claims.phone_number = phone;
  },
);
