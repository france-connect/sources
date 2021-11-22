import * as _ from 'lodash';

import { EidasAttributes, EidasLevelOfAssurances } from '@fc/eidas';
import { AcrValues } from '@fc/oidc';

import { OidcScopes } from '../enums';

/**
 * Get the oidc sub in the claims to return as eidas person identifier
 *
 * @param claims The oidc claims retrieved from the userinfos endpoint
 * @return The eidas person identifier
 */
function getPersonIdentifier(claims): string[] {
  return [claims.sub];
}

/**
 * Get the oidc given name in the claims to return as eidas given name
 *
 * @param claims The oidc claims retrieved from the userinfos endpoint
 * @return The eidas given name
 */
function getCurrentGivenName(claims): string[] {
  return claims.given_name.split(' ');
}

/**
 * Get the oidc preferred username or family name in the claims to return as
 * eidas current family name
 *
 * @param claims The oidc claims retrieved from the userinfos endpoint
 * @return The eidas current family name
 */
function getCurrentFamilyName(claims): string[] {
  return [claims.preferred_username || claims.family_name];
}

/**
 * Get the oidc family name in the claims to return as eidas birth name
 *
 * @param claims The oidc claims retrieved from the userinfos endpoint
 * @return The eidas birth name
 */
function getBirthName(claims): string[] {
  return [claims.family_name];
}

/**
 * Get the oidc birthdate in the claims to return as eidas date of birth
 *
 * @param claims The oidc claims retrieved from the userinfos endpoint
 * @return The eidas date of birth
 */
function getDateOfBirth(claims): string[] {
  return [claims.birthdate?.replace(/-00/g, '-01')];
}

/**
 * Get the oidc birthplace in the claims to return as eidas place of birth
 *
 * @param claims The oidc claims retrieved from the userinfos endpoint
 * @return The eidas place of birth
 */
function getPlaceOfBirth(claims): string[] {
  return [claims.birthplace || claims.birthcountry];
}

/**
 * Get the oidc gender in the claims to return as eidas gender
 *
 * @param claims The oidc claims retrieved from the userinfos endpoint
 * @return The eidas gender
 */
function getGender(claims): string[] {
  return [_.upperFirst(claims.gender)];
}

export const AcrValuesToLevelOfAssurancesMap = {
  [AcrValues.EIDAS1]: EidasLevelOfAssurances.LOW,
  [AcrValues.EIDAS2]: EidasLevelOfAssurances.SUBSTANTIAL,
  [AcrValues.EIDAS3]: EidasLevelOfAssurances.HIGH,
};

export const ClaimsToAttributesMap = {
  [EidasAttributes.PERSON_IDENTIFIER]: getPersonIdentifier,
  [EidasAttributes.CURRENT_GIVEN_NAME]: getCurrentGivenName,
  [EidasAttributes.CURRENT_FAMILY_NAME]: getCurrentFamilyName,
  [EidasAttributes.BIRTH_NAME]: getBirthName,
  [EidasAttributes.DATE_OF_BIRTH]: getDateOfBirth,
  [EidasAttributes.PLACE_OF_BIRTH]: getPlaceOfBirth,
  [EidasAttributes.GENDER]: getGender,
};

export const ScopesToRequestedAttributesMap = {
  [OidcScopes.OPENID]: [EidasAttributes.PERSON_IDENTIFIER],
  [OidcScopes.PROFILE]: [
    EidasAttributes.GENDER,
    EidasAttributes.DATE_OF_BIRTH,
    EidasAttributes.CURRENT_GIVEN_NAME,
    EidasAttributes.CURRENT_FAMILY_NAME,
  ],
  [OidcScopes.GENDER]: [EidasAttributes.GENDER],
  [OidcScopes.BIRTHDATE]: [EidasAttributes.DATE_OF_BIRTH],
  [OidcScopes.BIRTHPLACE]: [EidasAttributes.PLACE_OF_BIRTH],
  [OidcScopes.GIVEN_NAME]: [EidasAttributes.CURRENT_GIVEN_NAME],
  [OidcScopes.FAMILY_NAME]: [EidasAttributes.CURRENT_FAMILY_NAME],
  [OidcScopes.PREFERRED_USERNAME]: [EidasAttributes.CURRENT_FAMILY_NAME],
};
