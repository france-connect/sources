import {
  EidasAttributes,
  EidasLevelOfAssurances,
  EidasNameIdFormats,
  EidasRequest,
  EidasSpTypes,
} from '@fc/eidas';
import { EidasCountries } from '@fc/eidas-country';

export const requestJsonMock: EidasRequest = {
  citizenCountryCode: EidasCountries.BELGIUM,
  id: 'Auduye7263',
  issuer: 'EIDASBridge',
  levelOfAssurance: EidasLevelOfAssurances.SUBSTANTIAL,
  nameIdFormat: EidasNameIdFormats.PERSISTENT,
  providerName: 'FranceConnect',
  spType: EidasSpTypes.PUBLIC,
  relayState: 'myState',
  requestedAttributes: [
    EidasAttributes.PERSON_IDENTIFIER,
    EidasAttributes.CURRENT_FAMILY_NAME,
    EidasAttributes.CURRENT_GIVEN_NAME,
    EidasAttributes.DATE_OF_BIRTH,
    EidasAttributes.CURRENT_ADDRESS,
    EidasAttributes.GENDER,
    EidasAttributes.BIRTH_NAME,
    EidasAttributes.PLACE_OF_BIRTH,
  ],
};
