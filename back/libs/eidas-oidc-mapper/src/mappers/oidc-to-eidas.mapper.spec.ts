import * as _ from 'lodash';

import { EidasAttributes } from '@fc/eidas';

import { ClaimsToAttributesMap } from './oidc-to-eidas.mapper';

describe('OidcToEidasMapper', () => {
  describe('ClaimsToAttributesMap', () => {
    const claims = {
      sub: '57770c28716497d912e64399024b0d70acd9f7e325198f04df29ce0d0572d50fv2',
      gender: 'female',
      birthdate: '1962-08-24',
      birthcountry: '99100',
      birthplace: '75107',
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'Angela Claire Louise',
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name: 'DUBOIS',
      email: 'wossewodda-3728@yopmail.com',
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      preferred_username: 'DUMEUBLE',
    };

    describe('getPersonIdentifier', () => {
      it('should be a function', () => {
        expect(
          ClaimsToAttributesMap[EidasAttributes.PERSON_IDENTIFIER],
        ).toBeInstanceOf(Function);
      });

      it('should return the sub within claims in an array', () => {
        // setup
        const expected = [claims.sub];

        // action
        const result =
          ClaimsToAttributesMap[EidasAttributes.PERSON_IDENTIFIER](claims);

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getCurrentGivenName', () => {
      it('should be a function', () => {
        expect(
          ClaimsToAttributesMap[EidasAttributes.CURRENT_GIVEN_NAME],
        ).toBeInstanceOf(Function);
      });

      it('should return the given_name within claims splited by space', () => {
        // setup
        const expected = claims.given_name.split(' ');

        // action
        const result =
          ClaimsToAttributesMap[EidasAttributes.CURRENT_GIVEN_NAME](claims);

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getCurrentFamilyName', () => {
      it('should be a function', () => {
        expect(
          ClaimsToAttributesMap[EidasAttributes.CURRENT_FAMILY_NAME],
        ).toBeInstanceOf(Function);
      });

      it('should return the preferred_username within claims as an Array if present', () => {
        // setup
        const expected = [claims.preferred_username];

        // action
        const result =
          ClaimsToAttributesMap[EidasAttributes.CURRENT_FAMILY_NAME](claims);

        // expect
        expect(result).toStrictEqual(expected);
      });

      it('should return the family_name within claims as an Array if preferred_username is not present', () => {
        // setup
        const claimsWithoutPreferredUsername = {
          ...claims,
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          preferred_username: undefined,
        };
        const expected = [claims.family_name];

        // action
        const result = ClaimsToAttributesMap[
          EidasAttributes.CURRENT_FAMILY_NAME
        ](claimsWithoutPreferredUsername);

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getBirthName', () => {
      it('should be a function', () => {
        expect(
          ClaimsToAttributesMap[EidasAttributes.BIRTH_NAME],
        ).toBeInstanceOf(Function);
      });

      it('should return the family_name within claims as an Array', () => {
        // setup
        const expected = [claims.family_name];

        // action
        const result =
          ClaimsToAttributesMap[EidasAttributes.BIRTH_NAME](claims);

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getDateOfBirth', () => {
      it('should be a function', () => {
        expect(
          ClaimsToAttributesMap[EidasAttributes.DATE_OF_BIRTH],
        ).toBeInstanceOf(Function);
      });

      it('should return the birthdate within claims as an Array', () => {
        // setup
        const expected = [claims.birthdate];

        // action
        const result =
          ClaimsToAttributesMap[EidasAttributes.DATE_OF_BIRTH](claims);

        // expect
        expect(result).toStrictEqual(expected);
      });

      it('should return the birthdate within claims as an Array replacing the "-00" for presumed born day by "-01"', () => {
        // setup
        const claimsPresumedBornDay = {
          sub: '57770c28716497d912e64399024b0d70acd9f7e325198f04df29ce0d0572d50fv2',
          gender: 'female',
          birthdate: '1962-08-00',
          birthcountry: '99100',
          birthplace: '75107',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: 'Angela Claire Louise',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          family_name: 'DUBOIS',
          email: 'wossewodda-3728@yopmail.com',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          preferred_username: 'DUMEUBLE',
        };
        const expected = ['1962-08-01'];

        // action
        const result = ClaimsToAttributesMap[EidasAttributes.DATE_OF_BIRTH](
          claimsPresumedBornDay,
        );

        // expect
        expect(result).toStrictEqual(expected);
      });

      it('should return the birthdate within claims as an Array replacing the "-00" for presumed born day and month by "-01"', () => {
        // setup
        // setup
        const claimsPresumedBornDayMonth = {
          sub: '57770c28716497d912e64399024b0d70acd9f7e325198f04df29ce0d0572d50fv2',
          gender: 'female',
          birthdate: '1962-00-00',
          birthcountry: '99100',
          birthplace: '75107',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: 'Angela Claire Louise',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          family_name: 'DUBOIS',
          email: 'wossewodda-3728@yopmail.com',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          preferred_username: 'DUMEUBLE',
        };
        const expected = ['1962-01-01'];

        // action
        const result = ClaimsToAttributesMap[EidasAttributes.DATE_OF_BIRTH](
          claimsPresumedBornDayMonth,
        );

        // expect
        expect(result).toStrictEqual(expected);
      });

      it('should return undefined as an Array if there is no birthdate within the claims', () => {
        // setup
        // setup
        const claimsPresumedBornDayMonth = {
          sub: '57770c28716497d912e64399024b0d70acd9f7e325198f04df29ce0d0572d50fv2',
          gender: 'female',
          birthcountry: '99100',
          birthplace: '75107',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: 'Angela Claire Louise',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          family_name: 'DUBOIS',
          email: 'wossewodda-3728@yopmail.com',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          preferred_username: 'DUMEUBLE',
        };
        const expected = [undefined];

        // action
        const result = ClaimsToAttributesMap[EidasAttributes.DATE_OF_BIRTH](
          claimsPresumedBornDayMonth,
        );

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getPlaceOfBirth', () => {
      it('should be a function', () => {
        expect(
          ClaimsToAttributesMap[EidasAttributes.PLACE_OF_BIRTH],
        ).toBeInstanceOf(Function);
      });

      it('should return the birthplace within claims as an Array', () => {
        // setup
        const expected = [claims.birthplace];

        // action
        const result =
          ClaimsToAttributesMap[EidasAttributes.PLACE_OF_BIRTH](claims);

        // expect
        expect(result).toStrictEqual(expected);
      });

      it('should return the birthcopuntry within claims as an Array if there is no birthplace within claims ', () => {
        // setup
        const claimsWithoutBirthplace = {
          sub: '57770c28716497d912e64399024b0d70acd9f7e325198f04df29ce0d0572d50fv2',
          gender: 'female',
          birthdate: '1962-08-24',
          birthcountry: '99217',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: 'Angela Claire Louise',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          family_name: 'DUBOIS',
          email: 'wossewodda-3728@yopmail.com',
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          preferred_username: 'DUMEUBLE',
        };
        const expected = [claimsWithoutBirthplace.birthcountry];

        // action
        const result = ClaimsToAttributesMap[EidasAttributes.PLACE_OF_BIRTH](
          claimsWithoutBirthplace,
        );

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getGender', () => {
      it('should be a function', () => {
        expect(ClaimsToAttributesMap[EidasAttributes.GENDER]).toBeInstanceOf(
          Function,
        );
      });

      it('should return the gender within claims with first letter uppercase as an Array', () => {
        // setup
        const expected = [_.upperFirst(claims.gender)];

        // action
        const result = ClaimsToAttributesMap[EidasAttributes.GENDER](claims);

        // expect
        expect(result).toStrictEqual(expected);
      });
    });
  });
});
