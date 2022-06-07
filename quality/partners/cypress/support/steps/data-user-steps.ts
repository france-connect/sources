import { Given } from 'cypress-cucumber-preprocessor/steps';

import { getUserByCriteria } from '../helpers';

Given("j'utilise un compte partenaire {string}", function (description) {
  this.user = getUserByCriteria(this.users, [description]);
});
