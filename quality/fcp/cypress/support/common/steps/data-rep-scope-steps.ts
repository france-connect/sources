import { Given } from '@badeball/cypress-cucumber-preprocessor';

import { getScopeByType } from '../helpers';

Given("j'utilise un mandat Aidants Connect {string}", function (type: string) {
  this.repScope = getScopeByType(this.repScopes, type);
});
