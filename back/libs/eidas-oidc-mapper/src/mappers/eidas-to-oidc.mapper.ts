import _ = require('lodash');
import {
  EidasAttributes,
  EidasLevelOfAssurances,
  EidasResponseAttributes,
} from '@fc/eidas';
import { IOidcIdentity } from '@fc/oidc';

import { AcrValues } from '../enums';

export const LevelOfAssurancesToAcrValueMap = {
  [EidasLevelOfAssurances.LOW]: AcrValues.EIDAS2,
  [EidasLevelOfAssurances.SUBSTANTIAL]: AcrValues.EIDAS2,
  [EidasLevelOfAssurances.HIGH]: AcrValues.EIDAS3,
};

export const RequestedAttributesToScopesMap = {
  [EidasAttributes.PERSON_IDENTIFIER]: ['openid'],
  [EidasAttributes.CURRENT_GIVEN_NAME]: ['given_name'],
  [EidasAttributes.CURRENT_FAMILY_NAME]: ['preferred_username', 'family_name'],
  [EidasAttributes.BIRTH_NAME]: ['family_name'],
  [EidasAttributes.DATE_OF_BIRTH]: ['birthdate'],
  [EidasAttributes.PLACE_OF_BIRTH]: ['birthplace', 'birthcountry'],
  [EidasAttributes.GENDER]: ['gender'],
};

function getSub(attributes: EidasResponseAttributes): Partial<IOidcIdentity> {
  const [sub] = attributes.personIdentifier || [];

  return { sub };
}

function getGender(
  attributes: EidasResponseAttributes,
): Partial<IOidcIdentity> {
  const [eidasGender] = attributes[EidasAttributes.GENDER] || [];

  let gender;
  if (eidasGender) {
    gender = _.lowerFirst(eidasGender);
  }

  return { gender };
}

function getBirthdate(
  attributes: EidasResponseAttributes,
): Partial<IOidcIdentity> {
  const [birthdate] = attributes[EidasAttributes.DATE_OF_BIRTH] || [];

  return { birthdate };
}

function getBirthplace(
  attributes: EidasResponseAttributes,
): Partial<IOidcIdentity> {
  const [birthplace] = attributes[EidasAttributes.PLACE_OF_BIRTH] || [];

  return { birthplace };
}

function getGivenNames(
  attributes: EidasResponseAttributes,
): Partial<IOidcIdentity> {
  const given_name = attributes[EidasAttributes.CURRENT_GIVEN_NAME]?.join(' ');

  return { given_name };
}

function getFamilyName(
  attributes: EidasResponseAttributes,
): Partial<IOidcIdentity> {
  const family_name =
    attributes[EidasAttributes.CURRENT_FAMILY_NAME]?.join(' ');

  return { family_name, preferred_username: family_name };
}

export const AttributesToClaimsMap = {
  [EidasAttributes.PERSON_IDENTIFIER]: getSub,
  [EidasAttributes.GENDER]: getGender,
  [EidasAttributes.DATE_OF_BIRTH]: getBirthdate,
  [EidasAttributes.PLACE_OF_BIRTH]: getBirthplace,
  [EidasAttributes.CURRENT_GIVEN_NAME]: getGivenNames,
  [EidasAttributes.CURRENT_FAMILY_NAME]: getFamilyName,
};
