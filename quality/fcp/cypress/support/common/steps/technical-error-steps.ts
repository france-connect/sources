import { Given } from 'cypress-cucumber-preprocessor/steps';

import { clearAllCookies } from '../helpers';

Given('je supprime tous les cookies', function () {
  clearAllCookies();
});
