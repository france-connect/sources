import { Given } from '@badeball/cypress-cucumber-preprocessor';

import { getUserByDescription } from '../../helpers';

Given('je suis un utilisateur {string}', function (description: string) {
  this.user = getUserByDescription(this.users, description);
});
