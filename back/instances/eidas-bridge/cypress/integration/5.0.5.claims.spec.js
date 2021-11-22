import {
  basicSuccessScenarioFrSpEuIdp,
  checkInformationsFrSpEuIdp,
} from './mire.utils';

/**
 * @todo #242 - remove and let basic scopes
 */

describe('Claims', () => {
  it('should passthrough amr value from Eidas to FC, and send back this value to SP', () => {
    basicSuccessScenarioFrSpEuIdp();
    checkInformationsFrSpEuIdp();
  });
});
