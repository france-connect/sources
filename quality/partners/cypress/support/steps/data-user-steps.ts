import { Given } from '@badeball/cypress-cucumber-preprocessor';

import { getUserByCriteria } from '../helpers';

Given(
  "j'utilise un compte partenaire {string}",
  function (description: string) {
    this.user = getUserByCriteria(this.users, [description]);
  },
);
